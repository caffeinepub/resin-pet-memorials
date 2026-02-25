import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Header from './components/marketing/Header';
import Hero from './components/marketing/Sections/Hero';
import AboutResin from './components/marketing/Sections/AboutResin';
import ShapeShowcases from './components/marketing/Sections/ShapeShowcases';
import OrderForm from './components/order/OrderForm';
import ProcessSteps from './components/marketing/Sections/ProcessSteps';
import Footer from './components/marketing/Footer';
import PaymentSuccess from './components/payment/PaymentSuccess';
import PaymentFailure from './components/payment/PaymentFailure';
import PaymentSetup from './components/payment/PaymentSetup';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { useState } from 'react';

function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AboutResin />
        <ShapeShowcases />
        <OrderForm />
        <ProcessSteps />
      </main>
      <Footer />
    </div>
  );
}

function ProfileSetupModal({ onComplete }: { onComplete: (name: string, email: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    await onComplete(name.trim(), email.trim());
    setIsSubmitting(false);
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Welcome!</DialogTitle>
          <DialogDescription>
            Please tell us a bit about yourself to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !name.trim() || !email.trim()}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MainPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { saveProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleProfileComplete = async (name: string, email: string) => {
    await saveProfile({ name, email });
  };

  return (
    <>
      <Layout />
      {showProfileSetup && <ProfileSetupModal onComplete={handleProfileComplete} />}
      <PaymentSetup />
    </>
  );
}

const rootRoute = createRootRoute({
  component: MainPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailure,
});

const routeTree = rootRoute.addChildren([paymentSuccessRoute, paymentFailureRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
