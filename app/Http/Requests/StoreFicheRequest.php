<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFicheRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('fiches.fill');
    }

    public function rules(): array
    {
        $step = (int) $this->input('step');

        return match($step) {
            1 => $this->step1Rules(),
            2 => $this->step2Rules(),
            3 => $this->step3Rules(),
            4 => $this->step4Rules(),
            default => ['step' => ['required', 'integer', 'between:1,4']],
        };
    }

    private function step1Rules(): array
    {
        return [
            'step'                       => ['required', 'integer', 'in:1'],
            'payload.composant'          => ['required', 'string', 'max:255'],
            'payload.type_defaut'        => ['required', 'string', 'max:255'],
            'payload.date_detection'     => ['required', 'date'],
            'payload.observations'       => ['nullable', 'string', 'max:1000'],
        ];
    }

    private function step2Rules(): array
    {
        return [
            'step'                       => ['required', 'integer', 'in:2'],
            'payload.actions'            => ['required', 'string', 'max:2000'],
            'payload.pieces_remplacees'  => ['nullable', 'string', 'max:1000'],
            'payload.technicien'         => ['required', 'string', 'max:255'],
        ];
    }

    private function step3Rules(): array
    {
        return [
            'step'                       => ['required', 'integer', 'in:3'],
            'payload.started_at'         => ['required', 'date'],
            'payload.ended_at'           => ['required', 'date', 'after:payload.started_at'],
        ];
    }

    private function step4Rules(): array
    {
        return [
            'step'                       => ['required', 'integer', 'in:4'],
            'payload.observations_finales' => ['nullable', 'string', 'max:2000'],
            'payload.signature_chef'     => ['required', 'string', 'max:255'],
            'payload.conforme'           => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'payload.composant.required'        => 'Le composant défaillant est obligatoire.',
            'payload.type_defaut.required'      => 'Le type de défaut est obligatoire.',
            'payload.date_detection.required'   => 'La date de détection est obligatoire.',
            'payload.actions.required'          => 'Les actions réalisées sont obligatoires.',
            'payload.technicien.required'       => 'Le nom du technicien est obligatoire.',
            'payload.started_at.required'       => 'La date de début est obligatoire.',
            'payload.ended_at.required'         => 'La date de fin est obligatoire.',
            'payload.ended_at.after'            => 'La date de fin doit être après la date de début.',
            'payload.signature_chef.required'   => 'La signature du chef atelier est obligatoire.',
            'payload.conforme.required'         => 'La conformité doit être renseignée.',
        ];
    }
}
