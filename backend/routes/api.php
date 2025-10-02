<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ConstituentController;
use App\Http\Controllers\Api\BlotterController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/stats', [DashboardController::class, 'stats']);
});

Route::apiResource('constituents', ConstituentController::class);
Route::apiResource('blotters', BlotterController::class);
