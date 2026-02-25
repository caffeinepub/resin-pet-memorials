import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitOrder } from '../../hooks/useQueries';
import { ExternalBlob, PaymentMethod } from '../../backend';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import PaymentMethodSelector from '../payment/PaymentMethodSelector';

type OrderFormData = {
  animalName: string;
  birthDate: string;
  deathDate: string;
  photo: FileList;
};

export default function OrderForm() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<OrderFormData>();
  const submitOrder = useSubmitOrder();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.stripe);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const photoFiles = watch('photo');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      setSubmitSuccess(false);
      setUploadProgress(0);

      const file = data.photo[0];
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const birthDate = BigInt(new Date(data.birthDate).getTime());
      const deathDate = BigInt(new Date(data.deathDate).getTime());

      await submitOrder.mutateAsync({
        name: data.animalName,
        birthDate,
        deathDate,
        paymentMethod,
        photo: externalBlob,
      });

      setSubmitSuccess(true);
      reset();
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  return (
    <section id="order" className="py-16 md:py-24 bg-background">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Create Your Memorial
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fill out the form below to begin creating a lasting tribute to your beloved companion.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Order Information</CardTitle>
            <CardDescription>
              Please provide your pet's details and upload a cherished photo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="animalName">Pet's Name *</Label>
                <Input
                  id="animalName"
                  {...register('animalName', { required: 'Pet name is required' })}
                  placeholder="Enter your pet's name"
                  className={errors.animalName ? 'border-destructive' : ''}
                />
                {errors.animalName && (
                  <p className="text-sm text-destructive">{errors.animalName.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    {...register('birthDate', { required: 'Birth date is required' })}
                    className={errors.birthDate ? 'border-destructive' : ''}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-destructive">{errors.birthDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deathDate">Passing Date *</Label>
                  <Input
                    id="deathDate"
                    type="date"
                    {...register('deathDate', { required: 'Passing date is required' })}
                    className={errors.deathDate ? 'border-destructive' : ''}
                  />
                  {errors.deathDate && (
                    <p className="text-sm text-destructive">{errors.deathDate.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo Upload *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg object-contain"
                      />
                      <Label
                        htmlFor="photo"
                        className="inline-flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline"
                      >
                        Change Photo
                      </Label>
                    </div>
                  ) : (
                    <Label
                      htmlFor="photo"
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG, or JPEG (max 10MB)
                      </span>
                    </Label>
                  )}
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    {...register('photo', { required: 'Photo is required' })}
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                {errors.photo && (
                  <p className="text-sm text-destructive">{errors.photo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <PaymentMethodSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading photo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {submitSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your order has been submitted successfully! We'll begin creating your memorial.
                  </AlertDescription>
                </Alert>
              )}

              {submitOrder.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {submitOrder.error instanceof Error
                      ? submitOrder.error.message
                      : 'Failed to submit order. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitOrder.isPending || (uploadProgress > 0 && uploadProgress < 100)}
              >
                {!isAuthenticated
                  ? 'Login to Submit Order'
                  : submitOrder.isPending
                  ? 'Submitting...'
                  : 'Submit Order'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
