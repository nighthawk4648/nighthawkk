"use client";

import ContactForm from "./ContactForm";

const WHATSAPP_NUMBER = "+880 1956274648";
const phoneFormatted = WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
const WHATSAPP_URL = `https://wa.me/${phoneFormatted}`;

const ContactUs = () => {
  return (
    <section className="relative w-full bg-[#121212] text-white py-14 sm:py-20 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Info & Fast Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full mb-3">
                Customer Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Get in Touch
              </h2>
              <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
                Have questions about our SketchUp 3D models, extension, or need
                a custom asset created? Send us a message or reach out on
                WhatsApp.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-3.5 pt-2">
              {/* WhatsApp Direct Action Card */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                      Chat on WhatsApp
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {WHATSAPP_NUMBER}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-neutral-400 group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  Chat Now
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </a>

              {/* Response Time Guarantee Pill */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                  <svg
                    className="w-5 h-5 text-neutral-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-neutral-200">
                    Prompt Response
                  </h4>
                  <p className="text-xs text-neutral-400">
                    We typically reply within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#18181b] border border-neutral-800/90 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Fill in your details and our team will get back to you
                  shortly.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
