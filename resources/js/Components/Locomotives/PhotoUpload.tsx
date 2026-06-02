import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface PhotoUploadProps {
    currentPhotoUrl?: string | null;
    onPhotoSelected: (file: File | null) => void;
    error?: string;
}

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default function PhotoUpload({ currentPhotoUrl, onPhotoSelected, error }: PhotoUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setLocalError(null);
        
        if (!file.type.startsWith('image/')) {
            setLocalError("Le fichier doit être une image (jpeg, png, webp).");
            return;
        }
        
        if (file.size > MAX_SIZE_BYTES) {
            setLocalError(`La photo dépasse la taille maximale autorisée de ${MAX_SIZE_MB}MB.`);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);
        onPhotoSelected(file);
    };

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const clearPhoto = () => {
        setPreview(null);
        onPhotoSelected(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="w-full">
            <div 
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50 bg-white'}
                    ${preview ? 'p-2' : 'min-h-[200px]'}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative w-full rounded-md overflow-hidden bg-gray-100 flex justify-center items-center h-64">
                        <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
                        <button 
                            type="button" 
                            onClick={clearPhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                        <h4 className="text-sm font-semibold text-gray-700">Cliquez pour uploader ou glissez-déposez</h4>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG ou WEBP (max. 5MB)</p>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            className="mt-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Parcourir les fichiers
                        </Button>
                    </>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onFileChange}
                />
            </div>
            {(error || localError) && (
                <p className="text-sm text-red-600 mt-2">{error || localError}</p>
            )}
        </div>
    );
}
