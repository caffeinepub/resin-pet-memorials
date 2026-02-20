import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <span className="font-serif text-xl font-semibold text-foreground">
            Furever in Our Hearts
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('designs')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Designs
          </button>
          <button
            onClick={() => scrollToSection('upload')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Upload Photo
          </button>
          <button
            onClick={() => scrollToSection('process')}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Process
          </button>
          <Button
            onClick={() => scrollToSection('upload')}
            size="sm"
            className="ml-2"
          >
            Get Started
          </Button>
        </nav>

        <button
          onClick={() => scrollToSection('designs')}
          className="md:hidden text-sm font-medium text-primary"
        >
          Menu
        </button>
      </div>
    </header>
  );
}
