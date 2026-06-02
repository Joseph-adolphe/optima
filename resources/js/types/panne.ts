export interface Panne {
    id: number;
    locomotive_id: number;
    type: 'preventive' | 'corrective';
    status: 'en_cours' | 'terminee';
    description: string;
    failed_at: string;
    created_at: string;
    updated_at: string;
    locomotive?: any; // To be typed with Locomotive if needed
    fiches?: any[]; // To be typed with Fiche[] if needed
    fiches_count?: number;
}

export interface PaginatedPannes {
    data: Panne[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
