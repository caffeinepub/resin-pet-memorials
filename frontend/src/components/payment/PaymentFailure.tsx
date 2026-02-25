import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, AlertCircle } from 'lucide-react';
import Header from '../marketing/Header';
import Footer from '../marketing/Footer';

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="font-serif text-3xl">Payment Failed</CardTitle>
            <CardDescription className="text-base">
              We were unable to process your payment. No charges have been made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your order has not been submitted. Please try again or contact support if the problem persists.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => navigate({ to: '/' })}
                className="w-full"
                size="lg"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate({ to: '/' })}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
