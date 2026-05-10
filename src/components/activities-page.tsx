'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Users,
  Target,
  Swords,
  Zap,
  CircleDot,
  Heart,
  Sparkles,
  Shield,
  ArrowRight,
  Medal,
  Star,
} from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';
import { getSchoolData } from '@/lib/school-data';

const data = getSchoolData();

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Swords,
  Zap,
  CircleDot,
  Heart,
  Sparkles,
  Shield,
  Users,
  Target,
};

export default function ActivitiesPageComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="activities" />

      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.images.sports}
            alt={`Sports & Activities - ${data.school.shortName}`}
            fill
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gse-green-dark/80 via-gse-green/70 to-gse-green-dark/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Sports & <span className="text-gse-gold">Activities</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Building champions on and off the field — excellence in sports is at the heart of our school
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Featured Activities */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Featured Sports
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Our school takes special pride in these three sports, with dedicated facilities,
                  coaching, and a track record of producing champions
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-16">
              {data.activities.featured.map((activity, i) => (
                <ScrollReveal
                  key={activity.id}
                  direction={i % 2 === 0 ? 'left' : 'right'}
                  delay={100}
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                      i % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                      <div className="relative image-hover-zoom rounded-2xl overflow-hidden shadow-xl h-[300px] md:h-[400px]">
                        <Image
                          src={activity.image}
                          alt={`${activity.title} at ${data.school.shortName}`}
                          fill
                          className="object-cover"
                          quality={75}
                        />
                        <div className="absolute top-4 left-4 px-4 py-2 bg-gse-gold rounded-full">
                          <span className="text-gse-charcoal font-bold text-sm flex items-center gap-2">
                            <Trophy size={16} />
                            {activity.title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                      <h3 className="text-2xl md:text-3xl font-bold text-gse-charcoal mb-4 flex items-center gap-3">
                        <Medal size={28} className="text-gse-gold" />
                        {activity.title}
                      </h3>
                      {activity.description.split('\n\n').map((para, j) => (
                        <p key={j} className="text-gse-gray leading-relaxed mb-4 text-sm md:text-base">
                          {para}
                        </p>
                      ))}
                      <div className="mt-4 space-y-2">
                        <h4 className="text-gse-green font-semibold text-sm flex items-center gap-2 mb-2">
                          <Star size={16} className="text-gse-gold" />
                          Facilities
                        </h4>
                        <p className="text-gse-gray text-sm">{activity.facilities}</p>
                        <h4 className="text-gse-green font-semibold text-sm flex items-center gap-2 mb-2 mt-3">
                          <Star size={16} className="text-gse-gold" />
                          Coaching
                        </h4>
                        <p className="text-gse-gray text-sm">{activity.coaching}</p>
                        <h4 className="text-gse-green font-semibold text-sm flex items-center gap-2 mb-2 mt-3">
                          <Star size={16} className="text-gse-gold" />
                          Key Achievements
                        </h4>
                        {activity.achievements.split(', ').map((ach) => (
                          <div key={ach} className="flex items-start gap-2">
                            <Award size={14} className="text-gse-gold shrink-0 mt-1" />
                            <span className="text-gse-gray text-sm">{ach}</span>
                          </div>
                        ))}
                        <h4 className="text-gse-green font-semibold text-sm flex items-center gap-2 mb-2 mt-3">
                          <Star size={16} className="text-gse-gold" />
                          Schedule
                        </h4>
                        <p className="text-gse-gray text-sm">{activity.schedule}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Activities */}
        <section className="py-12 md:py-16 bg-gse-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  More Activities
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Beyond our featured sports, students can explore a wide range of activities
                  for physical fitness and character building
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.activities.other.map((act, i) => {
                const IconComponent = iconMap[act.icon] || Users;
                return (
                  <ScrollReveal key={act.id} direction="up" delay={i * 100}>
                    <div className="bg-white p-6 rounded-xl shadow-md card-hover-lift h-full flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gse-green/10 flex items-center justify-center shrink-0">
                        <IconComponent size={24} className="text-gse-green" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gse-charcoal mb-1">{act.title}</h3>
                        <p className="text-gse-gray text-sm leading-relaxed">{act.description}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-12 md:py-16 bg-gse-green relative overflow-hidden">
          <div className="absolute inset-0 pattern-overlay" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Notable <span className="text-gse-gold">Achievements</span>
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Our students continue to make us proud with outstanding performances in sports
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {data.activities.achievements.map((ach, i) => (
                <ScrollReveal key={ach} direction="up" delay={i * 80}>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 flex items-start gap-3">
                    <Trophy size={20} className="text-gse-gold shrink-0 mt-0.5" />
                    <p className="text-white text-sm leading-relaxed">{ach}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal direction="scale">
              <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-4">
                Interested in Sports?
              </h2>
              <p className="text-gse-gray mb-8 max-w-2xl mx-auto">
                Join {data.school.shortName} and get access to professional coaching,
                modern facilities, and opportunities to compete at the highest level.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gse-green text-white font-bold rounded-lg hover:bg-gse-green-light transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Enquire Now <ArrowRight size={18} />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
