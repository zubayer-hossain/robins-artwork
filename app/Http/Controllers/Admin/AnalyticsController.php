<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use MeShaon\RequestAnalytics\Services\DashboardAnalyticsService;

class AnalyticsController extends Controller
{
    public function __construct(protected DashboardAnalyticsService $dashboardService) {}

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
        ];
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
