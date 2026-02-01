<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use MeShaon\RequestAnalytics\Services\AnalyticsService as BaseAnalyticsService;

/**
 * Extends the request-analytics package AnalyticsService to fix return types
 * when the database returns aggregate values (e.g. COUNT) as strings.
 */
class AnalyticsService extends BaseAnalyticsService
{
    /**
     * Ensure we always return int; some DB drivers return COUNT() as string.
     */
    public function getUniqueVisitorCount($query): int
    {
        $value = (clone $query)
            ->select(DB::raw($this->getUniqueVisitorCountExpression()))
            ->value('unique_visitor_count');

        return (int) ($value ?? 0);
    }
}
