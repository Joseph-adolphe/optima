<?php

namespace App\Http\Requests;

use App\Models\Locomotive;
use Illuminate\Foundation\Http\FormRequest;

class StoreLocomotiveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Locomotive::class);
    }

    public function rules(): array
    {
        return [
            'name'            => ['required', 'string', 'max:255', 'unique:locomotives,name'],
            'categorie_id'    => ['required', 'integer', 'exists:categories,id'],
            'maintenance_cycle_id' => ['nullable', 'integer', 'exists:maintenance_cycles,id'],
            'kilometrage_actuel'   => ['nullable', 'integer', 'min:0'],
            'commissioned_at' => ['required', 'date', 'before_or_equal:today'],
            'photo'           => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ];
    }
}
