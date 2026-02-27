<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['offeredSkills.skill', 'wantedSkills.skill']);

        if ($request->has('skill')) {
            $skillId = $request->skill;
            $query->whereHas('offeredSkills', function ($q) use ($skillId) {
                $q->where('skill_id', $skillId);
            });
        }

        $users = $query->paginate(10);

        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load(['offeredSkills.skill', 'wantedSkills.skill']);

        return response()->json($user);
    }

    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update($request->only(['name', 'email', 'bio']));

        if ($request->has('offered_skills')) {
            UserSkill::where('user_id', $user->id)->where('type', 'offered')->delete();
            foreach ($request->offered_skills as $skillId) {
                UserSkill::create([
                    'user_id' => $user->id,
                    'skill_id' => $skillId,
                    'type' => 'offered'
                ]);
            }
        }

        if ($request->has('wanted_skills')) {
            UserSkill::where('user_id', $user->id)->where('type', 'wanted')->delete();
            foreach ($request->wanted_skills as $skillId) {
                UserSkill::create([
                    'user_id' => $user->id,
                    'skill_id' => $skillId,
                    'type' => 'wanted'
                ]);
            }
        }

        $user->load(['offeredSkills.skill', 'wantedSkills.skill']);

        return response()->json($user);
    }
}
