import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useImageSlot } from '@/hooks/useImageSlot';

const SHAPE_SLOTS = [
  {
    key: 'shape-square',
    name: 'Nabi',
    fallback: '/assets/generated/resin-square-mold.dim_600x600.png',
    description: 'A beloved Yorkie forever preserved in a classic square clear resin keepsake. Crystal-clear transparent resin filled with delicate pressed flowers and green grass surrounds a small black square frame holding Nabi\'s portrait inside.',
    badge: 'Square',
    alt: 'Square clear transparent resin memorial with Yorkie dog portrait in small black square frame, flowers, and grass embedded inside',
  },
  {
    key: 'shape-heart',
    name: 'Whiskers',
    fallback: '/assets/generated/resin-heart-mold.dim_600x600.png',
    description: 'A heart-shaped clear resin memorial with soft pressed flowers and lush green grass embedded throughout. A small black square frame holding Whiskers\' cat portrait sits beautifully inside the translucent heart.',
    badge: 'Heart',
    alt: 'Heart-shaped clear transparent resin memorial with cat portrait in small black square frame, flowers, and grass embedded inside for Whiskers',
  },
  {
    key: 'shape-hexagon',
    name: 'Teddy',
    fallback: '/assets/generated/resin-hexagon-mold.dim_600x600.png',
    description: 'A modern hexagonal clear resin mold filled with vibrant pressed flowers and natural grass blades. Teddy\'s portrait is displayed inside a small black square frame nestled within the crystal-clear translucent resin.',
    badge: 'Hexagon',
    alt: 'Hexagonal clear transparent resin memorial with portrait in small black square frame, flowers, and grass embedded inside for Teddy',
  },
  {
    key: 'shape-headstone',
    name: 'Ponce',
    fallback: '/assets/generated/ponce-headstone-mold.dim_800x900.png',
    description: 'A timeless headstone-shaped clear resin memorial adorned with delicate flowers and lush grass throughout the transparent mold. Ponce\'s male Yorkie portrait is lovingly displayed inside a solid black square frame within the crystal-clear resin.',
    badge: 'Headstone',
    alt: 'Headstone-shaped clear transparent resin mold with male Yorkie portrait in solid black square frame, colorful flowers, and green grass embedded inside for Ponce',
  },
];

function ShapeCard({ shape }: { shape: typeof SHAPE_SLOTS[number] }) {
  const { data: customImage } = useImageSlot(shape.key);
  const imageSrc = customImage || shape.fallback;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageSrc}
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
  );
}

export default function ShapeShowcases() {
  return (
    <section id="designs" className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Design
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Each shape tells a story. Select the design that best reflects your pet's personality and the love you shared together. Every memorial is crafted with crystal-clear resin, embedded flowers and grass, and a small black square frame holding your pet's portrait.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {SHAPE_SLOTS.map((shape) => (
            <ShapeCard key={shape.key} shape={shape} />
          ))}
        </div>
      </div>
    </section>
  );
}
