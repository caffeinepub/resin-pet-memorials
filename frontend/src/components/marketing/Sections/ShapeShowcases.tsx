import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ShapeShowcases() {
  const shapes = [
    {
      name: 'Nabi',
      image: '/assets/generated/nabi-square-memorial.dim_600x600.png',
      description: 'A beloved Yorkie forever preserved in a classic square resin keepsake. Nabi\'s portrait — framed in black — is surrounded by delicate pressed flowers and blades of green grass inside crystal-clear resin.',
      badge: 'Square',
      alt: 'Square clear resin memorial with Yorkie dog portrait in black frame, flowers, and grass embedded inside',
      hasPortrait: true,
    },
    {
      name: 'Whiskers',
      image: '/assets/generated/whiskers-heart-memorial.dim_600x600.png',
      description: 'A heart-shaped resin memorial featuring a beautiful cat portrait framed in black, nestled among soft pressed flowers and lush green grass — a symbol of the unconditional love shared with Whiskers.',
      badge: 'Heart',
      alt: 'Heart-shaped clear resin memorial with cat portrait in black frame, flowers, and grass embedded inside for Whiskers',
      hasPortrait: true,
    },
    {
      name: 'Tweety',
      image: '/assets/generated/tweety-hexagon-memorial.dim_600x600.png',
      description: 'A modern hexagonal resin mold showcasing a stunning bird portrait framed in black, surrounded by vibrant pressed flowers and natural grass blades — preserving Tweety\'s memory in an elegant geometric keepsake.',
      badge: 'Hexagon',
      alt: 'Hexagonal clear resin memorial with bird portrait in black frame, flowers, and grass embedded inside for Tweety',
      hasPortrait: true,
    },
  ];

  return (
    <section id="designs" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Design
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Each shape tells a story. Select the design that best reflects your pet's personality and the love you shared together. Every memorial is unique and nothing is duplicated exactly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {shapes.map((shape, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-muted relative">
                <img
                  src={shape.image}
                  alt={shape.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {shape.hasPortrait && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 0 6px #000000',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="font-serif text-2xl">{shape.name}</CardTitle>
                  <Badge variant="secondary">{shape.badge}</Badge>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {shape.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
