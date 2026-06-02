import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CheckCircle2, Circle } from 'lucide-react';
import { Panne } from '@/types/panne';
import { Fiche } from '@/types/fiche';

interface Props {
    panne: Panne;
    fiches: Fiche[];
    canManage: boolean;
}

export default function PanneStepper({ panne, fiches, canManage }: Props) {
    // Déterminer la prochaine étape à compléter (1 à 4)
    const completedSteps = fiches.map(f => f.step);
    const nextStep = [1, 2, 3, 4].find(s => !completedSteps.includes(s)) || 5;

    const [activeStep, setActiveStep] = useState(Math.min(nextStep, 4));

    const stepInfo = [
        { title: "Identification", desc: "Diagnostic initial" },
        { title: "Intervention", desc: "Actions réalisées" },
        { title: "Durées", desc: "Temps d'immobilisation" },
        { title: "Validation", desc: "Contrôle qualité" }
    ];

    return (
        <div className="space-y-6">
            {/* Stepper Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200">
                {stepInfo.map((info, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = completedSteps.includes(stepNum);
                    const isActive = activeStep === stepNum;
                    
                    return (
                        <div 
                            key={stepNum}
                            className={`flex flex-col items-center flex-1 cursor-pointer transition-colors ${
                                isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}
                            onClick={() => setActiveStep(stepNum)}
                        >
                            <div className="mb-2">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-8 h-8" />
                                ) : (
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isActive ? 'border-blue-600 font-bold' : 'border-slate-300'}`}>
                                        {stepNum}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-semibold">{info.title}</span>
                            <span className="text-xs hidden sm:block opacity-75">{info.desc}</span>
                        </div>
                    );
                })}
            </div>

            {/* Stepper Content */}
            <div className="mt-6">
                {activeStep === 1 && <Step1Form panne={panne} fiche={fiches.find(f => f.step === 1)} canManage={canManage} />}
                {activeStep === 2 && <Step2Form panne={panne} fiche={fiches.find(f => f.step === 2)} canManage={canManage} disabled={!completedSteps.includes(1)} />}
                {activeStep === 3 && <Step3Form panne={panne} fiche={fiches.find(f => f.step === 3)} canManage={canManage} disabled={!completedSteps.includes(2)} />}
                {activeStep === 4 && <Step4Form panne={panne} fiche={fiches.find(f => f.step === 4)} canManage={canManage} disabled={!completedSteps.includes(3)} />}
            </div>
        </div>
    );
}

