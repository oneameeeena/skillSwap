<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function userSkills()
    {
        return $this->hasMany(UserSkill::class);
    }

    public function offeredByUsers()
    {
        return $this->hasManyThrough(User::class, UserSkill::class)
            ->where('user_skills.type', 'offered');
    }

    public function wantedByUsers()
    {
        return $this->hasManyThrough(User::class, UserSkill::class)
            ->where('user_skills.type', 'wanted');
    }
}
