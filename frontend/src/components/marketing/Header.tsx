import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const disabled = loginStatus === 'logging-in';
  const buttonText = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Designs', id: 'designs' },
    { label: 'Order', id: 'order' },
    { label: 'Process', id: 'process' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 font-serif text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          <Heart className="h-6 w-6 text-primary fill-primary" />
          Furever Keepsakes and Memorials
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {buttonText}
          </Button>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="w-full"
            >
              {buttonText}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