// --- STEP 1 FORM ---
function Step1Form({ panne, fiche, canManage, disabled = false }: any) {
    const { data, setData, post, processing, errors } = useForm({
        step: 1,
        payload: {
            composant: fiche?.payload?.composant || '',
            type_defaut: fiche?.payload?.type_defaut || '',
            date_detection: fiche?.payload?.date_detection || '',
            observations: fiche?.payload?.observations || ''
        }
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pannes.fiches.store', panne.id));
    };

    const isReadOnly = !canManage || fiche != null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fiche 1 : Identification du problème</CardTitle>
                <CardDescription>Détails sur l'organe pneumatique défaillant.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Composant défaillant</Label>
                            <Input 
                                value={data.payload.composant} 
                                onChange={e => setData('payload', {...data.payload, composant: e.target.value})}
                                disabled={isReadOnly || disabled}
                                required
                            />
                            {errors['payload.composant'] && <p className="text-sm text-red-500">{errors['payload.composant'] as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Type de défaut</Label>
                            <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
                                value={data.payload.type_defaut}
                                onChange={e => setData('payload', {...data.payload, type_defaut: e.target.value})}
                                disabled={isReadOnly || disabled}
                                required
                            >
                                <option value="">Sélectionnez...</option>
                                <option value="fuite">Fuite d'air</option>
                                <option value="usure">Usure anormale</option>
                                <option value="casse">Casse mécanique</option>
                                <option value="autre">Autre</option>
                            </select>
                            {errors['payload.type_defaut'] && <p className="text-sm text-red-500">{errors['payload.type_defaut'] as string}</p>}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Date de détection précise</Label>
                        <Input 
                            type="date"
                            value={data.payload.date_detection} 
                            onChange={e => setData('payload', {...data.payload, date_detection: e.target.value})}
                            disabled={isReadOnly || disabled}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Observations initiales</Label>
                        <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                            value={data.payload.observations} 
                            onChange={e => setData('payload', {...data.payload, observations: e.target.value})}
                            disabled={isReadOnly || disabled}
                        />
                    </div>

                    {!isReadOnly && !disabled && (
                        <Button type="submit" disabled={processing}>Enregistrer l'identification</Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

// --- STEP 2 FORM ---
function Step2Form({ panne, fiche, canManage, disabled }: any) {
    const { data, setData, post, processing, errors } = useForm({
        step: 2,
        payload: {
            actions: fiche?.payload?.actions || '',
            pieces_remplacees: fiche?.payload?.pieces_remplacees || '',
            technicien: fiche?.payload?.technicien || ''
        }
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pannes.fiches.store', panne.id));
    };

    const isReadOnly = !canManage || fiche != null;

    if (disabled) return <Card><CardContent className="p-8 text-center text-slate-500">Veuillez d'abord compléter l'étape 1.</CardContent></Card>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fiche 2 : Rapport d'intervention</CardTitle>
                <CardDescription>Détaillez les actions réalisées sur la locomotive.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Actions réalisées</Label>
                        <textarea 
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                            value={data.payload.actions} 
                            onChange={e => setData('payload', {...data.payload, actions: e.target.value})}
                            disabled={isReadOnly}
                            required
                        />
                        {errors['payload.actions'] && <p className="text-sm text-red-500">{errors['payload.actions'] as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Pièces remplacées (références)</Label>
                        <Input 
                            value={data.payload.pieces_remplacees} 
                            onChange={e => setData('payload', {...data.payload, pieces_remplacees: e.target.value})}
                            disabled={isReadOnly}
                            placeholder="Ex: Electrovalve EV-1002, Joint torique X5"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Technicien intervenant</Label>
                        <Input 
                            value={data.payload.technicien} 
                            onChange={e => setData('payload', {...data.payload, technicien: e.target.value})}
                            disabled={isReadOnly}
                            required
                        />
                        {errors['payload.technicien'] && <p className="text-sm text-red-500">{errors['payload.technicien'] as string}</p>}
                    </div>

                    {!isReadOnly && (
                        <Button type="submit" disabled={processing}>Enregistrer l'intervention</Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

// --- STEP 3 FORM ---
function Step3Form({ panne, fiche, canManage, disabled }: any) {
    const { data, setData, post, processing, errors } = useForm({
        step: 3,
        payload: {
            started_at: fiche?.payload?.started_at || '',
            ended_at: fiche?.payload?.ended_at || ''
        }
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pannes.fiches.store', panne.id));
    };

    const isReadOnly = !canManage || fiche != null;

    if (disabled) return <Card><CardContent className="p-8 text-center text-slate-500">Veuillez d'abord compléter l'étape 2.</CardContent></Card>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fiche 3 : Suivi des durées</CardTitle>
                <CardDescription>Renseignez les dates de début et de fin (la durée de réparation sera calculée auto).</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Début d'intervention</Label>
                            <Input 
                                type="datetime-local"
                                value={data.payload.started_at} 
                                onChange={e => setData('payload', {...data.payload, started_at: e.target.value})}
                                disabled={isReadOnly}
                                required
                            />
                            {errors['payload.started_at'] && <p className="text-sm text-red-500">{errors['payload.started_at'] as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Fin d'intervention</Label>
                            <Input 
                                type="datetime-local"
                                value={data.payload.ended_at} 
                                onChange={e => setData('payload', {...data.payload, ended_at: e.target.value})}
                                disabled={isReadOnly}
                                required
                            />
                            {errors['payload.ended_at'] && <p className="text-sm text-red-500">{errors['payload.ended_at'] as string}</p>}
                        </div>
                    </div>

                    {fiche?.repair_duration != null && (
                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md">
                            <strong>Durée calculée :</strong> {Math.floor(fiche.repair_duration / 60)}h {fiche.repair_duration % 60}m
                        </div>
                    )}

                    {!isReadOnly && (
                        <Button type="submit" disabled={processing}>Enregistrer les temps</Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

// --- STEP 4 FORM ---
function Step4Form({ panne, fiche, canManage, disabled }: any) {
    const { data, setData, post, processing, errors } = useForm({
        step: 4,
        payload: {
            observations_finales: fiche?.payload?.observations_finales || '',
            signature_chef: fiche?.payload?.signature_chef || '',
            conforme: fiche?.payload?.conforme ?? true
        }
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pannes.fiches.store', panne.id));
    };

    const isReadOnly = !canManage || fiche != null;

    if (disabled) return <Card><CardContent className="p-8 text-center text-slate-500">Veuillez d'abord compléter l'étape 3.</CardContent></Card>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Fiche 4 : Validation finale</CardTitle>
                <CardDescription>Clôture de la panne par le Chef d'Atelier.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2 flex items-center gap-4">
                        <Label>Les réparations sont-elles conformes ?</Label>
                        <div className="flex gap-4 border border-slate-200 px-3 py-1 rounded-md">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={data.payload.conforme === true || data.payload.conforme === 'true'} 
                                    onChange={() => setData('payload', {...data.payload, conforme: true})}
                                    disabled={isReadOnly}
                                    className="text-green-600"
                                />
                                Oui
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={data.payload.conforme === false || data.payload.conforme === 'false'} 
                                    onChange={() => setData('payload', {...data.payload, conforme: false})}
                                    disabled={isReadOnly}
                                    className="text-red-600"
                                />
                                Non
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Observations finales (Optionnel)</Label>
                        <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                            value={data.payload.observations_finales} 
                            onChange={e => setData('payload', {...data.payload, observations_finales: e.target.value})}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Signature / Nom du validateur</Label>
                        <Input 
                            value={data.payload.signature_chef} 
                            onChange={e => setData('payload', {...data.payload, signature_chef: e.target.value})}
                            disabled={isReadOnly}
                            required
                        />
                        {errors['payload.signature_chef'] && <p className="text-sm text-red-500">{errors['payload.signature_chef'] as string}</p>}
                    </div>

                    {!isReadOnly && (
                        <Button type="submit" disabled={processing} className="w-full bg-green-600 hover:bg-green-700">
                            Valider et Clôturer la Panne
                        </Button>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
