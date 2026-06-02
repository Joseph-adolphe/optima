export interface Categorie {
    id: number;
    nom: string;
    description: string | null;
}

export interface Locomotive {
    id: number;
    name: string;
    model: string | null;
    categorie_id: number | null;
    categorie?: Categorie;
    maintenance_cycle_id?: number | null;
    kilometrage_actuel?: number;
    commissioned_at: string;
    photo_path: string | null;
    photo_url: string | null;
    pannes_count?: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedLocomotives {
    data: Locomotive[];
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
