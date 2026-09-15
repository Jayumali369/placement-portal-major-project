"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] relative overflow-hidden flex flex-col items-center justify-center p-4 font-sans text-[#333333]">
      
      {/* Animated Background Blobs matching Home Page */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#8b9a6e]/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-[#eae2d6]/60 rounded-full blur-[100px] mix-blend-multiply opacity-70 z-0"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transform transition-all relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#333333] mb-2 tracking-tight font-poppins">
            {isAdminMode ? "Admin Portal" : "Welcome Back"}
          </h2>
          <p className="text-gray-600 text-sm">
            {isAdminMode ? "Sign in to manage the placement platform" : "Sign in to continue your journey"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm text-center animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 pl-1">Email Address</label>
            <input 
              type="email" 
              required
              id="email"
              className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-200 text-[#333333] placeholder-gray-400 focus:ring-2 focus:ring-[#8b9a6e] focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 pl-1">Password</label>
            <input 
              type="password" 
              required
              id="password"
              className="w-full px-5 py-3 rounded-xl bg-white/80 border border-gray-200 text-[#333333] placeholder-gray-400 focus:ring-2 focus:ring-[#8b9a6e] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`mt-2 w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
              isAdminMode 
                ? "bg-[#333333] hover:bg-[#1a1a1a] shadow-[#333333]/20" 
                : "bg-[#8b9a6e] hover:bg-[#7b8a5e] shadow-[#8b9a6e]/30"
            }`}
          >
            {isLoading ? "Signing in..." : (isAdminMode ? "Sign In as Admin" : "Sign In")}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
          {isAdminMode ? (
            <p className="text-sm text-gray-600">
              Are you a student?{" "}
              <button 
                type="button" 
                onClick={() => setIsAdminMode(false)}
                className="text-[#8b9a6e] font-semibold hover:text-[#7b8a5e] transition-colors"
              >
                Student Login
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Administrator?{" "}
              <button 
                type="button" 
                onClick={() => {
                  setIsAdminMode(true);
                  setFormData({ email: "admin@gmail.com", password: "admin" });
                }}
                className="text-[#333333] font-semibold hover:text-black transition-colors"
              >
                Admin Login
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
