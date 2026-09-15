"use client";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! This is a visual demo, so no email was actually sent.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-poppins font-extrabold text-gray-900 sm:text-5xl mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Have questions about SmartCareer? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary text-xl border border-gray-100">
                📍
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Office</h3>
                <p className="text-gray-600">123 Innovation Drive, Tech City, TC 90210</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary text-xl border border-gray-100">
                ✉️
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">support@smartcareer.demo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary text-xl border border-gray-100">
                📞
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white/50"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white/50"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white/50"
                placeholder="How can we help?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white/50 resize-none"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
