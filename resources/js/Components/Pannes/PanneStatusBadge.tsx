import { Badge } from '@/Components/ui/badge';

interface Props {
    status: 'en_cours' | 'terminee';
    className?: string;
}

export default function PanneStatusBadge({ status, className = '' }: Props) {
    if (status === 'terminee') {
        return <Badge className={`bg-green-600 hover:bg-green-700 ${className}`}>Terminée</Badge>;
    }
    
    return <Badge variant="destructive" className={className}>En cours</Badge>;
}
