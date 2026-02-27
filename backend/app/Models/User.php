<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userSkills()
    {
        return $this->hasMany(UserSkill::class);
    }

    public function offeredSkills()
    {
        return $this->hasMany(UserSkill::class)->where('type', 'offered');
    }

    public function wantedSkills()
    {
        return $this->hasMany(UserSkill::class)->where('type', 'wanted');
    }

    public function sentSwapRequests()
    {
        return $this->hasMany(SwapRequest::class, 'from_user_id');
    }

    public function receivedSwapRequests()
    {
        return $this->hasMany(SwapRequest::class, 'to_user_id');
    }
}
