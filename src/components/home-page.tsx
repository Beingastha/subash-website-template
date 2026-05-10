'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDown,
  BookOpen,
  Monitor,
  Library,
  GraduationCap,
  Award,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  Quote,
  BadgeCheck,
  Target,
  Lightbulb,
  Heart,
} from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';
import AnimatedCounter from '@/components/shared/animated-counter';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="home" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-campus.png"
            alt="Govt. HSS Excellence Campus"
            fill
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gse-green/80 via-gse-green-dark/70 to-gse-green-dark/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <ScrollReveal direction="up">
            <div className="inline-block mb-4 px-4 py-1.5 bg-gse-gold/20 border border-gse-gold/40 rounded-full">
              <span className="text-gse-gold text-sm font-medium">
                Department of School Education, M.P.
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              School for <span className="text-gse-gold">Excellence</span>,<br />
              Bhopal
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
              Nurturing Tomorrow&apos;s Leaders — A Government School of Distinction in Subhash Shivaji Nagar
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-gse-gold text-gse-charcoal font-semibold rounded-lg hover:bg-gse-gold-light transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Apply Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/principal"
                className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Principal&apos;s Message
              </Link>
            </div>
          </ScrollReveal>

          {/* Floating Stats */}
          <ScrollReveal direction="up" delay={500}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Est. Govt. School', icon: BadgeCheck },
                { label: 'MP Board', icon: GraduationCap },
                { label: 'Excellence in Sports', icon: Award },
                { label: 'Subhash Nagar', icon: Target },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center"
                >
                  <stat.icon size={24} className="text-gse-gold mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Bouncing scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-subtle">
          <ChevronDown size={32} className="text-gse-gold" />
        </div>
      </section>

      <main className="flex-1">
        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <div className="relative image-hover-zoom rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/hero-campus.png"
                    alt="School Entrance - Govt. HSS Excellence"
                    width={600}
                    height={450}
                    className="object-cover w-full h-[350px] md:h-[450px]"
                    quality={75}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gse-green-dark/80 to-transparent p-6">
                    <p className="text-gse-gold font-semibold text-sm">Since Establishment</p>
                    <p className="text-white text-xl font-bold">Govt. School of Excellence</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line">
                    About Our School
                  </h2>
                  <div className="h-1 w-16 bg-gse-gold mb-6 rounded-full" />
                  <p className="text-gse-gray leading-relaxed mb-4">
                    Govt. Higher Secondary School for Excellence, Subhash Shivaji Nagar, Bhopal is a
                    premier government institution under the Department of School Education, Madhya Pradesh.
                    As a designated School for Excellence, we are committed to providing world-class
                    education to students from all sections of society.
                  </p>
                  <p className="text-gse-gray leading-relaxed mb-6">
                    Affiliated with the Madhya Pradesh Board of Secondary Education (MP Board), our school
                    offers a comprehensive curriculum in Science, Mathematics, and Humanities streams at the
                    higher secondary level. With dedicated faculty, modern infrastructure, and a focus on
                    holistic development, we strive to nurture responsible citizens and future leaders.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: Target, label: 'Mission-Driven', desc: 'Quality education for all' },
                      { icon: Lightbulb, label: 'Innovation', desc: 'Modern teaching methods' },
                      { icon: Heart, label: 'Holistic Growth', desc: 'Beyond academics' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-4 bg-gse-cream rounded-lg"
                      >
                        <item.icon size={28} className="text-gse-green mx-auto mb-2" />
                        <p className="font-semibold text-gse-charcoal text-sm">{item.label}</p>
                        <p className="text-gse-gray text-xs mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Academics Section */}
        <section id="academics" className="py-16 md:py-24 bg-gse-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Academics
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Our academic programs are designed to foster critical thinking, scientific temper,
                  and a love for learning across multiple disciplines.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Science',
                  image: '/images/academics-lab.png',
                  icon: BookOpen,
                  desc: 'State-of-the-art laboratories for Physics, Chemistry, and Biology. Hands-on experiments and project-based learning prepare students for competitive examinations and higher studies.',
                },
                {
                  title: 'Computer Science',
                  image: '/images/computer-lab.png',
                  icon: Monitor,
                  desc: 'Well-equipped computer lab with modern systems and internet connectivity. Students learn programming, digital literacy, and emerging technologies essential for the 21st century.',
                },
                {
                  title: 'Library',
                  image: '/images/library.png',
                  icon: Library,
                  desc: 'Extensive library with thousands of books, periodicals, and digital resources. A quiet haven for study, research, and intellectual growth that inspires a lifelong reading habit.',
                },
              ].map((card, i) => (
                <ScrollReveal key={card.title} direction="up" delay={i * 150}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md card-hover-lift">
                    <div className="relative h-52 image-hover-zoom">
                      <Image
                        src={card.image}
                        alt={`${card.title} at Govt. HSS Excellence`}
                        fill
                        className="object-cover"
                        quality={75}
                      />
                      <div className="absolute top-4 left-4 w-10 h-10 bg-gse-green rounded-full flex items-center justify-center shadow-lg">
                        <card.icon size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gse-charcoal mb-2">{card.title}</h3>
                      <p className="text-gse-gray text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Activities Preview Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Sports & Activities
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Our school takes pride in its outstanding sports facilities and coaching,
                  producing champions at district and state levels.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Badminton',
                  image: '/images/badminton.png',
                  desc: 'Indoor badminton courts with professional coaching and regular tournaments.',
                },
                {
                  title: 'Boxing',
                  image: '/images/boxing.png',
                  desc: 'Dedicated boxing ring and training facility with experienced coaches.',
                },
                {
                  title: 'Cricket',
                  image: '/images/cricket.png',
                  desc: 'Cricket ground with nets and coaching for aspiring cricketers.',
                },
              ].map((card, i) => (
                <ScrollReveal key={card.title} direction="up" delay={i * 150}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gse-border card-hover-lift">
                    <div className="relative h-56 image-hover-zoom">
                      <Image
                        src={card.image}
                        alt={`${card.title} at Govt. HSS Excellence`}
                        fill
                        className="object-cover"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gse-green-dark/70 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                        {card.title}
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-gse-gray text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal direction="up" delay={300}>
              <div className="text-center mt-10">
                <Link
                  href="/activities"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gse-green text-white font-semibold rounded-lg hover:bg-gse-green-light transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  View All Activities <ArrowRight size={18} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 md:py-20 bg-gse-green relative overflow-hidden">
          <div className="absolute inset-0 pattern-overlay" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <AnimatedCounter end={50} suffix="+" label="Years of Service" />
              <AnimatedCounter end={1200} suffix="+" label="Students Enrolled" />
              <AnimatedCounter end={45} suffix="+" label="Expert Faculty" />
              <AnimatedCounter end={92} suffix="%" label="Board Pass Rate" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-gse-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  What People Say
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Hear from our students, parents, and alumni about their experience at
                  Govt. HSS Excellence.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Ananya Sharma',
                  role: 'Student, Class XII Science',
                  quote:
                    'The science labs and dedicated teachers here have given me the confidence to pursue engineering. The school has truly lived up to its name — Excellence!',
                  stars: 5,
                },
                {
                  name: 'Rajesh Kumar Verma',
                  role: 'Parent',
                  quote:
                    'As a government school, the quality of education and facilities here is remarkable. The hostel facility ensures my son gets a safe and disciplined environment for studies.',
                  stars: 5,
                },
                {
                  name: 'Priya Patel',
                  role: 'Alumni, Batch 2022',
                  quote:
                    'The boxing training and sports facilities transformed my life. I represented the school at state level and the discipline I learned here guides me in everything I do.',
                  stars: 5,
                },
              ].map((testimonial, i) => (
                <ScrollReveal key={testimonial.name} direction="up" delay={i * 150}>
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-md card-hover-lift relative">
                    <Quote size={40} className="text-gse-gold/20 absolute top-4 right-4" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.stars }).map((_, j) => (
                        <Star key={j} size={16} className="fill-gse-gold text-gse-gold" />
                      ))}
                    </div>
                    <p className="text-gse-gray text-sm leading-relaxed mb-6 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gse-green flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gse-charcoal text-sm">{testimonial.name}</p>
                        <p className="text-gse-gray text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Admissions CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-gse-green via-gse-green-dark to-gse-green relative overflow-hidden">
          <div className="absolute inset-0 geometric-pattern" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal direction="scale">
              <div className="inline-block mb-4 px-4 py-1.5 bg-gse-gold/20 border border-gse-gold/40 rounded-full">
                <span className="text-gse-gold text-sm font-semibold animate-pulse-gold">
                  Admissions Open
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Admissions Open for New Session
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join Govt. HSS Excellence and give your child the opportunity to learn, grow,
                and excel in a nurturing environment. Limited seats available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3.5 bg-gse-gold text-gse-charcoal font-bold rounded-lg hover:bg-gse-gold-light transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Apply Now <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Contact for Details
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
