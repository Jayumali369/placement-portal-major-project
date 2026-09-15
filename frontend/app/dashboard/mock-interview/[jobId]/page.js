"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; // For unwrapping params

export default function MockInterview({ params }) {
  const router = useRouter();
  // Unwrap the promise wrapped params in Next.js 15
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.jobId;
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Start interview on load
    startInterview(token);
  }, []);

  const startInterview = async (token) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/copilot/mock-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, chatHistory: [] })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([{ role: "assistant", content: data.reply }]);
      } else {
        setMessages([{ role: "assistant", content: `Error: ${data.message || 'Failed to start interview'}` }]);
      }
    } catch (err) {
      setMessages([{ role: "assistant", content: "Error connecting to the Copilot." }]);
    }
    setLoading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/copilot/mock-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, chatHistory: updatedMessages })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.message}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error getting response." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold font-poppins text-gray-800">AI Mock Interview Copilot</h1>
          <p className="text-xs text-gray-500">Hyper-personalized based on your resume and historical company questions</p>
        </div>
        <button 
          onClick={() => router.push("/dashboard")}
          className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100"
        >
          End Interview
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === "user" 
                  ? "bg-gray-900 text-white rounded-br-none" 
                  : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
              }`}>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border text-gray-500 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm text-sm italic">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer here..."
              disabled={loading}
              className="flex-1 p-3 border rounded-xl focus:outline-none focus:border-gray-900 disabled:bg-gray-100"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
