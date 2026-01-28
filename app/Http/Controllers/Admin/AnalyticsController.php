<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        $data = $this->dashboardService->getDashboardData($params);

        return Inertia::render('Admin/Analytics/Index', [
            'analytics' => $data,
            'filters' => [
                'date_range' => $params['date_range'] ?? 30,
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'request_category' => $request->input('request_category'),
            ],
        ]);
    }
}
