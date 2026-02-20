import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Printer, Layers, Droplets } from 'lucide-react';

export default function ProcessSteps() {
  const steps = [
    {
      number: 1,
      icon: Camera,
      title: 'Capture the Memory',
      description: 'Select your favorite photograph of your beloved pet. This cherished image will become the centerpiece of your memorial.'
    },
    {
      number: 2,
      icon: Printer,
      title: 'Professional Printing',
      description: 'Your photo is professionally printed on archival-quality material, ensuring vibrant colors and lasting clarity.'
    },
    {
      number: 3,
      icon: Layers,
      title: 'Careful Placement',
      description: 'The printed photograph is delicately positioned in the mold alongside hand-selected flowers and grass, creating a beautiful botanical scene.'
    },
    {
      number: 4,
      icon: Droplets,
      title: 'Resin Pour & Cure',
      description: 'Crystal-clear resin is carefully poured over the arrangement and left to cure, permanently preserving your pet\'s memory in a stunning keepsake.'
    }
  ];

  return (
    <section id="process" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Handcrafted Process
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every memorial is created with meticulous attention to detail, combining traditional craftsmanship with modern techniques to ensure a beautiful, lasting tribute.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Badge
                        variant="outline"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold border-2"
                      >
                        {step.number}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
