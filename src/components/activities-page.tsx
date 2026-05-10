'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Users,
  Target,
  Dumbbell,
  Footprints,
  Volleyball,
  Sparkles,
  Shield,
  Heart,
  ArrowRight,
  Medal,
  Star,
} from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';

const featuredActivities = [
  {
    title: 'Badminton',
    image: '/images/badminton.png',
    desc: 'Our school boasts state-of-the-art indoor badminton courts that have produced numerous district and divisional level champions. Under the expert guidance of our dedicated badminton coach, students receive systematic training in footwork, strokes, game strategy, and physical conditioning.\n\nThe badminton program at Govt. HSS Excellence is one of the finest among government schools in Bhopal. Our students regularly participate in inter-school, district, and state-level tournaments organized by the School Education Department and MP Sports Authority.\n\nMany of our alumni have gone on to represent at state and national levels, a testament to the quality of coaching and the passion our students bring to the sport.',
    achievements: [
      'District Level Badminton Championship Winners 2024',
      '5 students selected for State Level Tournament',
      'Inter-School Bhopal Division Runners-Up',
    ],
  },
  {
    title: 'Boxing',
    image: '/images/boxing.png',
    desc: 'The boxing program at Govt. HSS Excellence is renowned across Madhya Pradesh for producing skilled and disciplined boxers. Our dedicated boxing ring and training facility provide students with a professional environment to learn and practice the sport.\n\nUnder the watchful eye of our experienced boxing coach, who is a former state-level boxer himself, students undergo rigorous training in technique, stamina, and mental toughness. The boxing program emphasizes not just competitive excellence but also discipline, respect, and self-confidence.\n\nOur boxers have consistently brought laurels to the school at district, state, and even national level competitions. The program has become a cornerstone of our school\'s identity as a center for sporting excellence.',
    achievements: [
      'State Level Boxing Championship Gold Medal 2024',
      '3 students represented MP at National Level',
      'Best Boxing School Award - Bhopal Division',
    ],
  },
  {
    title: 'Cricket',
    image: '/images/cricket.png',
    desc: 'Cricket is more than just a sport at Govt. HSS Excellence — it is a passion that unites the entire school community. Our cricket ground with practice nets provides the perfect setting for aspiring cricketers to hone their skills in batting, bowling, and fielding.\n\nOur cricket coaching program focuses on developing all-round skills with equal emphasis on technique, fitness, and game awareness. Regular inter-house and inter-school matches provide competitive exposure and help students develop teamwork and sportsmanship.\n\nThe school cricket team has been a consistent performer in inter-school tournaments across Bhopal and Madhya Pradesh. Several of our students have been selected for district and state age-group teams, and some have progressed to play at higher levels.',
    achievements: [
      'Inter-School Cricket Tournament Winners - Bhopal 2024',
      '4 students in District Under-19 Team',
      'Quarter-Finalists at State Level Tournament',
    ],
  },
];

const additionalActivities = [
  { icon: Shield, name: 'Kabaddi', desc: 'Traditional sport with dedicated coaching and inter-school competitions' },
  { icon: Footprints, name: 'Athletics', desc: 'Track and field events with professional training and regular meet participation' },
  { icon: Volleyball, name: 'Volleyball', desc: 'Volleyball court with coaching and tournament opportunities' },
  { icon: Heart, name: 'Yoga', desc: 'Daily yoga sessions for physical and mental well-being of students' },
  { icon: Sparkles, name: 'NCC', desc: 'National Cadet Corps unit fostering discipline, leadership, and patriotism' },
  { icon: Users, name: 'NSS', desc: 'National Service Scheme unit engaging students in community service' },
];

const achievements = [
  'Overall Sports Champions - Bhopal Government Schools 2024',
  '15+ students represented at State Level in various sports',
  'State Gold Medal in Boxing (Youth Category)',
  'District Badminton Champions for 3 consecutive years',
  'Cricket Team reached State Quarter-Finals',
  'Best NCC Unit Award - Bhopal Group',
  'District Athletics Meet - 8 medals (3 Gold, 2 Silver, 3 Bronze)',
  'Kabaddi Team - District Runners-Up',
];

export default function ActivitiesPageComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="activities" />

      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sports.png"
            alt="Sports & Activities - Govt. HSS Excellence"
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
              {featuredActivities.map((activity, i) => (
                <ScrollReveal
                  key={activity.title}
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
                          alt={`${activity.title} at Govt. HSS Excellence`}
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
                      {activity.desc.split('\n\n').map((para, j) => (
                        <p key={j} className="text-gse-gray leading-relaxed mb-4 text-sm md:text-base">
                          {para}
                        </p>
                      ))}
                      <div className="mt-4 space-y-2">
                        <h4 className="text-gse-green font-semibold text-sm flex items-center gap-2">
                          <Star size={16} className="text-gse-gold" />
                          Key Achievements
                        </h4>
                        {activity.achievements.map((ach) => (
                          <div key={ach} className="flex items-start gap-2">
                            <Award size={14} className="text-gse-gold shrink-0 mt-1" />
                            <span className="text-gse-gray text-sm">{ach}</span>
                          </div>
                        ))}
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
              {additionalActivities.map((act, i) => (
                <ScrollReveal key={act.name} direction="up" delay={i * 100}>
                  <div className="bg-white p-6 rounded-xl shadow-md card-hover-lift h-full flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gse-green/10 flex items-center justify-center shrink-0">
                      <act.icon size={24} className="text-gse-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gse-charcoal mb-1">{act.name}</h3>
                      <p className="text-gse-gray text-sm leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
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
              {achievements.map((ach, i) => (
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
                Join Govt. HSS Excellence and get access to professional coaching,
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
