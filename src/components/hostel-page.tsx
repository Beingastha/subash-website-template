'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  BedDouble,
  UtensilsCrossed,
  BookOpen,
  Gamepad2,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  Phone,
  CheckCircle2,
  User,
  Clock,
} from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';

const features = [
  {
    icon: BedDouble,
    title: 'Comfortable Rooms',
    desc: 'Well-ventilated rooms with proper bedding, storage, and study tables for each student. Clean and hygienic living spaces.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Nutritious Mess',
    desc: 'Balanced and nutritious meals prepared in hygienic conditions. Both vegetarian and special dietary options available.',
  },
  {
    icon: BookOpen,
    title: 'Study Hall',
    desc: 'Dedicated study hall with extended hours and supervised study time. Access to library resources and internet for academic work.',
  },
  {
    icon: Gamepad2,
    title: 'Recreation',
    desc: 'Indoor and outdoor recreation facilities including sports equipment, TV room, and common areas for leisure activities.',
  },
  {
    icon: ShieldCheck,
    title: '24/7 Security',
    desc: 'Round-the-clock security with CCTV surveillance, warden supervision, and controlled entry/exit for student safety.',
  },
  {
    icon: Stethoscope,
    title: 'Medical Care',
    desc: 'First-aid facility on campus with regular health check-ups. Quick access to nearby government hospital for emergencies.',
  },
];

const rules = [
  'Students must maintain discipline and follow the daily schedule strictly.',
  'Ragging in any form is strictly prohibited and will result in immediate expulsion.',
  'No student is allowed to leave the hostel premises without prior permission from the warden.',
  'Maintaining cleanliness and hygiene in rooms and common areas is mandatory.',
  'Use of mobile phones is restricted to designated hours only.',
  'Students must attend all study sessions and maintain satisfactory academic performance.',
  'Any damage to hostel property will be charged to the student responsible.',
  'Visitors are allowed only during designated visiting hours with prior approval.',
];

const wardens = [
  {
    name: 'Shri Harish Chandra Sharma',
    designation: 'Chief Warden',
    qualification: 'M.A., B.Ed.',
    experience: '20+ years',
    phone: '+91 755-XXX-XXXX',
  },
  {
    name: 'Shri Dinesh Kumar Namdeo',
    designation: 'Assistant Warden',
    qualification: 'M.Sc., B.Ed.',
    experience: '12+ years',
    phone: '+91 755-XXX-XXXX',
  },
];

export default function HostelPageComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="hostel" />

      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hostel.png"
            alt="Hostel Facilities - Govt. HSS Excellence"
            fill
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gse-green-dark/80 via-gse-green/70 to-gse-green-dark/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Hostel <span className="text-gse-gold">Facilities</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Safe, comfortable, and disciplined living for boys — a home away from home
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Overview */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line">
                    Hostel Overview
                  </h2>
                  <div className="h-1 w-16 bg-gse-gold mb-6 rounded-full" />
                  <p className="text-gse-gray leading-relaxed mb-4">
                    The hostel at Govt. HSS Excellence provides safe and comfortable residential
                    facilities for boys coming from different parts of Madhya Pradesh. Managed by
                    experienced wardens under the supervision of the Principal, the hostel ensures
                    a disciplined and nurturing environment.
                  </p>
                  <p className="text-gse-gray leading-relaxed mb-4">
                    The hostel is equipped with all essential amenities including well-furnished
                    rooms, a hygienic mess, dedicated study hall, and recreational facilities.
                    Our focus is on creating an environment that supports academic excellence
                    while ensuring the physical and emotional well-being of every student.
                  </p>
                  <p className="text-gse-gray leading-relaxed">
                    Being located within the school campus, hostel students have easy access to
                    the library, computer lab, and sports facilities even after school hours,
                    giving them an edge in their academic and extracurricular pursuits.
                  </p>
                </div>
                <div className="relative image-hover-zoom rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/hostel.png"
                    alt="Hostel Building"
                    width={600}
                    height={400}
                    className="object-cover w-full h-[350px]"
                    quality={75}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 md:py-16 bg-gse-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Hostel Features
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Everything your child needs for a comfortable and productive stay
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <ScrollReveal key={feature.title} direction="up" delay={i * 100}>
                  <div className="bg-white p-6 rounded-xl shadow-md card-hover-lift h-full">
                    <div className="w-14 h-14 rounded-xl bg-gse-green/10 flex items-center justify-center mb-4">
                      <feature.icon size={28} className="text-gse-green" />
                    </div>
                    <h3 className="text-lg font-bold text-gse-charcoal mb-2">{feature.title}</h3>
                    <p className="text-gse-gray text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Hostel Gallery
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Hostel Exterior', sub: 'Building view' },
                { label: 'Study Hall', sub: 'Evening study time' },
                { label: 'Common Room', sub: 'Recreation area' },
              ].map((item, i) => (
                <ScrollReveal key={item.label} direction="up" delay={i * 150}>
                  <div className="relative image-hover-zoom rounded-xl overflow-hidden shadow-lg h-64">
                    <Image
                      src="/images/hostel.png"
                      alt={`${item.label} - Govt. HSS Excellence Hostel`}
                      fill
                      className="object-cover"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gse-green-dark/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-white font-bold">{item.label}</p>
                      <p className="text-gse-gold text-sm">{item.sub}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Rules & Regulations */}
        <section className="py-12 md:py-16 bg-gse-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Rules & Regulations
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  All hostel residents must adhere to the following rules for a safe and disciplined environment
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-3xl mx-auto">
                <ul className="space-y-4">
                  {rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        size={20}
                        className="text-gse-green shrink-0 mt-0.5"
                      />
                      <span className="text-gse-gray text-sm leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Wardens Info */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Hostel Wardens
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Experienced and caring wardens ensure the safety and well-being of all hostel residents
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {wardens.map((warden, i) => (
                <ScrollReveal key={warden.name} direction={i === 0 ? 'left' : 'right'} delay={100}>
                  <div className="bg-gse-offwhite rounded-xl shadow-md p-6 card-hover-lift border border-gse-border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gse-green flex items-center justify-center shrink-0">
                        <User size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gse-charcoal">{warden.name}</h3>
                        <p className="text-gse-green font-semibold text-sm">{warden.designation}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gse-gold" />
                        <span className="text-gse-gray text-sm">{warden.experience} experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gse-gold" />
                        <span className="text-gse-gray text-sm">{warden.phone}</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-gse-green to-gse-green-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal direction="scale">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Contact for Hostel Admission
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Interested in hostel facilities? Contact us to learn more about admission process,
                fees, and availability. We ensure a safe and supportive environment for your child.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gse-gold text-gse-charcoal font-bold rounded-lg hover:bg-gse-gold-light transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Contact Us <ArrowRight size={18} />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
