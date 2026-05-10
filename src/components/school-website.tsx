'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Menu,
  X,
  Eye,
  Target,
  Heart,
  FlaskConical,
  Monitor,
  BookOpen,
  Palette,
  Trophy,
  Music,
  Users,
  Phone,
  Mail,
  MapPin,
  Star,
  Download,
  ArrowRight,
  GraduationCap,
  Calendar,
  Award,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

/* ─── Scroll Visibility Wrapper ─── */
function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass =
    direction === 'left'
      ? 'animate-on-scroll-left'
      : direction === 'right'
      ? 'animate-on-scroll-right'
      : direction === 'scale'
      ? 'animate-on-scroll-scale'
      : 'animate-on-scroll';

  const delayClass = delay ? `delay-${delay}` : '';

  return (
    <div
      ref={containerRef}
      className={`${dirClass} ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <span ref={containerRef} className="stat-number">
      {count}
      {suffix}
    </span>
  );
}

/* ─── Navigation ─── */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Home', 'About', 'Academics', 'Campus Life', 'Admissions', 'Contact'];

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id.toLowerCase().replace(/\s+/g, '-'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-solid' : 'nav-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Name */}
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Bharatiya Vidya Bhavan Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1
                className={`text-lg font-bold tracking-tight leading-tight transition-colors duration-500 ${
                  scrolled ? 'text-bvb-charcoal' : 'text-white'
                }`}
              >
                Bharatiya Vidya Bhavan
              </h1>
              <p
                className={`text-xs tracking-wide transition-colors duration-500 ${
                  scrolled ? 'text-bvb-gray' : 'text-white/80'
                }`}
              >
                Bhopal
              </p>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-bvb-green/10`}
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => scrollTo('admissions')}
              className="ml-4 px-6 py-2.5 bg-bvb-gold text-bvb-green-dark font-semibold rounded-lg text-sm hover:bg-bvb-gold-light transition-all duration-300 shadow-lg shadow-bvb-gold/20 hover:shadow-bvb-gold/40"
            >
              Apply Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-bvb-charcoal' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-500 overflow-hidden ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white shadow-xl border-t border-bvb-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="text-left px-4 py-3 text-bvb-charcoal font-medium rounded-lg hover:bg-bvb-cream transition-colors"
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => scrollTo('admissions')}
              className="mt-2 px-6 py-3 bg-bvb-gold text-bvb-green-dark font-semibold rounded-lg text-center hover:bg-bvb-gold-light transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-campus.png"
          alt="Bharatiya Vidya Bhavan Campus"
          fill
          className="object-cover"
          priority
          quality={75}
        />
        {/* Green overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(13, 94, 58, 0.82) 0%, rgba(9, 64, 40, 0.75) 50%, rgba(13, 94, 58, 0.7) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div className="animate-[fade-in-up_0.8s_ease-out_forwards]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Award className="w-4 h-4 text-bvb-gold" />
            <span className="text-sm text-white/90 font-medium">CBSE Affiliated · Est. 1985</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
            Nurturing Minds,
            <br />
            <span className="text-bvb-gold">Shaping Futures</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            A Premier CBSE Institution in the Heart of Bhopal — Where Tradition Meets Innovation
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-bvb-gold text-bvb-gold font-semibold rounded-xl hover:bg-bvb-gold hover:text-bvb-green-dark transition-all duration-300 w-full sm:w-auto"
            >
              Explore Our Campus
            </button>
            <button
              onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-bvb-gold text-bvb-green-dark font-semibold rounded-xl hover:bg-bvb-gold-light transition-all duration-300 shadow-lg shadow-bvb-gold/30 w-full sm:w-auto"
            >
              Apply for Admission
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce-subtle">
          <ChevronDown className="w-8 h-8 text-white/60 mx-auto" />
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '35+', label: 'Years' },
              { value: '5000+', label: 'Alumni' },
              { value: '100%', label: 'Results' },
              { value: 'CBSE', label: 'Affiliated' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/15 text-center animate-[fade-in-up_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${0.8 + i * 0.15}s`, opacity: 0 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-bvb-gold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  const highlights = [
    {
      icon: Eye,
      title: 'Our Vision',
      text: 'To be a beacon of holistic education, fostering global citizens rooted in Indian values and equipped for tomorrow\'s challenges.',
    },
    {
      icon: Target,
      title: 'Our Mission',
      text: 'Empowering students with knowledge, character, and skills through innovative pedagogy and a nurturing environment.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      text: 'Integrity, compassion, excellence, and respect form the cornerstone of our educational philosophy and community.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Image */}
          <ScrollReveal direction="left">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-bvb-green/10 image-hover-zoom">
              <Image
                src="/images/school-entrance.png"
                alt="Bharatiya Vidya Bhavan School Entrance"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-bvb-gold/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-bvb-green/10 rounded-xl -z-10" />
            </div>
          </ScrollReveal>

          {/* Right Text */}
          <ScrollReveal direction="right">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-bvb-charcoal tracking-tight gold-accent-line pb-4">
                About Our Institution
              </h2>
              <p className="text-bvb-gray mt-8 leading-relaxed text-base sm:text-lg">
                Established in 1985, Bharatiya Vidya Bhavan, Bhopal has been a cornerstone of
                quality education in Madhya Pradesh for nearly four decades. Nestled in the heart
                of the City of Lakes, our institution blends the rich cultural heritage of India
                with modern educational practices, creating an environment where young minds
                flourish and futures are shaped.
              </p>
              <p className="text-bvb-gray mt-4 leading-relaxed text-base sm:text-lg">
                As a CBSE-affiliated senior secondary school, we are committed to academic
                excellence while nurturing the all-round development of every student. Our
                dedicated faculty, state-of-the-art infrastructure, and holistic approach to
                education have made us one of the most respected institutions in Bhopal.
              </p>

              {/* Highlights Grid */}
              <div className="grid sm:grid-cols-3 gap-6 mt-10">
                {highlights.map((item, i) => (
                  <ScrollReveal key={item.title} delay={(i + 1) * 100}>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-bvb-green/10 flex items-center justify-center mb-3">
                        <item.icon className="w-6 h-6 text-bvb-green" />
                      </div>
                      <h3 className="font-semibold text-bvb-charcoal mb-1">{item.title}</h3>
                      <p className="text-sm text-bvb-gray leading-relaxed">{item.text}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─── Academics Section ─── */
function AcademicsSection() {
  const cards = [
    {
      image: '/images/academics-lab.png',
      icon: FlaskConical,
      title: 'Science & Technology',
      description:
        'State-of-the-art laboratories for Physics, Chemistry, and Biology with hands-on experimental learning under expert guidance.',
    },
    {
      image: '/images/computer-lab.png',
      icon: Monitor,
      title: 'Computer Science & AI',
      description:
        'Cutting-edge computer labs equipped with modern technology, programming courses, and AI fundamentals for future innovators.',
    },
    {
      image: '/images/library.png',
      icon: BookOpen,
      title: 'Library & Research',
      description:
        'A vast collection of over 25,000 books, digital resources, and research materials fostering a culture of inquiry and knowledge.',
    },
    {
      image: null,
      icon: Palette,
      title: 'Arts & Humanities',
      description:
        'Comprehensive programs in fine arts, literature, social sciences, and creative writing nurturing well-rounded individuals.',
    },
  ];

  return (
    <section id="academics" className="py-20 lg:py-28" style={{ background: '#FDF8EE' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-bvb-charcoal tracking-tight gold-accent-line gold-accent-line-center pb-4 inline-block">
              Academic Excellence
            </h2>
            <p className="text-bvb-gray mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Our CBSE curriculum is enriched with innovative teaching methodologies, ensuring
              students receive a world-class education that prepares them for national and global
              opportunities.
            </p>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={(i + 1) * 100}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md card-hover-lift border border-bvb-border/50 h-full flex flex-col">
                {/* Image or Icon Header */}
                {card.image ? (
                  <div className="relative h-48 image-hover-zoom">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bvb-green-dark/40 to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-bvb-green to-bvb-green-dark flex items-center justify-center">
                    <card.icon className="w-16 h-16 text-bvb-gold/80" />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-bvb-charcoal mb-2">{card.title}</h3>
                  <p className="text-sm text-bvb-gray leading-relaxed flex-1">{card.description}</p>
                  <button className="mt-4 inline-flex items-center gap-1.5 text-bvb-green font-semibold text-sm hover:gap-3 transition-all duration-300">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Campus Life Section ─── */
function CampusLifeSection() {
  const features = [
    {
      icon: Music,
      title: 'Cultural Activities',
      description:
        'Music, dance, drama, and art programs that celebrate India\'s cultural diversity and develop creative expression.',
      image: '/images/cultural.png',
    },
    {
      icon: Users,
      title: 'Community Service',
      description:
        'NCC, NSS, and social outreach programs building character, empathy, and a sense of responsibility towards society.',
      image: null,
    },
  ];

  return (
    <section id="campus-life" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-bvb-charcoal tracking-tight gold-accent-line gold-accent-line-center pb-4 inline-block">
              Life at Bharatiya Vidya Bhavan
            </h2>
            <p className="text-bvb-gray mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Education extends far beyond the classroom. Our vibrant campus life ensures every
              student discovers and develops their unique talents.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Large Feature Image */}
          <ScrollReveal direction="left">
            <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-xl image-hover-zoom">
              <Image
                src="/images/sports.png"
                alt="Sports and Athletics at Bharatiya Vidya Bhavan"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bvb-green-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-bvb-gold/90 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-bvb-green-dark" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Sports & Athletics</h3>
                </div>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Comprehensive sports programs including cricket, basketball, athletics, and
                  yoga with professional coaching and inter-school competitions.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Stacked Cards */}
          <div className="flex flex-col gap-6">
            {features.map((feat, i) => (
              <ScrollReveal key={feat.title} direction="right" delay={(i + 1) * 200}>
                <div className="flex gap-5 bg-bvb-offwhite rounded-2xl p-5 sm:p-6 border border-bvb-border/50 card-hover-lift h-full">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden">
                    {feat.image ? (
                      <Image
                        src={feat.image}
                        alt={feat.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-bvb-green to-bvb-green-light flex items-center justify-center">
                        <feat.icon className="w-10 h-10 text-bvb-gold" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-bvb-charcoal mb-1">{feat.title}</h3>
                    <p className="text-sm text-bvb-gray leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Statistics / Achievements Section ─── */
function StatisticsSection() {
  const stats = [
    { value: 35, suffix: '+', label: 'Years of Excellence', icon: Calendar },
    { value: 5000, suffix: '+', label: 'Successful Alumni', icon: GraduationCap },
    { value: 150, suffix: '+', label: 'Expert Faculty', icon: Users },
    { value: 98, suffix: '%', label: 'Board Results', icon: Award },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: '#0D5E3A' }}>
      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Our Achievements
            </h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto text-base sm:text-lg">
              Numbers that reflect our commitment to excellence
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} direction="scale" delay={(i + 1) * 100}>
              <div className="text-center p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-bvb-gold/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-bvb-gold" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-bvb-gold mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/70 text-sm sm:text-base font-medium">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        'Bharatiya Vidya Bhavan has been a second home for my child. The teachers are incredibly dedicated, and the holistic approach to education has helped my daughter grow both academically and personally.',
      name: 'Mrs. Sunita Sharma',
      role: 'Parent — Class XII Student',
      rating: 5,
      avatar: null,
    },
    {
      quote:
        'The years I spent at Bhavan were transformative. The school didn\'t just teach me subjects — it taught me how to think, lead, and face challenges with confidence. I owe my success to the values imbibed here.',
      name: 'Rahul Joshi',
      role: 'Alumni — Batch of 2018',
      rating: 5,
      avatar: '/images/teacher.png',
    },
    {
      quote:
        'What makes Bhavan special is the perfect balance between academics and extracurriculars. I represented the school in national-level debates and still managed to score 95% in my boards!',
      name: 'Priya Patel',
      role: 'Student — Class XII Science',
      rating: 5,
      avatar: null,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-bvb-charcoal tracking-tight gold-accent-line gold-accent-line-center pb-4 inline-block">
              Voices of Our Community
            </h2>
            <p className="text-bvb-gray mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Hear from the people who make Bharatiya Vidya Bhavan a truly special place
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={(i + 1) * 100}>
              <div className="bg-bvb-offwhite rounded-2xl p-6 sm:p-8 border border-bvb-border/50 card-hover-lift h-full flex flex-col">
                {/* Quote Mark */}
                <div className="quote-mark mb-2">&ldquo;</div>

                <p className="text-bvb-gray leading-relaxed flex-1 text-sm sm:text-base">
                  {t.quote}
                </p>

                {/* Rating */}
                <div className="flex gap-0.5 mt-4 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-bvb-gold text-bvb-gold"
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-bvb-border/50">
                  {t.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-bvb-green/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-bvb-green font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-bvb-charcoal text-sm">{t.name}</p>
                    <p className="text-xs text-bvb-gray">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Admissions CTA Section ─── */
function AdmissionsSection() {
  return (
    <section id="admissions" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0D5E3A 0%, #094028 50%, #072E1D 100%)',
        }}
      />
      <div className="absolute inset-0 geometric-pattern" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <GraduationCap className="w-4 h-4 text-bvb-gold" />
            <span className="text-sm text-white/90 font-medium">Admissions Open 2025-26</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            Begin Your Journey
            <br />
            <span className="text-bvb-gold">With Us</span>
          </h2>

          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-10">
            Take the first step towards a world-class education. Our admission process is designed
            to be seamless and transparent. Join the Bharatiya Vidya Bhavan family and watch your
            child flourish.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-bvb-gold text-bvb-gold font-semibold rounded-xl hover:bg-bvb-gold hover:text-bvb-green-dark transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center">
              <Download className="w-5 h-5" />
              Download Prospectus
            </button>
            <button className="px-8 py-4 bg-bvb-gold text-bvb-green-dark font-semibold rounded-xl hover:bg-bvb-gold-light transition-all duration-300 shadow-lg shadow-bvb-gold/30 flex items-center gap-2 w-full sm:w-auto justify-center">
              Apply Online
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </ScrollReveal>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-bvb-gold/10 rounded-full hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-bvb-gold/10 rounded-full hidden lg:block" />
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-bvb-gold/30 rounded-full hidden lg:block" />
      </div>
    </section>
  );
}

/* ─── Contact / Footer ─── */
function Footer() {
  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Academics', href: '#academics' },
    { label: 'Campus Life', href: '#campus-life' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer id="contact" style={{ background: '#1A1A2E' }}>
      {/* Gold accent line */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #C8A951, #D4BA6A, #C8A951)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* School Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Bharatiya Vidya Bhavan Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Bharatiya Vidya Bhavan</h3>
                <p className="text-bvb-gold text-xs tracking-wider">BHOPAL</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              A premier CBSE-affiliated senior secondary school in Bhopal, Madhya Pradesh,
              nurturing minds and shaping futures since 1985.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-bvb-gold hover:text-bvb-green-dark hover:border-bvb-gold transition-all duration-300"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 text-sm hover:text-bvb-gold transition-colors duration-300 inline-flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-bvb-gold/50" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-bvb-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm leading-relaxed">
                  Bharatiya Vidya Bhavan,<br />
                  Habibganj, Bhopal,<br />
                  Madhya Pradesh - 462024
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-bvb-gold flex-shrink-0" />
                <span className="text-white/50 text-sm">+91 755 255 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-bvb-gold flex-shrink-0" />
                <span className="text-white/50 text-sm">info@bvbhopal.edu.in</span>
              </li>
            </ul>
          </div>

          {/* Map Placeholder */}
          <div>
            <h4 className="text-white font-semibold mb-5">Find Us</h4>
            <div className="w-full h-48 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-bvb-gold mx-auto mb-2" />
                <p className="text-white/40 text-xs">Bhopal, Madhya Pradesh</p>
                <p className="text-bvb-gold/60 text-xs mt-1">23.2599° N, 77.4126° E</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Bharatiya Vidya Bhavan, Bhopal. All rights reserved.
          </p>
          <p className="text-white/30 text-xs sm:text-sm">
            CBSE Affiliation No: 1020154
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Component ─── */
export default function SchoolWebsite() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <AcademicsSection />
        <CampusLifeSection />
        <StatisticsSection />
        <TestimonialsSection />
        <AdmissionsSection />
      </main>
      <Footer />
    </div>
  );
}
