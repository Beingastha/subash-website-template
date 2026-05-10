'use client';

import Image from 'next/image';
import { Quote, Target, Eye, BookOpen, Heart, Lightbulb, Star } from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';

export default function PrincipalPageComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="principal" />

      {/* Hero Banner */}
      <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gse-green-dark to-gse-green">
        <div className="absolute inset-0 pattern-overlay" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            From the <span className="text-gse-gold">Principal&apos;s</span> Desk
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            A message of inspiration and vision from the head of our institution
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Principal's Message */}
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              {/* Portrait */}
              <ScrollReveal direction="left" className="lg:col-span-2">
                <div className="sticky top-28">
                  <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src="/images/principal.png"
                        alt="Shri R.K. Sharma - Principal, Govt. HSS Excellence"
                        width={500}
                        height={600}
                        className="object-cover w-full h-[400px] md:h-[500px]"
                        quality={75}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gse-green-dark/90 to-transparent p-6">
                        <h3 className="text-2xl font-bold text-white">Shri R.K. Sharma</h3>
                        <p className="text-gse-gold font-semibold">Principal</p>
                        <p className="text-gray-300 text-sm mt-1">M.Ed., M.Phil.</p>
                      </div>
                    </div>
                    {/* Gold border accent */}
                    <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-gse-gold rounded-2xl -z-10" />
                  </div>
                </div>
              </ScrollReveal>

              {/* Message */}
              <ScrollReveal direction="right" className="lg:col-span-3">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Quote size={40} className="text-gse-gold" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gse-charcoal">
                        Principal&apos;s Message
                      </h2>
                      <div className="h-1 w-16 bg-gse-gold mt-2 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-4 text-gse-gray leading-relaxed">
                    <p>
                      Dear Students, Parents, and Well-wishers,
                    </p>
                    <p>
                      It is with great pride and a deep sense of responsibility that I welcome you to
                      Govt. Higher Secondary School for Excellence, Subhash Shivaji Nagar, Bhopal.
                      As a School for Excellence under the Department of School Education, Government
                      of Madhya Pradesh, our institution carries a special mandate — to provide
                      world-class education to students from all sections of society, regardless of
                      their economic or social background.
                    </p>
                    <p>
                      Education is the most powerful tool for transformation, and at Govt. HSS Excellence,
                      we believe that every child deserves the opportunity to discover and develop their
                      full potential. Our dedicated faculty works tirelessly to create an environment that
                      fosters academic rigor, critical thinking, and a love for learning. We do not merely
                      teach subjects; we nurture minds, build character, and prepare our students to become
                      responsible citizens and leaders of tomorrow.
                    </p>
                    <p>
                      Our school is uniquely positioned to offer a holistic educational experience. Beyond
                      academics, we take immense pride in our outstanding sports facilities — particularly
                      in badminton, boxing, and cricket — where our students have consistently brought
                      laurels at district and state levels. Our hostel facility ensures that students from
                      remote areas have access to quality education in a safe and disciplined environment.
                      The NCC and NSS units in our school instill values of service, discipline, and
                      patriotism in our young learners.
                    </p>
                    <p>
                      As a government school of excellence, we are committed to continuously raising the
                      bar of educational quality. We have embraced modern teaching methodologies, digital
                      learning tools, and project-based approaches to make learning more engaging and
                      effective. Our science laboratories, computer lab, and library are regularly updated
                      to meet the evolving needs of 21st century education.
                    </p>
                    <p>
                      I invite you to be a part of the Govt. HSS Excellence family — where dreams take
                      flight, where potential is transformed into achievement, and where every student is
                      empowered to excel. Together, we can build a brighter future for our children and
                      our nation.
                    </p>
                    <p className="font-semibold text-gse-charcoal mt-6">
                      With warm regards,<br />
                      Shri R.K. Sharma<br />
                      <span className="font-normal text-gse-gray text-sm">
                        Principal, Govt. HSS Excellence, Subhash Shivaji Nagar, Bhopal
                      </span>
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-12 md:py-16 bg-gse-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollReveal direction="left">
                <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-gse-green h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gse-green/10 flex items-center justify-center">
                      <Eye size={24} className="text-gse-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-gse-charcoal">Our Vision</h3>
                  </div>
                  <p className="text-gse-gray leading-relaxed">
                    To be a beacon of educational excellence in Madhya Pradesh, where every student
                    — regardless of background — receives world-class education, discovers their unique
                    potential, and is empowered to become a confident, compassionate, and responsible
                    citizen who contributes positively to society and the nation.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-gse-gold h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gse-gold/10 flex items-center justify-center">
                      <Target size={24} className="text-gse-gold-dark" />
                    </div>
                    <h3 className="text-2xl font-bold text-gse-charcoal">Our Mission</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Provide quality education aligned with MP Board standards and beyond',
                      'Foster holistic development through academics, sports, and co-curricular activities',
                      'Create an inclusive and nurturing environment for students from all backgrounds',
                      'Develop scientific temper, critical thinking, and moral values in students',
                      'Maintain state-of-the-art infrastructure and adopt modern teaching methodologies',
                      'Produce responsible citizens who contribute to nation-building',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Star size={16} className="text-gse-gold shrink-0 mt-1" />
                        <span className="text-gse-gray text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Quote Highlight */}
        <section className="py-16 md:py-20 bg-gse-green relative overflow-hidden">
          <div className="absolute inset-0 geometric-pattern" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal direction="scale">
              <Quote size={60} className="text-gse-gold/40 mx-auto mb-4" />
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed mb-6">
                &ldquo;Education is not the filling of a pail, but the{' '}
                <span className="text-gse-gold">lighting of a fire</span>.&rdquo;
              </blockquote>
              <p className="text-gray-300 text-lg">— Inspired by W.B. Yeats</p>
              <div className="mt-8 flex items-center justify-center gap-8">
                <div className="text-center">
                  <BookOpen size={24} className="text-gse-gold mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">Academics</p>
                </div>
                <div className="text-center">
                  <Heart size={24} className="text-gse-gold mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">Character</p>
                </div>
                <div className="text-center">
                  <Lightbulb size={24} className="text-gse-gold mx-auto mb-1" />
                  <p className="text-white text-sm font-medium">Innovation</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
