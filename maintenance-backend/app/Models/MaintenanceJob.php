<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceJob extends Model
{
    use HasFactory;

    protected $fillable = ['address', 'date', 'duration'];

    protected $table = 'maintenance_jobs';
}