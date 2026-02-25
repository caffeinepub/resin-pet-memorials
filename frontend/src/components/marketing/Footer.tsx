import { Heart, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined'
    ? encodeURIComponent(window.location.hostname)
    : 'furever-keepsakes-and-memorials';

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="font-serif text-xl font-semibold text-foreground">
                Furever Keepsakes and Memorials
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Handcrafted resin memorials that preserve the memory of your beloved pets with beauty, care, and lasting quality.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('designs');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Designs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('process');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Process
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Each memorial is made to order with love and care. Reach out to create a lasting tribute to your cherished companion.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Furever Keepsakes and Memorials. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-4 w-4 fill-primary text-primary mx-1" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors font-medium ml-1"
            >
              caffeine.ai
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
          <span>Questions? Email us at</span>
          <a
            href="mailto:all4funflorida@gmail.com"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            all4funflorida@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
