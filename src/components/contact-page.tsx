'use client';

import { useState, useCallback } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import Navigation from '@/components/shared/navigation';
import Footer from '@/components/shared/footer';
import ScrollReveal from '@/components/shared/scroll-reveal';
import { getSchoolData } from '@/lib/school-data';

const data = getSchoolData();

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  return { num1, num2, answer: num1 + num2 };
}

export default function ContactPageComponent() {
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    captchaAnswer: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setFormData((prev) => ({ ...prev, captchaAnswer: '' }));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone))
      newErrors.phone = 'Invalid phone number';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.captchaAnswer.trim()) newErrors.captchaAnswer = 'Please solve the captcha';
    else if (parseInt(formData.captchaAnswer) !== captcha.answer)
      newErrors.captchaAnswer = 'Incorrect answer, please try again';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        captchaAnswer: '',
      });
      refreshCaptcha();
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="contact" />

      {/* Hero Banner */}
      <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gse-green-dark via-gse-green to-gse-green-dark" />
        <div className="absolute inset-0 pattern-overlay" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact <span className="text-gse-gold">Us</span>
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            We&apos;d love to hear from you. Get in touch with us for admissions, queries, or feedback.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gse-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <ScrollReveal direction="left" className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gse-charcoal mb-2 gold-accent-line">
                    Send Us a Message
                  </h2>
                  <div className="h-1 w-16 bg-gse-gold mb-6 rounded-full" />

                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle2 size={64} className="text-gse-green mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gse-charcoal mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gse-gray mb-6">
                        Thank you for reaching out. We will get back to you shortly.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2 bg-gse-green text-white rounded-lg hover:bg-gse-green-light transition-colors font-medium"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gse-charcoal mb-1.5">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gse-gray" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gse-green/30 focus:border-gse-green ${
                                errors.name ? 'border-red-400' : 'border-gse-border'
                              }`}
                            />
                          </div>
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gse-charcoal mb-1.5">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gse-gray" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your.email@example.com"
                              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gse-green/30 focus:border-gse-green ${
                                errors.email ? 'border-red-400' : 'border-gse-border'
                              }`}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gse-charcoal mb-1.5">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gse-gray" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+91 XXXXX XXXXX"
                              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gse-green/30 focus:border-gse-green ${
                                errors.phone ? 'border-red-400' : 'border-gse-border'
                              }`}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Subject */}
                        <div>
                          <label className="block text-sm font-medium text-gse-charcoal mb-1.5">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MessageSquare size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gse-gray" />
                            <input
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="What is this about?"
                              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gse-green/30 focus:border-gse-green ${
                                errors.subject ? 'border-red-400' : 'border-gse-border'
                              }`}
                            />
                          </div>
                          {errors.subject && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} /> {errors.subject}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gse-charcoal mb-1.5">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Write your message here..."
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gse-green/30 focus:border-gse-green resize-none ${
                            errors.message ? 'border-red-400' : 'border-gse-border'
                          }`}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Math Captcha */}
                      <div className="bg-gse-cream rounded-lg p-4">
                        <label className="block text-sm font-medium text-gse-charcoal mb-2">
                          Security Check <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-white px-4 py-2 rounded-lg border border-gse-border font-mono text-lg font-bold text-gse-green">
                            {captcha.num1} + {captcha.num2} = ?
                          </div>
                          <button
                            type="button"
                            onClick={refreshCaptcha}
                            className="p-2 text-gse-gray hover:text-gse-green transition-colors"
                            title="Refresh captcha"
                          >
                            <RefreshCw size={18} />
                          </button>
                        </div>
                        <input
                          type="number"
                          name="captchaAnswer"
                          value={formData.captchaAnswer}
                          onChange={handleChange}
                          placeholder="Enter your answer"
                          className={`w-full max-w-xs px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gse-green/30 focus:border-gse-green ${
                            errors.captchaAnswer ? 'border-red-400' : 'border-gse-border'
                          }`}
                        />
                        {errors.captchaAnswer && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.captchaAnswer}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto px-8 py-3 bg-gse-green text-white font-semibold rounded-lg hover:bg-gse-green-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>

              {/* Contact Info Sidebar */}
              <ScrollReveal direction="right">
                <div className="space-y-6">
                  {/* Contact Details */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gse-charcoal mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-gse-green" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-gse-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gse-charcoal">Address</p>
                          <p className="text-gse-gray text-sm">
                            {data.school.fullName},<br />
                            {data.school.address.area}, {data.school.address.city},<br />
                            {data.school.address.state} - {data.school.address.pincode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone size={18} className="text-gse-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gse-charcoal">Phone</p>
                          <p className="text-gse-gray text-sm">{data.school.contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={18} className="text-gse-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gse-charcoal">Email</p>
                          <p className="text-gse-gray text-sm">{data.school.contact.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock size={18} className="text-gse-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gse-charcoal">Office Hours</p>
                          <p className="text-gse-gray text-sm">{data.school.contact.officeHours}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gse-charcoal mb-4">Find Us</h3>
                    <div className="w-full h-48 bg-gse-green/10 rounded-lg border border-gse-border flex items-center justify-center">
                      <div className="text-center">
                        <MapPin size={36} className="text-gse-green mx-auto mb-2" />
                        <p className="text-gse-charcoal text-sm font-medium">
                          {data.school.address.area}
                        </p>
                        <p className="text-gse-gray text-xs">{data.school.address.city}, {data.school.address.state} {data.school.address.pincode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-gradient-to-br from-gse-green to-gse-green-dark rounded-xl p-6 text-white">
                    <h3 className="text-lg font-bold text-gse-gold mb-3">Quick Info</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gse-gold font-medium">UDISE Code:</span>{' '}
                        {data.school.udiseCode}
                      </p>
                      <p>
                        <span className="text-gse-gold font-medium">Board:</span> {data.school.board}
                      </p>
                      <p>
                        <span className="text-gse-gold font-medium">Type:</span> {data.school.type}
                      </p>
                      <p>
                        <span className="text-gse-gold font-medium">Dept:</span> {data.school.department}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
