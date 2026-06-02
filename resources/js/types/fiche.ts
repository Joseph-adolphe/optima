export interface Fiche {
    id: number;
    panne_id: number;
    step: number;
    payload: any;
    started_at: string | null;
    ended_at: string | null;
    repair_duration: number | null;
    technician: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    panne?: any; // To be typed with Panne if needed
}
