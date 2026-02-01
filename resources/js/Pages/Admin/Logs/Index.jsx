import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, RefreshCw, AlertCircle } from 'lucide-react';

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function LogsIndex({ logFiles = [], selectedFile, lines, content, error }) {
    const applyFilters = (file, linesCount) => {
        router.get(route('admin.logs.index'), {
            file: file ?? selectedFile,
            lines: linesCount ?? lines,
        }, { preserveState: false });
    };

    const lineOptions = [100, 500, 1000, 2000];

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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg font-semibold">Log viewer</CardTitle>
                                <CardDescription>
                                    Last {lines} lines from selected file. Newest at the bottom.
                                </CardDescription>
                            </div>
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="min-w-[160px]">
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">File</Label>
                                    <Select
                                        value={selectedFile}
                                        onValueChange={(v) => applyFilters(v, lines)}
                                    >
                                        <SelectTrigger className="bg-white">
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
                                <div className="min-w-[120px]">
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">Lines</Label>
                                    <Select
                                        value={String(lines)}
                                        onValueChange={(v) => applyFilters(selectedFile, Number(v))}
                                    >
                                        <SelectTrigger className="bg-white">
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
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => applyFilters(selectedFile, lines)}
                                    className="shrink-0"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
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
                                        content.split('\n').map((line, i) => {
                                            const isError = line.includes('.ERROR') || line.includes('] error');
                                            const isWarning = line.includes('.WARNING') || line.includes('] warning');
                                            return (
                                                <div
                                                    key={i}
                                                    className={`border-l-2 pl-2 -ml-2 ${
                                                        isError
                                                            ? 'border-red-500 bg-red-950/30'
                                                            : isWarning
                                                            ? 'border-amber-500 bg-amber-950/20'
                                                            : 'border-transparent'
                                                    }`}
                                                >
                                                    {line || ' '}
                                                </div>
                                            );
                                        })
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
