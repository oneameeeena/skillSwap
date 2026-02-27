<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SwapRequestStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'to_user_id' => 'required|exists:users,id',
            'offered_skill_id' => 'required|exists:user_skills,id',
            'requested_skill_id' => 'required|exists:user_skills,id',
        ];
    }
}
