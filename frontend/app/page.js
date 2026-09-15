import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Decorative background shapes for glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-secondary/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-accent/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>

      {/* Hero Section */}
      <main className="relative pt-32 pb-16 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center flex-1">
        <div className="text-center max-w-3xl mb-12">
          <h1 className="font-poppins text-5xl md:text-7xl font-bold leading-tight tracking-tight text-slate-900 mb-6">
            Get Hired with <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-highlight">AI Resume Ranking</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-sans">
            Upload your resume, see your skill match score, and practice with hyper-personalized AI mock interviews based on real company data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-xl bg-slate-900 text-white font-semibold shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Browse Jobs
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <button className="glass-card px-8 py-4 rounded-xl font-semibold text-slate-800 hover:bg-white/40 transition-colors">
              Try AI Copilot
            </button>
          </div>
        </div>

        {/* Devpost-style grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="glass-card p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h3 className="font-poppins text-xl font-bold mb-3">AI Skill Match</h3>
            <p className="text-slate-600 font-sans">Instantly see how well your resume matches the job description using advanced NLP cosine similarity.</p>
          </div>
          
          <div className="glass-card p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3 className="font-poppins text-xl font-bold mb-3">Mock Interviews</h3>
            <p className="text-slate-600 font-sans">Practice with tailored questions based on your specific skill gaps and the company's past interview history.</p>
          </div>

          <div className="glass-card p-8 flex flex-col items-start group hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
            </div>
            <h3 className="font-poppins text-xl font-bold mb-3">Placement Analytics</h3>
            <p className="text-slate-600 font-sans">View detailed historical data and predictive placement probability for every visiting company.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
