import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    BarChart3, 
    Eye, 
    Users, 
    TrendingUp, 
    Clock, 
    Globe, 
    Monitor, 
    Smartphone,
    Chrome,
    Link as LinkIcon,
    FileText,
    CalendarDays,
    AlertCircle
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Analytics({ analytics, analyticsError, filters }) {
    const [dateRange, setDateRange] = useState(filters.date_range || 30);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [requestCategory, setRequestCategory] = useState(filters.request_category || '');

    const applyFilters = () => {
        const params = {};
        
        if (startDate && endDate) {
            params.start_date = startDate;
            params.end_date = endDate;
        } else {
            params.date_range = dateRange;
        }
        
        if (requestCategory) {
            params.request_category = requestCategory;
        }

        router.get(route('admin.analytics.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            header="Analytics Dashboard"
            headerIcon={<BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />}
            headerDescription="Track your website performance and user insights"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {analyticsError && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                        <p className="text-sm font-medium">{analyticsError}</p>
                    </div>
                )}
                {/* Filters */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[140px]">
                                <Label htmlFor="date_range" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                    <CalendarDays className="w-4 h-4" />
                                    Date Range
                                </Label>
                                <select 
                                    id="date_range"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(Number(e.target.value))}
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value={7}>Last 7 days</option>
                                    <option value={14}>Last 14 days</option>
                                    <option value={30}>Last 30 days</option>
                                    <option value={60}>Last 60 days</option>
                                    <option value={90}>Last 90 days</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <Label htmlFor="request_category" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Request Type
                                </Label>
                                <select 
                                    id="request_category"
                                    value={requestCategory}
                                    onChange={(e) => setRequestCategory(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="">All Requests</option>
                                    <option value="web">Web Only</option>
                                    <option value="api">API Only</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <Label htmlFor="start_date" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Start Date
                                </Label>
                                <Input 
                                    id="start_date"
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-[42px]"
                                />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <Label htmlFor="end_date" className="text-sm font-medium text-gray-700 mb-2 block">
                                    End Date
                                </Label>
                                <Input 
                                    id="end_date"
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="h-[42px]"
                                />
                            </div>
                            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 h-[42px] px-6">
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard 
                        label="Views" 
                        value={analytics.average?.views} 
                        icon={<Eye className="w-6 h-6" />}
                        iconBg="bg-blue-500"
                        iconColor="text-white"
                    />
                    <MetricCard 
                        label="Visitors" 
                        value={analytics.average?.visitors} 
                        icon={<Users className="w-6 h-6" />}
                        iconBg="bg-emerald-500"
                        iconColor="text-white"
                    />
                    <MetricCard 
                        label="Bounce Rate" 
                        value={analytics.average?.bounce_rate} 
                        icon={<TrendingUp className="w-6 h-6" />}
                        iconBg="bg-amber-500"
                        iconColor="text-white"
                    />
                    <MetricCard 
                        label="Average Visit Time" 
                        value={analytics.average?.average_visit_time} 
                        icon={<Clock className="w-6 h-6" />}
                        iconBg="bg-purple-500"
                        iconColor="text-white"
                    />
                </div>

                {/* Traffic Chart */}
                <Card className="mb-8 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Traffic Overview</CardTitle>
                        <CardDescription>Daily visitor and page view trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <TrafficChart labels={analytics.labels} datasets={analytics.datasets} />
                        </div>
                    </CardContent>
                </Card>

                {/* Pages and Referrers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Pages */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Pages</CardTitle>
                                <span className="text-sm text-gray-500">Views</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {analytics.pages?.length > 0 ? (
                                    analytics.pages.slice(0, 10).map((page, index) => {
                                        // Package uses 'views' field and provides 'percentage'
                                        const views = page.views || 0;
                                        const percentage = page.percentage || 0;
                                        const maxViews = analytics.pages[0]?.views || 1;
                                        const barWidth = Math.max((views / maxViews) * 100, 2);
                                        
                                        return (
                                            <div key={index} className="flex items-center gap-3 py-2 group hover:bg-gray-50 rounded px-2 -mx-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-700 truncate">{page.path}</p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="text-sm font-medium text-gray-900 w-10 text-right">{views}</span>
                                                    <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                                            style={{ width: `${barWidth}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-8">No page data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Referrers */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Referrers</CardTitle>
                                <span className="text-sm text-gray-500">Views</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                {analytics.referrers?.length > 0 ? (
                                    analytics.referrers.slice(0, 10).map((referrer, index) => {
                                        // Package uses 'visits' and 'domain' fields
                                        const visits = referrer.visits || 0;
                                        const percentage = referrer.percentage || 0;
                                        const maxVisits = analytics.referrers[0]?.visits || 1;
                                        const barWidth = Math.max((visits / maxVisits) * 100, 2);
                                        
                                        return (
                                            <div key={index} className="flex items-center gap-3 py-2 group hover:bg-gray-50 rounded px-2 -mx-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-700 truncate">
                                                        {referrer.domain || 'Direct'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="text-sm font-medium text-gray-900 w-10 text-right">{visits}</span>
                                                    <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                                                            style={{ width: `${barWidth}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-12 text-right">{percentage}%</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-8">No referrer data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Browsers, OS, Devices, Countries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Browsers" 
                        icon={<Chrome className="w-4 h-4" />}
                        items={analytics.browsers?.map(b => ({ name: b.browser, count: b.count })) || []}
                    />
                    <StatCard 
                        title="Operating Systems" 
                        icon={<Monitor className="w-4 h-4" />}
                        items={analytics.operatingSystems?.map(os => ({ name: os.name, count: os.count })) || []}
                    />
                    <StatCard 
                        title="Devices" 
                        icon={<Smartphone className="w-4 h-4" />}
                        items={analytics.devices?.map(d => ({ name: d.name, count: d.count })) || []}
                    />
                    <StatCard 
                        title="Countries" 
                        icon={<Globe className="w-4 h-4" />}
                        items={analytics.countries?.map(c => ({ name: c.name || 'Unknown', count: c.count })) || []}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

// Metric Card Component
function MetricCard({ label, value, icon, iconBg, iconColor }) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow border-0 bg-white">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                        <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
                    </div>
                    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                        <span className={iconColor}>{icon}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Stat Card Component
function StatCard({ title, icon, items }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {items.length > 0 ? (
                        items.slice(0, 5).map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 truncate capitalize flex-1 mr-2">{item.name}</span>
                                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-2">No data</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Traffic Chart Component using Chart.js
function TrafficChart({ labels, datasets }) {
    if (!labels || !datasets || labels.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No chart data available</p>
                </div>
            </div>
        );
    }

    const viewsData = datasets.find(d => d.label === 'Views')?.data || [];
    const visitorsData = datasets.find(d => d.label === 'Visitors')?.data || [];

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Views',
                data: viewsData,
                borderColor: 'rgb(220, 38, 127)',
                backgroundColor: 'rgba(220, 38, 127, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(220, 38, 127)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Visitors',
                data: visitorsData,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderDash: [5, 5],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 13,
                },
                bodyFont: {
                    size: 12,
                },
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: '#6b7280',
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: '#6b7280',
                    stepSize: 1,
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
}
