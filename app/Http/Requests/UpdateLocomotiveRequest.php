<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLocomotiveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('locomotive'));
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('locomotives')->ignore($this->route('locomotive')),
            ],
            'categorie_id'    => ['required', 'integer', 'exists:categories,id'],
            'maintenance_cycle_id' => ['nullable', 'integer', 'exists:maintenance_cycles,id'],
            'kilometrage_actuel'   => ['nullable', 'integer', 'min:0'],
            'commissioned_at' => ['required', 'date', 'before_or_equal:today'],
            'photo'           => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ];
    }
}
