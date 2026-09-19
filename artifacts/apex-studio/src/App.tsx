import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const WHATSAPP = 'https://wa.me/923190470986';
const GOOGLE_MAPS = 'https://maps.app.goo.gl/rDKPWTKyZ6fCm8vC8';
const INSTAGRAM = 'https://www.instagram.com/apex___.studio';
const TIKTOK = 'https://www.tiktok.com/@apexstudio___';
const SERVICES = ['Car Detailing', 'Paint Correction', 'Paint Protection Film (PPF)'] as const;
const ASSET_BASE = import.meta.env.BASE_URL;

type FormState = {
  name: string;
  contact: string;
  service: string;
  carModel: string;
};

function ExternalLink({
  href,
  children,
  className = '',
  testId,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  testId: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" data-testid={testId}>
      {children}
    </a>
  );
}

function useReveals() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Home() {
  useReveals();
  const heroRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    contact: '',
    service: SERVICES[0],
    carModel: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleHeroMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current || window.innerWidth < 800) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current.style.setProperty('--hero-x', `${x * 9}deg`);
    heroRef.current.style.setProperty('--hero-y', `${y * -7}deg`);
  };

  const resetHero = () => {
    heroRef.current?.style.setProperty('--hero-x', '0deg');
    heroRef.current?.style.setProperty('--hero-y', '0deg');
  };

  const updateField = (field: keyof FormState, value: string) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Please add your name.';
    if (!form.contact.trim() || form.contact.replace(/\D/g, '').length < 7) nextErrors.contact = 'Enter a valid contact number.';
    if (!form.carModel.trim()) nextErrors.carModel = 'Tell us which car is coming in.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const message = [
      'Hello Apex Studio, I would like to book an appointment.',
      '',
      `Name: ${form.name.trim()}`,
      `Contact number: ${form.contact.trim()}`,
      `Service Needed: ${form.service}`,
      `Car Model: ${form.carModel.trim()}`,
    ].join('\n');
    window.open(`${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="apex-page">
      <header className="apex-nav apex-wrap">
        <a href="#top" aria-label="Apex Studio home" data-testid="link-navbar-home">
          <img className="apex-logo" src={`${ASSET_BASE}assets/logo.png`} alt="Apex Studio — Car Detailing" />
        </a>
        <nav className={`apex-navlinks ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#studio" onClick={() => setMenuOpen(false)} data-testid="link-navbar-studio">The studio</a>
          <a href="#services" onClick={() => setMenuOpen(false)} data-testid="link-navbar-services">Services</a>
          <a href="#work" onClick={() => setMenuOpen(false)} data-testid="link-navbar-work">Our work</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="link-navbar-contact">Contact</a>
        </nav>
        <ExternalLink href={WHATSAPP} className="apex-nav-cta" testId="link-navbar-whatsapp">
          Book via WhatsApp <ArrowUpRight size={14} strokeWidth={1.8} />
        </ExternalLink>
        <button className="apex-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <main id="top">
        <section className="apex-hero" ref={heroRef} onMouseMove={handleHeroMove} onMouseLeave={resetHero}>
           <img className="apex-hero-image" src={`${ASSET_BASE}assets/hero-1.jpg`} alt="Black Toyota Hilux inside the Apex Studio workshop" />
          <div className="apex-hero-content">
            <p className="apex-kicker reveal">Multan / Open all days / 10 AM – 10 PM</p>
            <h1 className="apex-display reveal delay-1">The finish<br /><em>you feel.</em></h1>
            <p className="apex-hero-sub reveal delay-2">
              A meticulous auto-care studio for people who notice the difference. We return every surface to its best self.
            </p>
            <div className="apex-actions reveal delay-3">
              <a className="apex-button" href="#booking" data-testid="link-hero-booking">
                Reserve a bay <ArrowDown size={15} />
              </a>
              <a className="apex-button ghost" href="#work" data-testid="link-hero-work">
                See the work <Play size={13} fill="currentColor" />
              </a>
            </div>
            <div className="apex-hero-orbit" aria-hidden="true">
              <span className="apex-orbit-ring" />
              <span className="apex-orbit-label">APX / 01</span>
              <Sparkles size={16} />
            </div>
            <p className="apex-hero-note">Showroom finish, every time</p>
          </div>
          <a className="apex-scroll" href="#studio" data-testid="link-hero-scroll">Scroll to explore</a>
        </section>

        <section id="studio" className="apex-intro">
          <div className="apex-wrap apex-intro-grid">
            <div className="reveal">
              <p className="apex-kicker">01 / The atelier</p>
              <h2 className="apex-display">Precision<br />looks good<br /><em>on you.</em></h2>
            </div>
            <div className="apex-intro-copy reveal delay-1">
              <p>
                Apex Studio — Car Detailing is where careful hands, proper light and a deep respect for the machine come together. No rushed wash lines. No shortcuts hidden under shine.
              </p>
              <p>
                Every car gets a considered treatment, from the first inspection to the final walk-around with <strong>Ali Salman Mehdi</strong>.
              </p>
              <div className="apex-rule" />
              <div className="apex-metrics">
                <div className="apex-metric"><strong>10–10</strong><span>Every day</span></div>
                <div className="apex-metric"><strong>01:01</strong><span>One car at a time</span></div>
                <div className="apex-metric"><strong>360°</strong><span>Final inspection</span></div>
              </div>
            </div>
          </div>
        </section>

         <section
           id="services"
           className="apex-dark"
           style={{ '--apex-services-image': `url(${ASSET_BASE}assets/hero-2.jpg)` } as CSSProperties}
         >
          <div className="apex-wrap">
            <div className="apex-section-head reveal">
              <div>
                <p className="apex-kicker">02 / What we do</p>
                <h2 className="apex-display">The right<br /><em>treatment.</em></h2>
              </div>
              <p>Built around the condition of your car, not a one-size-fits-all menu. We’ll tell you exactly what it needs.</p>
            </div>
            <div className="apex-service-list">
              <a className="apex-service reveal" href="#booking" data-testid="link-service-detailing">
                <span className="apex-service-num">01</span>
                <div><h3>Car Detailing</h3><p>Reset the cabin. Refine every exterior surface.</p></div>
                <ArrowUpRight size={21} strokeWidth={1.4} />
              </a>
              <a className="apex-service reveal delay-1" href="#booking" data-testid="link-service-correction">
                <span className="apex-service-num">02</span>
                <div><h3>Paint Correction</h3><p>Measured polishing for clarity, depth and reflection.</p></div>
                <ArrowUpRight size={21} strokeWidth={1.4} />
              </a>
              <a className="apex-service reveal delay-2" href="#booking" data-testid="link-service-ppf">
                <span className="apex-service-num">03</span>
                <div><h3>Paint Protection Film (PPF)</h3><p>Invisible protection for the surfaces you want to keep perfect.</p></div>
                <ArrowUpRight size={21} strokeWidth={1.4} />
              </a>
            </div>
          </div>
        </section>

        <section className="apex-feature">
          <div className="apex-wrap apex-feature-grid">
            <div className="reveal">
              <img className="apex-feature-img" src={`${ASSET_BASE}assets/hero-2.jpg`} alt="Apex Studio vehicle receiving a precision finish under inspection lights" />
            </div>
            <div className="apex-feature-copy reveal delay-1">
              <p className="apex-kicker">03 / The difference</p>
              <h2 className="apex-display">Light tells<br />the truth.</h2>
              <p>
                In our bay, every mark has somewhere to hide — except under the lights. We work panel by panel, checking the paint from every angle until the reflection is clean and uninterrupted.
              </p>
              <div className="apex-detail">
                <div className="apex-detail-row"><span>Inspection</span><span>Full-light assessment</span></div>
                <div className="apex-detail-row"><span>Products</span><span>Professional-grade only</span></div>
                <div className="apex-detail-row"><span>Handover</span><span>Walk-around with <strong>Ali Salman Mehdi</strong></span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="apex-gallery">
          <div className="apex-wrap">
            <div className="apex-gallery-head reveal">
              <div><p className="apex-kicker">04 / In the studio</p><h2 className="apex-display">Proof is<br /><em>in the gloss.</em></h2></div>
              <p>Real bays. Real cars. The kind of work that catches the ceiling lights and holds them.</p>
            </div>
            <div className="apex-gallery-grid">
              <figure className="apex-gallery-card reveal">
                <img src={`${ASSET_BASE}assets/ppf-car.jpg`} alt="Vehicle ready for Paint Protection Film at Apex Studio" />
                <figcaption className="apex-gallery-label">Paint Protection Film</figcaption>
              </figure>
              <figure className="apex-gallery-card reveal delay-1">
                <img src={`${ASSET_BASE}assets/detailing-progress.jpg`} alt="Detailer polishing a dark car under inspection lights" />
                <figcaption className="apex-gallery-label">Detailing in Progress</figcaption>
              </figure>
              <figure className="apex-gallery-card reveal delay-2">
                <img src={`${ASSET_BASE}assets/showroom-1.jpg`} alt="The Apex Studio showroom and workshop entrance" />
                <figcaption className="apex-gallery-label">Our Showroom</figcaption>
              </figure>
            </div>
            <div className="apex-process">
              <p className="apex-kicker reveal">05 / The ritual</p>
              <h2 className="apex-display reveal delay-1">A better finish<br />is a <em>better process.</em></h2>
              <div className="apex-process-grid">
                <div className="apex-process-item reveal"><strong>01 / Assess</strong><h3>Start with the light.</h3><p>We inspect the car as it is, then build the right treatment around what we find.</p></div>
                <div className="apex-process-item reveal delay-1"><strong>02 / Refine</strong><h3>Take the time.</h3><p>Our studio stays open all days so the work never has to be hurried.</p></div>
                <div className="apex-process-item reveal delay-2"><strong>03 / Reveal</strong><h3>Hand it back right.</h3><p>We finish with a detailed walk-around, led by <strong>Ali Salman Mehdi</strong>.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="apex-booking">
          <div className="apex-wrap">
            <div className="apex-booking-logo-top reveal">
               <img src={`${ASSET_BASE}assets/logo.png`} alt="Apex Studio — Car Detailing" />
            </div>
            <div className="apex-booking-grid">
              <div className="apex-booking-brand reveal">
                <p className="apex-kicker">06 / Reserve your bay</p>
                <h2 className="apex-display">Let’s make it<br /><em>look new.</em></h2>
                <p>Share a few details and we’ll continue the conversation on WhatsApp. <strong>Ali Salman Mehdi</strong> will help you choose the right treatment.</p>
              </div>
              <form className="apex-form reveal delay-1" onSubmit={submitBooking} noValidate>
                <div className="apex-field">
                  <label htmlFor="booking-name">Name</label>
                  <input id="booking-name" value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Your name" autoComplete="name" data-testid="input-booking-name" />
                  {errors.name && <p className="apex-error" data-testid="error-booking-name">{errors.name}</p>}
                </div>
                <div className="apex-field">
                  <label htmlFor="booking-contact">Contact number</label>
                  <input id="booking-contact" value={form.contact} onChange={(event) => updateField('contact', event.target.value)} placeholder="+92 3XX XXXXXXX" autoComplete="tel" inputMode="tel" data-testid="input-booking-contact" />
                  {errors.contact && <p className="apex-error" data-testid="error-booking-contact">{errors.contact}</p>}
                </div>
                <div className="apex-field">
                  <label htmlFor="booking-service">Service Needed</label>
                  <select id="booking-service" value={form.service} onChange={(event) => updateField('service', event.target.value)} data-testid="select-booking-service">
                    {SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
                  </select>
                </div>
                <div className="apex-field">
                  <label htmlFor="booking-car">Car Model</label>
                  <input id="booking-car" value={form.carModel} onChange={(event) => updateField('carModel', event.target.value)} placeholder="Make and model" data-testid="input-booking-car-model" />
                  {errors.carModel && <p className="apex-error" data-testid="error-booking-car-model">{errors.carModel}</p>}
                </div>
                <button className="apex-button" type="submit" data-testid="button-booking-submit">Send Booking on WhatsApp <ArrowUpRight size={15} /></button>
                {submitted && <p className="apex-form-status" data-testid="status-booking-submitted"><Check size={14} /> Message prepared — we’ll see you in the chat.</p>}
              </form>
            </div>
          </div>
        </section>

        <section id="contact" className="apex-contact">
          <div className="apex-wrap">
            <div className="apex-contact-top reveal">
              <div><p className="apex-kicker">07 / Find us</p><h2 className="apex-display">Come by<br /><em>the studio.</em></h2></div>
              <p className="apex-contact-meta">
                Open All Days<br /><strong>10 AM – 10 PM</strong><br /><br />
                Questions or a quick quote?<br /><strong>Ali Salman Mehdi</strong> is on WhatsApp.
              </p>
            </div>
            <div className="apex-contact-links">
              <ExternalLink href={WHATSAPP} className="apex-contact-link reveal" testId="link-contact-whatsapp"><span>WhatsApp</span><MessageCircle size={18} strokeWidth={1.5} /></ExternalLink>
              <ExternalLink href={GOOGLE_MAPS} className="apex-contact-link reveal delay-1" testId="link-contact-maps"><span>Google Maps</span><MapPin size={18} strokeWidth={1.5} /></ExternalLink>
              <ExternalLink href={INSTAGRAM} className="apex-contact-link reveal delay-2" testId="link-contact-instagram"><span>Instagram</span><Instagram size={18} strokeWidth={1.5} /></ExternalLink>
              <ExternalLink href={TIKTOK} className="apex-contact-link reveal delay-3" testId="link-contact-tiktok"><span>TikTok</span><Music2 size={18} strokeWidth={1.5} /></ExternalLink>
            </div>
            <footer className="apex-footer">
              <span>© {new Date().getFullYear()} Apex Studio — Car Detailing</span>
              <span className="apex-mono">Built for the detail-obsessed.</span>
              <ExternalLink href={WHATSAPP} className="apex-footer-book" testId="link-footer-whatsapp">Book via WhatsApp <ArrowUpRight size={14} /></ExternalLink>
            </footer>
          </div>
        </section>
      </main>
      <ExternalLink href={WHATSAPP} className="apex-float" testId="link-floating-whatsapp" aria-label="Contact Apex Studio on WhatsApp">
        <MessageCircle size={21} />
      </ExternalLink>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;