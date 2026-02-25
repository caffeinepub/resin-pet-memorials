import { useRef } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ImageSlotCardProps {
  slotKey: string;
  label: string;
  description: string;
  currentImageUrl?: string;
  fallbackImageUrl?: string;
  onUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export default function ImageSlotCard({
  slotKey,
  label,
  description,
  currentImageUrl,
  fallbackImageUrl,
  onUpload,
  isUploading,
  uploadProgress,
}: ImageSlotCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset input so same file can be re-uploaded
      e.target.value = '';
    }
  };

  const displayImage = currentImageUrl || fallbackImageUrl;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Image Preview */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="h-12 w-12 opacity-30" />
            <span className="text-sm">No image</span>
          </div>
        )}
        {currentImageUrl && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-accent text-accent-foreground text-xs">Custom</Badge>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-3 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="w-full max-w-[160px]">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center mt-1 text-muted-foreground">{uploadProgress}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif font-semibold text-foreground">{label}</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          <p className="text-xs text-muted-foreground/60 mt-1 font-mono">key: {slotKey}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          size="sm"
          variant={currentImageUrl ? 'outline' : 'default'}
          className="w-full mt-auto"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {currentImageUrl ? 'Replace Image' : 'Upload Image'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
