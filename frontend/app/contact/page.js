"use client";

import { MapPin, Mail, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! This is a visual demo, so no email was actually sent.");
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#8b9a6e]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-[#eae2d6]/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
        
        {/* Contact Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-poppins font-extrabold text-[#333333] sm:text-5xl mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Have questions about SmartCareer? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8b9a6e] border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Office</h3>
                <p className="text-gray-600">123 Innovation Drive, Tech City, TC 90210</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8b9a6e] border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Email</h3>
                <p className="text-gray-600">support@smartcareer.demo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#8b9a6e] border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl border border-white/60">
          <h2 className="text-2xl font-semibold text-[#333333] mb-6 font-poppins">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Full Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8b9a6e] focus:border-transparent transition-all outline-none bg-white/80 placeholder-gray-400 text-[#333333]"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8b9a6e] focus:border-transparent transition-all outline-none bg-white/80 placeholder-gray-400 text-[#333333]"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8b9a6e] focus:border-transparent transition-all outline-none bg-white/80 placeholder-gray-400 text-[#333333]"
                placeholder="How can we help?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5 pl-1">Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8b9a6e] focus:border-transparent transition-all outline-none bg-white/80 resize-none placeholder-gray-400 text-[#333333]"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full py-4 px-4 bg-[#8b9a6e] hover:bg-[#7b8a5e] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#8b9a6e]/30 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Send Message
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
