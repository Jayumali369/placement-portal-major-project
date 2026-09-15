"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [viewingJobId, setViewingJobId] = useState(null);
  
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
    fetch("http://localhost:5001/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5001/api/jobs", {
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

  const fetchApplications = async (jobId) => {
    if (viewingJobId === jobId) {
      setViewingJobId(null);
      return;
    }

    setViewingJobId(jobId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/applications/job/${jobId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(prev => ({ ...prev, [jobId]: data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSchedule = async (jobId, date, time) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5001/api/interviews/schedule/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ startDate: date, startTime: time })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Refresh applications to see status change
        fetchApplications(jobId);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error scheduling interviews");
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
        <div className="flex gap-4">
          <button 
            onClick={() => router.push("/admin/analytics")}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            📊 View Analytics
          </button>
          <button 
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Post a Job Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
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
            <button type="submit" className="mt-2 w-full py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors">
              Post Job
            </button>
          </form>
        </div>

        {/* Existing Jobs & Applications */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-4">Posted Jobs & Applicants</h2>
          <div className="flex flex-col gap-4">
            {jobs.map(job => (
              <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-primary font-medium mb-2">{job.company}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requiredSkills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold mb-2">
                      Min CGPA: {job.requiredCgpa}
                    </span>
                    <br/>
                    <button 
                      onClick={() => fetchApplications(job._id)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {viewingJobId === job._id ? "Hide Applications" : "View Applications"}
                    </button>
                  </div>
                </div>

                {/* Applications Section */}
                {viewingJobId === job._id && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-bold text-gray-700">Ranked Applications</h4>
                      <div className="flex gap-2 text-sm items-center">
                        <input type="date" id={`date-${job._id}`} className="border px-2 py-1 rounded" defaultValue={new Date().toISOString().split('T')[0]}/>
                        <input type="time" id={`time-${job._id}`} className="border px-2 py-1 rounded" defaultValue="09:00"/>
                        <button 
                          onClick={() => {
                            const date = document.getElementById(`date-${job._id}`).value;
                            const time = document.getElementById(`time-${job._id}`).value;
                            handleSchedule(job._id, date, time);
                          }}
                          className="px-3 py-1 bg-primary text-white rounded font-medium hover:bg-primary/90"
                        >
                          Auto-Schedule
                        </button>
                      </div>
                    </div>
                    {applications[job._id]?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                              <th className="px-4 py-2">Candidate</th>
                              <th className="px-4 py-2">Email</th>
                              <th className="px-4 py-2">CGPA</th>
                              <th className="px-4 py-2 text-center">AI Match Score</th>
                              <th className="px-4 py-2">Status</th>
                              <th className="px-4 py-2">Resume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {applications[job._id].map(app => (
                              <tr key={app._id} className="border-b">
                                <td className="px-4 py-2 font-medium text-gray-900">{app.user?.name}</td>
                                <td className="px-4 py-2">{app.user?.email}</td>
                                <td className="px-4 py-2">{app.user?.cgpa}</td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    app.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                                    app.matchScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {app.matchScore ? `${app.matchScore}%` : 'N/A'}
                                  </span>
                                </td>
                                <td className="px-4 py-2 font-semibold">
                                  {app.status}
                                </td>
                                <td className="px-4 py-2">
                                  {app.user?.resumeUrl ? (
                                    <a href={`http://localhost:5001${app.user.resumeUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                      View PDF
                                    </a>
                                  ) : (
                                    'No resume'
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No applications received yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-500 italic">No jobs posted yet.</p>}
          </div>
        </div>

      </main>
    </div>
  );
}
