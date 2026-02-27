<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SwapRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_user_id',
        'to_user_id',
        'offered_skill_id',
        'requested_skill_id',
        'status'
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function fromUser()
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser()
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }

    public function offeredSkill()
    {
        return $this->belongsTo(UserSkill::class, 'offered_skill_id');
    }

    public function requestedSkill()
    {
        return $this->belongsTo(UserSkill::class, 'requested_skill_id');
    }
}
