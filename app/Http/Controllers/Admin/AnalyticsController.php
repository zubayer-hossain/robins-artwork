<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use MeShaon\RequestAnalytics\Services\AnalyticsService;
use MeShaon\RequestAnalytics\Services\DashboardAnalyticsService;

class AnalyticsController extends Controller
{
    public function __construct(
        protected DashboardAnalyticsService $dashboardService,
        protected AnalyticsService $analyticsService
    ) {}

    public function index(Request $request)
    {
        $params = [];

        if ($request->has('start_date') && $request->has('end_date')) {
            $params['start_date'] = $request->input('start_date');
            $params['end_date'] = $request->input('end_date');
        } else {
            $dateRangeInput = $request->input('date_range', 30);
            $dateRange = is_numeric($dateRangeInput) && (int) $dateRangeInput > 0
                ? (int) $dateRangeInput
                : 30;
            $params['date_range'] = $dateRange;
        }

        $params['request_category'] = $request->input('request_category', null);

        $dateRangeForFilters = $params['date_range'] ?? 30;

        try {
            $data = $this->dashboardService->getDashboardData($params);
            try {
                $data = array_merge($data, $this->getExtraAnalytics($params));
            } catch (\Throwable $extraEx) {
                Log::debug('Extra analytics failed: ' . $extraEx->getMessage());
                $data = array_merge($data, [
                    'cities' => [],
                    'languages' => [],
                    'httpMethods' => [],
                    'averageResponseTime' => null,
                    'recentVisits' => [],
                ]);
            }
            $analyticsError = null;
        } catch (\Throwable $e) {
            Log::warning('Analytics dashboard error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            $data = $this->emptyAnalyticsData($dateRangeForFilters);
            $analyticsError = $this->userFriendlyAnalyticsError($e);
        }

        return Inertia::render('Admin/Analytics/Index', [
            'analytics' => $data,
            'analyticsError' => $analyticsError,
            'filters' => [
                'date_range' => $dateRangeForFilters,
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'request_category' => $request->input('request_category'),
            ],
        ]);
    }

    /**
     * Extra analytics from request_analytics table: cities, languages, HTTP methods, response time, recent visits.
     */
    private function getExtraAnalytics(array $params): array
    {
        $dateRange = $this->analyticsService->getDateRange($params);
        $query = $this->analyticsService->getBaseQuery($dateRange, $params['request_category'] ?? null);

        // Top cities (where city is not null/empty)
        $cities = (clone $query)
            ->select('city as name', DB::raw('COUNT(*) as count'))
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();

        // Top languages: extract primary code from Accept-Language (e.g. "en-US,en;q=0.9,bn;q=0.8" -> "en-US") and show readable names
        $languageRows = (clone $query)
            ->select(DB::raw('TRIM(SUBSTRING_INDEX(language, ",", 1)) as primary_code'), DB::raw('COUNT(*) as count'))
            ->whereNotNull('language')
            ->where('language', '!=', '')
            ->groupBy(DB::raw('TRIM(SUBSTRING_INDEX(language, ",", 1))'))
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        $languages = $languageRows->map(function ($row) {
            return [
                'name' => $this->languageCodeToName($row->primary_code),
                'code' => $row->primary_code,
                'count' => $row->count,
            ];
        })->toArray();

        // HTTP methods breakdown
        $httpMethods = (clone $query)
            ->select('http_method as name', DB::raw('COUNT(*) as count'))
            ->whereNotNull('http_method')
            ->groupBy('http_method')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->toArray();

        // Average response time (ms) - column is response_time in milliseconds
        $avgResponseMs = (clone $query)
            ->selectRaw('AVG(response_time) as avg_ms')
            ->value('avg_ms');
        $averageResponseTime = $avgResponseMs !== null
            ? (round((float) $avgResponseMs) >= 1000
                ? round((float) $avgResponseMs / 1000, 1) . 's'
                : round((float) $avgResponseMs) . ' ms')
            : null;

        // Recent visits (last 15)
        $recentVisits = (clone $query)
            ->select('path', 'page_title', 'visited_at', 'country', 'city', 'device', 'browser', 'operating_system', 'request_category', 'response_time')
            ->orderByDesc('visited_at')
            ->limit(15)
            ->get()
            ->map(function ($row) {
                $visitedAt = $row->visited_at;
                if ($visitedAt instanceof \DateTimeInterface) {
                    $visitedAt = $visitedAt->format('M j, Y H:i');
                } elseif (is_string($visitedAt)) {
                    $visitedAt = \Carbon\Carbon::parse($visitedAt)->format('M j, Y H:i');
                } else {
                    $visitedAt = '-';
                }
                return [
                    'path' => $row->path,
                    'page_title' => $row->page_title ?? '-',
                    'visited_at' => $visitedAt,
                    'country' => $row->country ?? '-',
                    'city' => $row->city ?? '-',
                    'device' => $row->device ?? '-',
                    'browser' => $row->browser ?? '-',
                    'os' => $row->operating_system ?? '-',
                    'request_category' => $row->request_category ?? '-',
                    'response_time_ms' => $row->response_time !== null ? (int) $row->response_time : null,
                ];
            })
            ->toArray();

        return [
            'cities' => $cities,
            'languages' => $languages,
            'httpMethods' => $httpMethods,
            'averageResponseTime' => $averageResponseTime,
            'recentVisits' => $recentVisits,
        ];
    }

    private function emptyAnalyticsData(int $dateRange): array
    {
        return [
            'browsers' => [],
            'operatingSystems' => [],
            'devices' => [],
            'pages' => [],
            'referrers' => [],
            'labels' => [],
            'datasets' => [],
            'average' => [
                'views' => 0,
                'visitors' => 0,
                'bounce_rate' => '0%',
                'average_visit_time' => '0s',
            ],
            'countries' => [],
            'dateRange' => $dateRange,
            'cities' => [],
            'languages' => [],
            'httpMethods' => [],
            'averageResponseTime' => null,
            'recentVisits' => [],
        ];
    }

    /**
     * Map Accept-Language primary code (e.g. en-US, en-US;q=0.9, en, bn) to a human-readable name.
     */
    private function languageCodeToName(?string $code): string
    {
        $code = $code !== null ? trim($code) : '';
        if ($code === '') {
            return 'Unknown';
        }
        // Strip quality suffix, e.g. "en-US;q=0.9" -> "en-US"
        if (str_contains($code, ';')) {
            $code = trim(explode(';', $code)[0]);
        }

        $map = [
            'en' => 'English',
            'en-US' => 'English (US)',
            'en-GB' => 'English (UK)',
            'en-AU' => 'English (Australia)',
            'en-IN' => 'English (India)',
            'bn' => 'Bengali',
            'bn-BD' => 'Bengali (Bangladesh)',
            'bn-IN' => 'Bengali (India)',
            'es' => 'Spanish',
            'es-ES' => 'Spanish (Spain)',
            'es-MX' => 'Spanish (Mexico)',
            'fr' => 'French',
            'fr-FR' => 'French (France)',
            'de' => 'German',
            'de-DE' => 'German (Germany)',
            'hi' => 'Hindi',
            'hi-IN' => 'Hindi (India)',
            'ar' => 'Arabic',
            'pt' => 'Portuguese',
            'pt-BR' => 'Portuguese (Brazil)',
            'pt-PT' => 'Portuguese (Portugal)',
            'zh' => 'Chinese',
            'zh-CN' => 'Chinese (Simplified)',
            'zh-TW' => 'Chinese (Traditional)',
            'ja' => 'Japanese',
            'ko' => 'Korean',
            'ru' => 'Russian',
            'it' => 'Italian',
            'nl' => 'Dutch',
            'pl' => 'Polish',
            'tr' => 'Turkish',
            'vi' => 'Vietnamese',
            'th' => 'Thai',
            'id' => 'Indonesian',
            'ms' => 'Malay',
            'uk' => 'Ukrainian',
        ];

        return $map[$code] ?? $map[substr($code, 0, 2)] ?? $code;
    }

    private function userFriendlyAnalyticsError(\Throwable $e): string
    {
        $message = $e->getMessage();
        if (str_contains($message, "doesn't exist") || str_contains($message, 'does not exist')) {
            return 'Analytics table is missing. Run: php artisan migrate';
        }
        if (str_contains($message, 'SQLSTATE') || str_contains($message, 'connection')) {
            return 'Database error loading analytics. Check logs and migration.';
        }
        return 'Unable to load analytics. Check server logs.';
    }
}
