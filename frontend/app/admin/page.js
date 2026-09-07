"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requiredCgpa: 7.0,
    requiredSkills: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    
    setUser(parsedUser);
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    fetch("http://localhost:5000/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          requiredSkills: formData.requiredSkills.split(",").map(s => s.trim())
        }),
      });

      if (res.ok) {
        setFormData({ title: "", company: "", description: "", requiredCgpa: 7.0, requiredSkills: "" });
        fetchJobs();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to post job");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Recruiter console for {user.name}</p>
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

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Post a Job Form */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-4">Post a New Job</h2>
          <form onSubmit={handlePostJob} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input 
                type="text" required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                required rows="3"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
                <input 
                  type="number" step="0.1" required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                  value={formData.requiredCgpa} onChange={e => setFormData({...formData, requiredCgpa: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
              <input 
                type="text" required placeholder="e.g. React, Node.js, MongoDB"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})}
              />
            </div>
            <button type="submit" className="mt-2 w-full py-2.5 rounded-lg bg-primary hover:bg-emerald-600 text-white font-medium transition-colors">
              Post Job
            </button>
          </form>
        </div>

        {/* Existing Jobs */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-4">Posted Jobs</h2>
          <div className="flex flex-col gap-4">
            {jobs.map(job => (
              <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-primary font-medium mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                    Min CGPA: {job.requiredCgpa}
                  </span>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500 italic">No jobs posted yet.</p>}
          </div>
        </div>

      </main>
    </div>
  );
}
