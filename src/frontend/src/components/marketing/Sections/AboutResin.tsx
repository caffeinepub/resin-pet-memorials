import { Flower2, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function AboutResin() {
  const features = [
    {
      icon: Sparkles,
      title: 'Crystal Clear Resin',
      description: 'Premium quality clear resin that beautifully preserves every detail, creating a lasting tribute to your cherished companion.'
    },
    {
      icon: Flower2,
      title: 'Natural Elements',
      description: 'Each memorial is adorned with carefully selected flowers and grass, creating a serene botanical scene that celebrates life.'
    },
    {
      icon: ImageIcon,
      title: 'Printed Photographs',
      description: 'Your pet\'s photograph is professionally printed and delicately placed within the resin, ensuring their memory remains vivid forever.'
    }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            A Memorial as Unique as Your Pet
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Each resin memorial is a one-of-a-kind piece, handcrafted with love and care. We combine artistry with nature to create a timeless keepsake that honors the special bond you shared.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
