"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [myApplications, setMyApplications] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);

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
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      // Fetch available jobs
      const jobsRes = await fetch("http://localhost:5001/api/jobs", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const jobsData = await jobsRes.json();
      if (jobsRes.ok) setJobs(jobsData);

      // Fetch my applications
      const appsRes = await fetch("http://localhost:5001/api/applications/my", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const appsData = await appsRes.json();
      if (appsRes.ok) setMyApplications(appsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5001/api/upload/resume", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus("Resume uploaded successfully!");
        // Update user state to reflect uploaded resume
        const updatedUser = { ...user, resumeUrl: data.filePath };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setUploadStatus(data.message || "Failed to upload");
      }
    } catch (error) {
      setUploadStatus("Error uploading resume");
    }
  };

  const handleApply = async (jobId) => {
    if (!user.resumeUrl) {
      alert("Please upload your resume first!");
      return;
    }

    setApplyingJobId(jobId);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`http://localhost:5001/api/applications/${jobId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(`Application successful! Match Score: ${data.matchScore || 'N/A'}`);
        fetchData(token); // Refresh applications list
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      console.error(err);
      alert("Error applying for job");
    } finally {
      setApplyingJobId(null);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const appliedJobIds = new Set(myApplications.map(app => app.job?._id));

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

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Profile & Resume */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-semibold mb-4">My Profile</h2>
            <div className="mb-4 text-sm text-gray-600">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>CGPA:</strong> {user.cgpa || 'N/A'}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Resume</h3>
              {user.resumeUrl ? (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    ✓ Resume Uploaded
                  </span>
                  <a href={`http://localhost:5001${user.resumeUrl}`} target="_blank" rel="noreferrer" className="block mt-2 text-xs text-primary hover:underline">
                    View Current Resume
                  </a>
                </div>
              ) : (
                <p className="text-xs text-orange-600 mb-3">No resume uploaded. Required for applications.</p>
              )}
              
              <form onSubmit={handleUploadResume} className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700"
                />
                <button 
                  type="submit" 
                  disabled={!resumeFile}
                  className="w-full py-1.5 mt-2 rounded-md bg-gray-900 text-white text-sm disabled:opacity-50"
                >
                  Upload Resume
                </button>
                {uploadStatus && <p className="text-xs mt-1 text-gray-500">{uploadStatus}</p>}
              </form>
            </div>
          </div>

          {/* My Applications Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">My Applications</h2>
            {myApplications.length > 0 ? (
              <ul className="space-y-3">
                {myApplications.map(app => (
                  <li key={app._id} className="text-sm border-b pb-2 last:border-0">
                    <p className="font-medium text-gray-800">{app.job?.title || 'Unknown Job'}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-500 text-xs">{app.job?.company}</span>
                      {app.matchScore !== null && (
                        <span className="text-xs font-semibold text-primary">Score: {app.matchScore}%</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">You haven't applied to any jobs yet.</p>
            )}
          </div>
        </div>

        {/* Main Content: Jobs List */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-poppins font-semibold text-gray-800 mb-6">Available Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => {
              const hasApplied = appliedJobIds.has(job._id);
              const isApplying = applyingJobId === job._id;

              return (
                <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
                  
                  {hasApplied ? (
                    <button disabled className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-500 font-medium cursor-not-allowed">
                      Applied
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApply(job._id)}
                      disabled={isApplying}
                      className="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors disabled:opacity-70"
                    >
                      {isApplying ? "Applying..." : "Apply Now"}
                    </button>
                  )}
                </div>
              );
            })}
            {jobs.length === 0 && (
              <p className="text-gray-500 italic col-span-2">No jobs posted yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
