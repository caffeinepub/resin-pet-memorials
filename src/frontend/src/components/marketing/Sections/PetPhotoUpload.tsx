import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { usePetPhotoSubmission } from '@/hooks/usePetPhotoSubmission';

export default function PetPhotoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { submitPhoto, isSubmitting, successMessage, errorMessage, resetState } = usePetPhotoSubmission();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValidationError(null);
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
      setSelectedFile(null);
      setPreviewUrl(null);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setValidationError('Please select an image file first');
      return;
    }

    await submitPhoto(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    resetState();
    
    // Reset file input
    const fileInput = document.getElementById('pet-photo-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <section id="upload" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Share Your Pet's Photo
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Upload a cherished photo of your beloved companion to begin creating their memorial. We'll preserve their memory in beautiful resin.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Upload Pet Photo</CardTitle>
              <CardDescription>
                Choose a high-quality image that captures your pet's personality. Accepted formats: JPEG, PNG, GIF.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pet-photo-input">Pet Photo</Label>
                  <Input
                    id="pet-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting || !!successMessage}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Select a clear, well-lit photo of your pet for the best results.
                  </p>
                </div>

                {validationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}

                {previewUrl && !successMessage && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src={previewUrl}
                        alt="Preview of selected pet photo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {successMessage && (
                  <Alert className="border-success bg-success/10">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <AlertDescription className="text-success">
                      {successMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  {!successMessage ? (
                    <Button
                      type="submit"
                      disabled={!selectedFile || isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1"
                    >
                      Upload Another Photo
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
