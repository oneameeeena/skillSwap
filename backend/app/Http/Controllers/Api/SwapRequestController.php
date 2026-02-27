<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SwapRequestStoreRequest;
use App\Models\SwapRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SwapRequestController extends Controller
{
    public function store(SwapRequestStoreRequest $request): JsonResponse
    {
        $swapRequest = SwapRequest::create([
            'from_user_id' => $request->user()->id,
            'to_user_id' => $request->to_user_id,
            'offered_skill_id' => $request->offered_skill_id,
            'requested_skill_id' => $request->requested_skill_id,
            'status' => 'pending',
        ]);

        $swapRequest->load(['fromUser', 'toUser', 'offeredSkill.skill', 'requestedSkill.skill']);

        return response()->json($swapRequest, 201);
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $sentRequests = SwapRequest::where('from_user_id', $user->id)
            ->with(['toUser', 'offeredSkill.skill', 'requestedSkill.skill'])
            ->get();
            
        $receivedRequests = SwapRequest::where('to_user_id', $user->id)
            ->with(['fromUser', 'offeredSkill.skill', 'requestedSkill.skill'])
            ->get();

        return response()->json([
            'sent' => $sentRequests,
            'received' => $receivedRequests,
        ]);
    }

    public function update(Request $request, SwapRequest $swapRequest): JsonResponse
    {
        $user = $request->user();
        
        if ($swapRequest->to_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|in:accepted,rejected'
        ]);

        $swapRequest->update(['status' => $request->status]);

        $swapRequest->load(['fromUser', 'toUser', 'offeredSkill.skill', 'requestedSkill.skill']);

        return response()->json($swapRequest);
    }
}
