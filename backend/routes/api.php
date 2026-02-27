<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\SwapRequestController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Users
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/profile', [UserController::class, 'update']);
    
    // Skills
    Route::get('/skills', [SkillController::class, 'index']);
    
    // Swap Requests
    Route::post('/swaps', [SwapRequestController::class, 'store']);
    Route::get('/swaps', [SwapRequestController::class, 'index']);
    Route::put('/swaps/{swapRequest}', [SwapRequestController::class, 'update']);
});
