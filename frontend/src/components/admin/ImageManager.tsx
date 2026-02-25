import { useState } from 'react';
import { ArrowLeft, Images, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ImageSlotCard from './ImageSlotCard';
import { useImageSlot } from '@/hooks/useImageSlot';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useIsCallerAdmin } from '@/hooks/useQueries';

const IMAGE_SLOTS = [
  {
    key: 'hero',
    label: 'Hero Image',
    description: 'Main hero section image shown at the top of the homepage.',
    fallback: '/assets/generated/nabi-resin-headstone.dim_800x800.png',
  },
  {
    key: 'shape-square',
    label: 'Square Shape',
    description: 'Square memorial design card in the "Choose Your Design" section.',
    fallback: '/assets/generated/resin-square-mold.dim_600x600.png',
  },
  {
    key: 'shape-heart',
    label: 'Heart Shape',
    description: 'Heart memorial design card in the "Choose Your Design" section.',
    fallback: '/assets/generated/resin-heart-mold.dim_600x600.png',
  },
  {
    key: 'shape-hexagon',
    label: 'Hexagon Shape',
    description: 'Hexagon memorial design card in the "Choose Your Design" section.',
    fallback: '/assets/generated/resin-hexagon-mold.dim_600x600.png',
  },
  {
    key: 'shape-headstone',
    label: 'Headstone Shape',
    description: 'Headstone memorial design card in the "Choose Your Design" section.',
    fallback: '/assets/generated/ponce-headstone-mold.dim_800x900.png',
  },
  {
    key: 'about-resin',
    label: 'About Resin Image',
    description: 'Feature image shown in the "A Memorial as Unique as Your Pet" section.',
    fallback: undefined,
  },
];

function ImageSlotRow({ slotDef }: { slotDef: typeof IMAGE_SLOTS[number] }) {
  const { data: currentImageUrl, isLoading } = useImageSlot(slotDef.key);
  const uploadMutation = useUploadImage();

  const handleUpload = (file: File) => {
    uploadMutation.mutate({
      key: slotDef.key,
      file,
      name: file.name,
    });
  };

  if (isLoading) {
    return <Skeleton className="aspect-square rounded-xl" />;
  }

  return (
    <ImageSlotCard
      slotKey={slotDef.key}
      label={slotDef.label}
      description={slotDef.description}
      currentImageUrl={currentImageUrl}
      fallbackImageUrl={slotDef.fallback}
      onUpload={handleUpload}
      isUploading={uploadMutation.isPending}
      uploadProgress={uploadMutation.uploadProgress}
    />
  );
}

interface ImageManagerProps {
  onBack: () => void;
}

export default function ImageManager({ onBack }: ImageManagerProps) {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You must be an admin to access the Image Manager.
            </AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4 w-full" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center gap-4 h-16">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Button>
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-primary" />
            <h1 className="font-serif text-xl font-semibold text-foreground">Image Manager</h1>
          </div>
          <span className="text-sm text-muted-foreground ml-auto">Admin Panel</span>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              Site Image Slots
            </h2>
            <p className="text-muted-foreground">
              Upload custom images for each section of your website. Images marked{' '}
              <span className="font-medium text-accent-foreground">Custom</span> are currently using
              your uploaded version. All other slots show the default static image.
            </p>
          </div>

          {Object.keys(uploadErrors).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>
                {Object.values(uploadErrors).join(', ')}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {IMAGE_SLOTS.map((slotDef) => (
              <ImageSlotRow key={slotDef.key} slotDef={slotDef} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
