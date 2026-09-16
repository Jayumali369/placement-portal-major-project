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
    checkAndUploadPendingResume(token, parsedUser);
  }, []);

  const fetchData = async (token) => {
    try {
      // Fetch available jobs (Smart Feed)
      const jobsRes = await fetch("http://localhost:5001/api/jobs/smart-feed", {
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

  const checkAndUploadPendingResume = async (token, currentUser) => {
    const pendingData = sessionStorage.getItem("pendingResumeData");
    const pendingName = sessionStorage.getItem("pendingResumeName");
    
    if (pendingData && pendingName) {
      setUploadStatus("Processing uploaded resume...");
      // Remove from session storage immediately to prevent duplicate uploads
      sessionStorage.removeItem("pendingResumeData");
      sessionStorage.removeItem("pendingResumeName");
      
      try {
        // Convert Data URL back to a File object
        const res = await fetch(pendingData);
        const blob = await res.blob();
        const file = new File([blob], pendingName, { type: blob.type });
        
        const formData = new FormData();
        formData.append("resume", file);
        
        const uploadRes = await fetch("http://localhost:5001/api/upload/resume", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await uploadRes.json();
        if (uploadRes.ok) {
          setUploadStatus("Resume auto-uploaded successfully!");
          const updatedUser = { ...currentUser, resumeUrl: data.filePath };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          setUploadStatus(data.message || "Failed to auto-upload resume");
        }
      } catch (err) {
        console.error("Error auto-uploading:", err);
        setUploadStatus("Error auto-uploading resume.");
      }
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
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8">
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Profile & Resume */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">My Profile</h2>
            <div className="mb-6 text-sm text-gray-600 space-y-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">Email</span>
                <span className="text-gray-900">{user.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-500">CGPA</span>
                <span className="text-gray-900 font-medium">{user.cgpa || 'N/A'}</span>
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Resume</h3>
              {user.resumeUrl ? (
                <div className="mb-5 bg-green-50/50 border border-green-100 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Resume Uploaded
                  </div>
                  <a href={`http://localhost:5001${user.resumeUrl}`} target="_blank" rel="noreferrer" className="block text-xs text-primary hover:underline">
                    View Current Document
                  </a>
                </div>
              ) : (
                <div className="mb-5 bg-orange-50/50 border border-orange-100 p-3 rounded-xl">
                  <p className="text-xs text-orange-700">No resume uploaded. Required for applications.</p>
                </div>
              )}
              
              <form onSubmit={handleUploadResume} className="flex flex-col gap-3">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors w-full cursor-pointer"
                />
                <button 
                  type="submit" 
                  disabled={!resumeFile}
                  className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
                >
                  Upload Resume
                </button>
                {uploadStatus && <p className="text-xs mt-1 text-center font-medium text-gray-600">{uploadStatus}</p>}
              </form>
            </div>
          </div>

          {/* My Applications Widget */}
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center justify-between">
              My Applications
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-600">{myApplications.length}</span>
            </h2>
            {myApplications.length > 0 ? (
              <ul className="space-y-4">
                {myApplications.map(app => (
                  <li key={app._id} className="text-sm p-4 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="font-semibold text-gray-900">{app.job?.title || 'Unknown Job'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 text-xs font-medium">{app.job?.company}</span>
                      {app.matchScore !== null && (
                        <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold shadow-sm">
                          {app.matchScore}% Match
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-xl">
                  📁
                </div>
                <p className="text-sm text-gray-500">You haven't applied to any jobs yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Jobs List */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-poppins font-bold text-gray-900">Recommended Jobs</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => {
              const hasApplied = appliedJobIds.has(job._id);
              const isApplying = applyingJobId === job._id;

              return (
                <div key={job._id} className="group bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-md hover:shadow-xl border border-white/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                      <p className="text-gray-600 font-medium text-sm">{job.company}</p>
                    </div>
                    {job.matchScore !== undefined && (
                      <div className="flex flex-col items-end">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md">
                          {job.matchScore}% Match
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-gray-100/80 text-gray-700 rounded-lg text-xs font-medium border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mt-auto">
                    {hasApplied ? (
                      <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed border border-gray-200">
                        Already Applied
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(job._id)}
                        disabled={isApplying}
                        className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                      >
                        {isApplying ? "Submitting Application..." : "Apply for this role"}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => router.push(`/dashboard/mock-interview/${job._id}`)}
                      className="w-full py-3 rounded-xl bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 text-primary font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                      Practice Mock Interview
                    </button>
                  </div>
                </div>
              );
            })}
            
            {jobs.length === 0 && (
              <div className="col-span-2 py-12 text-center bg-white/50 backdrop-blur-md rounded-3xl border border-white/50">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                  🔍
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs available right now</h3>
                <p className="text-gray-500">Check back later for new opportunities matching your profile.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
