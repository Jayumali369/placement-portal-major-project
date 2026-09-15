"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlumniExperience() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [questions, setQuestions] = useState("");
  const [advice, setAdvice] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      router.push("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    fetchFeedbacks(token);
  }, []);

  const fetchFeedbacks = async (token) => {
    try {
      const res = await fetch("http://localhost:5001/api/feedback", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Split questions by newline or comma
    const interviewQuestions = questions.split('\\n').filter(q => q.trim() !== "");

    try {
      const res = await fetch("http://localhost:5001/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          company,
          jobTitle,
          interviewQuestions,
          advice,
          rating: Number(rating)
        })
      });

      if (res.ok) {
        alert("Feedback submitted successfully!");
        setShowForm(false);
        setCompany("");
        setJobTitle("");
        setQuestions("");
        setAdvice("");
        setRating(5);
        fetchFeedbacks(token);
      } else {
        const errorData = await res.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Alumni Experience Hub</h1>
          <p className="text-gray-600">Learn from seniors who cracked top companies</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Back to Dashboard
          </button>
          {(user.isPlaced || user.role === 'admin') && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              {showForm ? "Cancel" : "Share Experience"}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold mb-4">Share Your Interview Experience</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input required type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full p-2 border rounded-md" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Questions Asked (One per line)</label>
                <textarea required value={questions} onChange={e => setQuestions(e.target.value)} className="w-full p-2 border rounded-md h-24" placeholder="What is the difference between var, let, and const?\nExplain the virtual DOM." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Advice for Juniors</label>
                <textarea required value={advice} onChange={e => setAdvice(e.target.value)} className="w-full p-2 border rounded-md h-24" placeholder="Focus heavily on DSA strings and arrays..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} className="w-full p-2 border rounded-md" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800">
                  Submit Experience
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map(fb => (
            <div key={fb._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{fb.company}</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                  Difficulty: {fb.rating}/5
                </span>
              </div>
              <p className="text-primary font-medium text-sm mb-4">{fb.jobTitle}</p>
              
              <div className="flex-grow mb-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Questions Asked:</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {fb.interviewQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t pt-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Advice:</h4>
                <p className="text-sm text-gray-600 italic">"{fb.advice}"</p>
                <p className="text-xs text-gray-400 mt-3">Shared by {fb.user?.name || 'Anonymous'}</p>
              </div>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <p className="text-gray-500 italic col-span-3">No interview experiences shared yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
