<?php

namespace App\Observers;

use App\Models\Fiche;
use App\Models\Panne;

class PanneObserver
{
    /**
     * Après la création/mise à jour d'une fiche, on vérifie si les 4 steps sont complètes.
     * Si oui, on passe le statut de la panne à 'terminee'.
     */
    public function saved(Fiche $fiche): void
    {
        $panne = $fiche->panne;

        if ($panne->status === 'terminee') {
            return;
        }

        $completedSteps = $panne->fiches()->pluck('step')->toArray();
        $allSteps = [1, 2, 3, 4];

        if (count(array_intersect($allSteps, $completedSteps)) === 4) {
            $panne->update(['status' => 'terminee']);
        }
    }
}
