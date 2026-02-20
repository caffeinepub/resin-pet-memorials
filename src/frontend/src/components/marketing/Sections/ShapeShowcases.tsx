import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ShapeShowcases() {
  const shapes = [
    {
      name: 'Nabi',
      image: '/assets/generated/yorkie-headstone-nabi-v2.dim_600x800.png',
      description: 'Traditional and dignified headstone memorial featuring a beloved yorkie. Each memorial includes grass and small pebble stones at the base, with a nameplate honoring your companion.',
      badge: 'Headstone',
      alt: 'Headstone memorial with yorkie photo and nameplate reading Nabi, grass and pebbles at base'
    },
    {
      name: 'Tweety',
      image: '/assets/generated/bird-headstone.dim_600x800.png',
      description: 'Beautiful headstone memorial celebrating your feathered friend. Adorned with natural elements and a personalized nameplate to honor their vibrant spirit.',
      badge: 'Headstone',
      alt: 'Headstone memorial with bird photo and nameplate reading Tweety, grass and pebbles at base'
    },
    {
      name: 'Whiskers',
      image: '/assets/generated/cat-headstone.dim_600x800.png',
      description: 'Elegant headstone memorial for your feline companion. Features grass, pebble stones, and a nameplate that preserves their memory with grace and dignity.',
      badge: 'Headstone',
      alt: 'Headstone memorial with cat photo and nameplate reading Whiskers, grass and pebbles at base'
    },
    {
      name: 'Heart',
      image: '/assets/generated/shape-heart.dim_1200x1200.png',
      description: 'A symbol of eternal love, the heart-shaped memorial captures the deep bond you shared, making it the most sentimental choice for honoring your companion.',
      badge: 'Sentimental',
      alt: 'Heart shaped resin memorial'
    },
    {
      name: 'Hexagon',
      image: '/assets/generated/shape-hexagon.dim_1200x1200.png',
      description: 'Modern and geometric, the hexagon shape creates a unique focal point with its six-sided symmetry, beautifully framing your cherished memories.',
      badge: 'Modern',
      alt: 'Hexagon shaped resin memorial'
    },
    {
      name: 'Square',
      image: '/assets/generated/shape-square.dim_1200x1200.png',
      description: 'Classic and timeless, the square design offers a balanced composition perfect for displaying your pet\'s portrait surrounded by delicate botanical elements.',
      badge: 'Classic',
      alt: 'Square shaped resin memorial'
    }
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shapes.map((shape, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={shape.image}
                  alt={shape.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
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
