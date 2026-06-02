<?php

namespace App\Http\Requests;

use App\Models\Panne;
use Illuminate\Foundation\Http\FormRequest;

class StorePanneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Panne::class);
    }

    public function rules(): array
    {
        return [
            'locomotive_id' => ['required', 'integer', 'exists:locomotives,id'],
            'type'          => ['required', 'in:preventive,corrective'],
            'status'        => ['required', 'in:en_cours,terminee'],
            'description'   => ['required', 'string', 'max:1000'],
            'failed_at'     => ['required', 'date', 'before_or_equal:now'],
        ];
    }
}
