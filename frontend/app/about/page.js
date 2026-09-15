export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-poppins font-extrabold text-gray-900 sm:text-5xl">
            About Smart<span className="text-primary">Career</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Revolutionizing the way students and companies connect through AI-driven insights.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 sm:p-12">
          <div className="space-y-12">
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">🎯</span>
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                At SmartCareer, we believe that finding the right job should be based on merit, skills, and true potential—not just keywords on a resume. Our mission is to bridge the gap between talented students and top-tier companies by leveraging advanced artificial intelligence to ensure the perfect match.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">✨</span>
                What We Do
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">AI Resume Matching</h3>
                  <p className="text-gray-600">We analyze your resume against job descriptions to provide a tailored match score and actionable feedback on how to improve your chances.</p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Smart Auto-Scheduling</h3>
                  <p className="text-gray-600">No more email back-and-forths. Our platform automatically slots interviews for shortlisted candidates seamlessly.</p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">AI Mock Interviews</h3>
                  <p className="text-gray-600">Practice makes perfect. Chat with our AI copilot tailored to the specific job you're applying for, ensuring you're ready for the real thing.</p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Alumni Insights</h3>
                  <p className="text-gray-600">Learn from those who came before you. Access real interview experiences and feedback shared by alumni who successfully secured offers.</p>
                </div>
              </div>
            </section>

            <section className="text-center bg-gray-900 rounded-2xl p-8 shadow-inner mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Ready to accelerate your career?</h2>
              <p className="text-gray-300 mb-6">Join thousands of students who have already found their dream jobs.</p>
              <a href="/signup" className="inline-block px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/30">
                Get Started Today
              </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
