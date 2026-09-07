"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "student") {
      router.push("/admin");
      return;
    }
    
    setUser(parsedUser);

    fetch("http://localhost:5000/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        <button 
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-6">Available Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job._id} className="glass-card p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-primary font-medium mb-3">{job.company}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {job.requiredSkills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              
              <button className="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors">
                Apply Now
              </button>
            </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-gray-500 italic">No jobs posted yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
