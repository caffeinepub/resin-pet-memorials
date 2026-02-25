import { useState } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration, useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function PaymentSetup() {
  const { identity } = useInternetIdentity();
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setConfiguration = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  const [showDialog, setShowDialog] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const shouldShow = isAuthenticated && !configLoading && !adminLoading && isAdmin && !isConfigured;

  if (!shouldShow) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) return;

    try {
      const allowedCountries = countries.split(',').map((c) => c.trim()).filter(Boolean);
      await setConfiguration.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries,
      });
      setShowDialog(false);
      setSecretKey('');
      setCountries('US,CA,GB');
    } catch (error) {
      console.error('Failed to configure Stripe:', error);
    }
  };

  return (
    <>
      {!showDialog && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="max-w-md shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>Stripe payment is not configured yet.</span>
              <Button size="sm" onClick={() => setShowDialog(true)}>
                Configure
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Configure Stripe Payment</DialogTitle>
            <DialogDescription>
              Enter your Stripe secret key and allowed countries to enable payment processing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Stripe Secret Key *</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="sk_test_..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your Stripe Dashboard under Developers → API keys
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="countries">Allowed Countries *</Label>
                <Input
                  id="countries"
                  value={countries}
                  onChange={(e) => setCountries(e.target.value)}
                  placeholder="US,CA,GB"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated country codes (e.g., US,CA,GB,AU)
                </p>
              </div>
            </div>
            {setConfiguration.isError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to configure Stripe. Please check your credentials and try again.
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={setConfiguration.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={setConfiguration.isPending || !secretKey.trim()}>
                {setConfiguration.isPending ? 'Saving...' : 'Save Configuration'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
