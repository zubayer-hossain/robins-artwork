import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, RefreshCw, AlertCircle, Search, X } from 'lucide-react';

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function LogsIndex({ logFiles = [], selectedFile, selectedFileModified, lines, content, error }) {
    const [searchQuery, setSearchQuery] = useState('');

    const applyFilters = (file, linesCount) => {
        router.get(route('admin.logs.index'), {
            file: file ?? selectedFile,
            lines: linesCount ?? lines,
        }, { preserveState: false });
    };

    const lineOptions = [100, 500, 1000, 2000];
    const allLines = content ? content.split('\n') : [];
    const filteredLines = useMemo(() => {
        if (!searchQuery.trim()) return allLines;
        const q = searchQuery.trim().toLowerCase();
        return allLines.filter((line) => line.toLowerCase().includes(q));
    }, [allLines, searchQuery]);

    return (
        <AdminLayout
            header="Server Logs"
            headerIcon={<FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />}
            headerDescription="View Laravel log files for debugging and errors"
        >
            <Head title="Server Logs - Admin" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <Card className="shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col gap-5">
                            {/* Row 1: Title + description left | File, Lines, Refresh right — aligned by control baseline */}
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                                <div className="min-w-0">
                                    <CardTitle className="text-lg font-semibold text-gray-900">Log viewer</CardTitle>
                                    <CardDescription className="mt-1 text-gray-500">
                                        Last {lines} lines from selected file. Newest at the bottom.
                                        {selectedFileModified && (
                                            <span className="block mt-1 text-gray-500">File updated: {selectedFileModified}</span>
                                        )}
                                    </CardDescription>
                                </div>
                                <div className="flex flex-wrap items-end gap-4 shrink-0">
                                    <div className="w-[200px]">
                                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">File</Label>
                                        <Select
                                            value={selectedFile}
                                            onValueChange={(v) => applyFilters(v, lines)}
                                        >
                                            <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-white">
                                                <SelectValue placeholder="Select log file" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {logFiles.map((f) => (
                                                    <SelectItem key={f.name} value={f.name}>
                                                        {f.name} ({formatFileSize(f.size)})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-[120px]">
                                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Lines</Label>
                                        <Select
                                            value={String(lines)}
                                            onValueChange={(v) => applyFilters(selectedFile, Number(v))}
                                        >
                                            <SelectTrigger className="h-10 rounded-lg border-gray-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {lineOptions.map((n) => (
                                                    <SelectItem key={n} value={String(n)}>
                                                        Last {n}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="pb-0.5">
                                        <Label className="text-sm font-medium text-gray-700 mb-1.5 block opacity-0 select-none" aria-hidden="true">Refresh</Label>
                                        <Button
                                            variant="outline"
                                            onClick={() => applyFilters(selectedFile, lines)}
                                            className="h-10 rounded-lg border-gray-200 px-4"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {/* Row 2: Search full width, badge when filtering */}
                            {content && allLines.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <Label className="sr-only" htmlFor="log-search">Search in log</Label>
                                    <div className="relative flex-1 min-w-0">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        <Input
                                            id="log-search"
                                            placeholder="Search in log (e.g. ERROR, exception, route name)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-10 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 font-mono text-sm placeholder:text-gray-400 focus-visible:bg-white focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:outline-none focus-visible:ring-offset-0 transition-colors [&:not(:focus-visible)]:ring-0 [&:not(:focus-visible)]:ring-offset-0"
                                        />
                                        {searchQuery.trim() && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200/80 transition-colors"
                                                aria-label="Clear search"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {searchQuery.trim() && (
                                        <span className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 h-10 flex items-center">
                                            {filteredLines.length} of {allLines.length} lines
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {logFiles.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="font-medium">No log files found</p>
                                <p className="text-sm mt-1">Logs are stored in storage/logs</p>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-200 bg-gray-900 overflow-hidden">
                                <pre className="p-4 overflow-auto text-sm text-gray-100 font-mono whitespace-pre-wrap break-all max-h-[70vh]">
                                    {content ? (
                                        filteredLines.length > 0 ? (
                                            filteredLines.map((line, i) => {
                                                const isError = line.includes('.ERROR') || line.includes('] error');
                                                const isWarning = line.includes('.WARNING') || line.includes('] warning');
                                                const lineNum = searchQuery.trim()
                                                    ? allLines.indexOf(line) + 1
                                                    : i + 1;
                                                return (
                                                    <div
                                                        key={searchQuery ? `match-${i}-${lineNum}` : i}
                                                        className={`flex border-l-2 pl-2 -ml-2 ${
                                                            isError
                                                                ? 'border-red-500 bg-red-950/30'
                                                                : isWarning
                                                                ? 'border-amber-500 bg-amber-950/20'
                                                                : 'border-transparent'
                                                        }`}
                                                    >
                                                        <span className="select-none shrink-0 w-10 text-right text-gray-500 mr-3" aria-hidden="true">
                                                            {lineNum}
                                                        </span>
                                                        <span className="min-w-0">{line || ' '}</span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-amber-400">No lines match &quot;{searchQuery.trim()}&quot;</div>
                                        )
                                    ) : (
                                        <span className="text-gray-500">Empty or unable to read.</span>
                                    )}
                                </pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
