"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:5001/api/analytics", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-800">Placement Analytics</h1>
          <p className="text-gray-600">Overview of placement performance</p>
        </div>
        <button 
          onClick={() => router.push("/admin")}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Back to Admin
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Students</h3>
          <p className="text-4xl font-bold text-gray-900">{data.totalStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Placed Students</h3>
          <p className="text-4xl font-bold text-green-600">{data.placedStudents}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold mb-2">Placement Rate</h3>
          <p className="text-4xl font-bold text-indigo-600">{data.placementRate.toFixed(1)}%</p>
        </div>
        
        {/* Top Companies Chart Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-4">
          <h3 className="text-gray-800 text-lg font-semibold mb-4">Top Hiring Companies</h3>
          <div className="flex flex-col gap-4">
            {data.topCompanies.map((tc, i) => (
              <div key={i} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 truncate">{tc.company}</div>
                <div className="flex-1 ml-4 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-primary h-4 rounded-full" 
                    style={{ width: `${(tc.count / Math.max(...data.topCompanies.map(c => c.count))) * 100}%` }}
                  ></div>
                </div>
                <div className="ml-4 text-sm font-bold text-gray-900 w-8">{tc.count}</div>
              </div>
            ))}
            {data.topCompanies.length === 0 && <p className="text-sm text-gray-500 italic">No job postings yet.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
