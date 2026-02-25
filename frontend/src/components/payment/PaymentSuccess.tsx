import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Header from '../marketing/Header';
import Footer from '../marketing/Footer';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="font-serif text-3xl">Payment Successful!</CardTitle>
            <CardDescription className="text-base">
              Thank you for your order. We've received your payment and will begin creating your memorial.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email shortly with your order details and estimated completion date.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="w-full"
              size="lg"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
