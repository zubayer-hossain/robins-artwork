<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class LogsController extends Controller
{
    private const MAX_LINES = 2000;
    private const MAX_READ_BYTES = 512 * 1024; // 512KB tail when file is large

    public function index(Request $request): Response
    {
        $logDir = storage_path('logs');
        $files = $this->listLogFiles($logDir);

        $selectedFile = $request->input('file', 'laravel.log');
        $lines = min(max((int) $request->input('lines', 500), 100), self::MAX_LINES);

        $content = '';
        $error = null;
        $selectedPath = null;

        if ($files->isNotEmpty()) {
            $validFile = $files->first(fn ($f) => $f['name'] === $selectedFile);
            if (!$validFile) {
                $selectedFile = $files->first()['name'];
            }
            $selectedPath = $logDir . DIRECTORY_SEPARATOR . $selectedFile;
            if (is_file($selectedPath) && $this->pathIsInLogDir($selectedPath, $logDir)) {
                try {
                    $content = $this->readLastLines($selectedPath, $lines);
                } catch (\Throwable $e) {
                    $error = 'Could not read log file: ' . $e->getMessage();
                }
            } else {
                $error = 'Log file not found or access denied.';
            }
        } else {
            $error = 'No log files found in storage/logs.';
        }

        return Inertia::render('Admin/Logs/Index', [
            'logFiles' => $files->values()->all(),
            'selectedFile' => $selectedFile,
            'lines' => $lines,
            'content' => $content,
            'error' => $error,
        ]);
    }

    private function listLogFiles(string $logDir): \Illuminate\Support\Collection
    {
        if (!is_dir($logDir)) {
            return collect();
        }

        $files = collect(File::files($logDir))
            ->filter(fn ($f) => str_ends_with(strtolower($f->getFilename()), '.log'))
            ->map(fn ($f) => [
                'name' => $f->getFilename(),
                'size' => $f->getSize(),
                'modified' => $f->getMTime(),
            ])
            ->sortByDesc('modified')
            ->values();

        return $files;
    }

    private function pathIsInLogDir(string $path, string $logDir): bool
    {
        $real = realpath($path);
        $realDir = realpath($logDir);
        return $real !== false && $realDir !== false && str_starts_with($real, $realDir . DIRECTORY_SEPARATOR);
    }

    private function readLastLines(string $path, int $maxLines): string
    {
        $size = filesize($path);
        if ($size === 0) {
            return '';
        }

        $handle = fopen($path, 'rb');
        if ($handle === false) {
            throw new \RuntimeException('Cannot open file');
        }

        try {
            if ($size <= self::MAX_READ_BYTES) {
                fseek($handle, 0);
                $content = stream_get_contents($handle);
            } else {
                fseek($handle, -self::MAX_READ_BYTES, SEEK_END);
                fread($handle, 1); // advance past potential partial line
                $content = stream_get_contents($handle);
            }
        } finally {
            fclose($handle);
        }

        $allLines = preg_split('/\r\n|\r|\n/', $content);
        $lines = array_slice($allLines, -$maxLines);
        return implode("\n", $lines);
    }
}
