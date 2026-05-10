'use client';

import Image from 'next/image';
import { User, Award, BookOpen, Clock, Star, Crown } from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';

const teachers = [
  {
    name: 'Shri R.K. Sharma',
    designation: 'Principal',
    qualification: 'M.Ed., M.Phil.',
    subject: 'Administration',
    experience: 28,
    isPrincipal: true,
  },
  {
    name: 'Smt. Savita Joshi',
    designation: 'Vice Principal',
    qualification: 'M.A., B.Ed.',
    subject: 'Hindi',
    experience: 24,
    isVicePrincipal: true,
  },
  {
    name: 'Shri Anil Kumar Tiwari',
    designation: 'Head of Science Dept',
    qualification: 'M.Sc., B.Ed.',
    subject: 'Physics',
    experience: 20,
  },
  {
    name: 'Shri Manoj Kumar Dubey',
    designation: 'Head of Math Dept',
    qualification: 'M.Sc., B.Ed.',
    subject: 'Mathematics',
    experience: 18,
  },
  {
    name: 'Smt. Kavita Sharma',
    designation: 'Head of Hindi Dept',
    qualification: 'M.A., B.Ed.',
    subject: 'Hindi Literature',
    experience: 22,
  },
  {
    name: 'Shri David Masih',
    designation: 'Head of English Dept',
    qualification: 'M.A. (English), B.Ed.',
    subject: 'English',
    experience: 19,
  },
  {
    name: 'Shri Raghunath Singh',
    designation: 'Head of Social Science Dept',
    qualification: 'M.A. (History), B.Ed.',
    subject: 'Social Science',
    experience: 21,
  },
  {
    name: 'Shri Vijendra Singh Rajput',
    designation: 'Head of Physical Education',
    qualification: 'M.P.Ed.',
    subject: 'Physical Education',
    experience: 15,
  },
  {
    name: 'Shri Santosh Kumar Patel',
    designation: 'Head of Computer Science',
    qualification: 'M.C.A., B.Ed.',
    subject: 'Computer Science',
    experience: 12,
  },
  {
    name: 'Smt. Meena Bhargava',
    designation: 'Librarian',
    qualification: 'B.Lib., M.A.',
    subject: 'Library Science',
    experience: 16,
  },
];

function getInitials(name: string) {
  return name
    .replace(/^(Shri|Smt|Dr|Prof)\.?\s*/i, '')
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .substring(0, 2);
}

export default function TeachersPageComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="teachers" />

      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/teachers-group.png"
            alt="Our Faculty - Govt. HSS Excellence"
            fill
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gse-green-dark/80 via-gse-green/70 to-gse-green-dark/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our <span className="text-gse-gold">Faculty</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Dedicated educators shaping the future of our students with knowledge, wisdom, and commitment
          </p>
        </div>
      </section>

      <main className="flex-1 bg-gse-offwhite">
        {/* Intro Text */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gse-charcoal mb-2 gold-accent-line-center">
                  Meet Our Educators
                </h2>
                <div className="h-1 w-16 bg-gse-gold mb-4 rounded-full mx-auto" />
                <p className="text-gse-gray max-w-2xl mx-auto">
                  Our faculty comprises experienced and qualified educators who are passionate about
                  teaching and committed to the all-round development of every student.
                </p>
              </div>
            </ScrollReveal>

            {/* Principal Card - Special */}
            <ScrollReveal direction="up" delay={100}>
              <div className="mb-12">
                {teachers
                  .filter((t) => t.isPrincipal)
                  .map((teacher) => (
                    <div
                      key={teacher.name}
                      className="bg-gradient-to-r from-gse-green to-gse-green-dark rounded-2xl overflow-hidden shadow-xl"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="flex items-center justify-center p-8 md:p-12">
                          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-gse-gold/20 border-4 border-gse-gold flex items-center justify-center">
                            <span className="text-4xl md:text-5xl font-bold text-gse-gold">
                              {getInitials(teacher.name)}
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-2 p-6 md:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown size={20} className="text-gse-gold" />
                            <span className="text-gse-gold font-semibold text-sm uppercase tracking-wider">
                              Principal
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            {teacher.name}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} className="text-gse-gold" />
                              <span className="text-gray-300 text-sm">{teacher.qualification}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award size={16} className="text-gse-gold" />
                              <span className="text-gray-300 text-sm">{teacher.subject}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gse-gold" />
                              <span className="text-gray-300 text-sm">{teacher.experience} years experience</span>
                            </div>
                          </div>
                          <p className="text-gray-300 mt-4 text-sm leading-relaxed">
                            A visionary leader with over {teacher.experience} years in education, dedicated to
                            transforming Govt. HSS Excellence into a model institution of learning and character
                            development under the Department of School Education, M.P.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollReveal>

            {/* Vice Principal Card */}
            <ScrollReveal direction="up" delay={150}>
              <div className="mb-12">
                {teachers
                  .filter((t) => t.isVicePrincipal)
                  .map((teacher) => (
                    <div
                      key={teacher.name}
                      className="bg-gradient-to-r from-gse-green-light to-gse-green rounded-2xl overflow-hidden shadow-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="flex items-center justify-center p-6 md:p-10">
                          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gse-gold/20 border-4 border-gse-gold flex items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold text-gse-gold">
                              {getInitials(teacher.name)}
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <Star size={18} className="text-gse-gold" />
                            <span className="text-gse-gold font-semibold text-sm uppercase tracking-wider">
                              Vice Principal
                            </span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                            {teacher.name}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <BookOpen size={16} className="text-gse-gold" />
                              <span className="text-gray-200 text-sm">{teacher.qualification}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award size={16} className="text-gse-gold" />
                              <span className="text-gray-200 text-sm">{teacher.subject}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gse-gold" />
                              <span className="text-gray-200 text-sm">{teacher.experience} years experience</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollReveal>

            {/* Other Teachers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachers
                .filter((t) => !t.isPrincipal && !t.isVicePrincipal)
                .map((teacher, i) => (
                  <ScrollReveal key={teacher.name} direction="up" delay={i * 100}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover-lift h-full">
                      <div className="bg-gse-green/5 p-6 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gse-green flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {getInitials(teacher.name)}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gse-charcoal mb-1">{teacher.name}</h3>
                        <p className="text-gse-green font-semibold text-sm mb-3">
                          {teacher.designation}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-gse-gold shrink-0" />
                            <span className="text-gse-gray text-xs">{teacher.qualification}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award size={14} className="text-gse-gold shrink-0" />
                            <span className="text-gse-gray text-xs">{teacher.subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gse-gold shrink-0" />
                            <span className="text-gse-gray text-xs">{teacher.experience} years experience</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
