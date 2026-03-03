<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class MaintenanceJobsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        $batchSize = 100;

        for ($i = 0; $i < 10; $i++) {
            $jobs = [];
            for ($j = 0; $j < $batchSize; $j++) {
                $jobs[] = [
                    'address' => $faker->address,
                    'date' => $faker->dateTimeBetween('-1 month', '+3 months'),
                    'duration' => $faker->randomFloat(2, 1, 8),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('maintenance_jobs')->insert($jobs);
        }
    }
}