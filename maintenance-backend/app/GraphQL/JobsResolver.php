<?php

namespace App\GraphQL;

use App\Models\MaintenanceJob;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Events\QueryExecuted;

class JobsResolver
{
    public function resolve($root, array $args)
    {
        $mode = $args['mode'] ?? 'naive';
        $page = $args['page'] ?? 1;
        $limit = $args['limit'] ?? 100;

        $offset = ($page - 1) * $limit;
        $cacheKey = "jobs_{$mode}_{$page}_{$limit}";
        $totalCacheKey = "jobs_total_{$mode}";

        $queryCount = 0;


        // Listen for DB queries & count them

        DB::listen(function (QueryExecuted $query) use (&$queryCount) {
            if (
                $query->connectionName === 'sqlite' &&
                str_contains($query->sql, 'maintenance_jobs')
            ) {
                $queryCount++;
            }
        });


        // redis mode: cached loading

        if ($mode === 'redis') {
            $data = Cache::remember($cacheKey, 60, function () use ($offset, $limit, $totalCacheKey) {
                $jobs = MaintenanceJob::query()
                    ->offset($offset)
                    ->limit($limit)
                    ->get();

                $total = MaintenanceJob::count();

                return [
                    'jobs' => $jobs,
                    'total' => $total,
                ];
            });

            $jobs = $data['jobs'];
            $total = $data['total'];

            
        // normal mode: naive loading

        } else {
            $jobs = MaintenanceJob::query()
                ->offset($offset)
                ->limit($limit)
                ->get();

            $total = MaintenanceJob::count();
        }

        return [
            'jobs' => $jobs,
            'queryCount' => $queryCount,
            'total' => $total,
        ];
    }
}