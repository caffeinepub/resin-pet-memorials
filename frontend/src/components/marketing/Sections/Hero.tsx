import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Hero() {
  const scrollToDesigns = () => {
    const element = document.getElementById('designs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5 fill-current" />
              <span className="text-sm font-medium tracking-wide uppercase">
                Handcrafted Memorials
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Furever Keepsakes and Memorials
            </h1>

            <p className="font-serif text-2xl md:text-3xl text-primary font-semibold italic">
              Furever Preserved in Clear Resin
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Honor your beloved pet with a beautiful, handcrafted memorial. Each piece captures their memory in crystal-clear resin, adorned with natural flowers and grass, preserving their photograph for eternity. Every memorial is unique and nothing is duplicated exactly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" onClick={scrollToDesigns}>
                Explore Designs
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const element = document.getElementById('process');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                How It's Made
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src="/assets/generated/nabi-resin-headstone.dim_800x800.png"
                alt="Resin memorial with yorkie photo embedded inside, adorned with flowers and grass"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-4 -left-4 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
