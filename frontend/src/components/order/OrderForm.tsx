import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useSubmitOrder } from '../../hooks/useQueries';
import { ExternalBlob, PaymentMethod } from '../../backend';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Upload, CheckCircle2, AlertCircle, MapPin, Phone, User } from 'lucide-react';
import PaymentMethodSelector from '../payment/PaymentMethodSelector';

type OrderFormData = {
  animalName: string;
  birthDate: string;
  deathDate: string;
  photo: FileList;
  // Buyer name
  firstName: string;
  lastName: string;
  // Contact info
  email: string;
  phoneNumber: string;
  // Shipping address
  streetAddress: string;
  addressLine2: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
};

export default function OrderForm() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<OrderFormData>();
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

      // Use the same photo blob as placeholder for all frame slots
      const frameBlob = ExternalBlob.fromBytes(bytes);

      const birthDate = BigInt(new Date(data.birthDate).getTime());
      const deathDate = BigInt(new Date(data.deathDate).getTime());

      await submitOrder.mutateAsync({
        name: data.animalName,
        birthDate,
        deathDate,
        paymentMethod,
        photo: externalBlob,
        peninsulaFrame: frameBlob,
        ovalFrame: frameBlob,
        squareFrame: frameBlob,
        roundFrame: frameBlob,
        headstoneFrame: frameBlob,
        shippingAddress: {
          streetAddress: data.streetAddress,
          addressLine2: data.addressLine2 ? data.addressLine2 : undefined,
          city: data.city,
          stateOrProvince: data.stateOrProvince,
          postalCode: data.postalCode,
          country: data.country,
          phoneNumber: data.phoneNumber,
        },
        buyerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        contactInfo: {
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
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
              {/* Pet Details */}
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

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Contact Information
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll use these details to keep you updated on your order.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      placeholder="you@example.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        minLength: { value: 1, message: 'Phone number is required' },
                      })}
                      placeholder="+1 (555) 000-0000"
                      className={errors.phoneNumber ? 'border-destructive' : ''}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ship To — Name + Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Ship To
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the name and address where you'd like your Furever Keepsake delivered.
                </p>

                {/* Recipient Name */}
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Recipient Name</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName', { required: 'First name is required' })}
                      placeholder="Jane"
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: 'Last name is required' })}
                      placeholder="Smith"
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input
                    id="streetAddress"
                    {...register('streetAddress', { required: 'Street address is required' })}
                    placeholder="123 Main Street"
                    className={errors.streetAddress ? 'border-destructive' : ''}
                  />
                  {errors.streetAddress && (
                    <p className="text-sm text-destructive">{errors.streetAddress.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">
                    Address Line 2{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="addressLine2"
                    {...register('addressLine2')}
                    placeholder="Apt, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register('city', { required: 'City is required' })}
                      placeholder="City"
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stateOrProvince">State / Province *</Label>
                    <Input
                      id="stateOrProvince"
                      {...register('stateOrProvince', { required: 'State or province is required' })}
                      placeholder="State or Province"
                      className={errors.stateOrProvince ? 'border-destructive' : ''}
                    />
                    {errors.stateOrProvince && (
                      <p className="text-sm text-destructive">{errors.stateOrProvince.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      {...register('postalCode', { required: 'Postal code is required' })}
                      placeholder="12345"
                      className={errors.postalCode ? 'border-destructive' : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      {...register('country', { required: 'Country is required' })}
                      placeholder="United States"
                      className={errors.country ? 'border-destructive' : ''}
                    />
                    {errors.country && (
                      <p className="text-sm text-destructive">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
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
