import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1);
    const [sessionId, setSessionId] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, code, session_id: sessionId || undefined }),
            });
    
    
            const data = await response.json();
    
            if (data.status === "two_factor") {
                setStep(2);
                setSessionId(data.session_id);
            } 
            else if (data.status === "success") {
                fetchSummary(data.session_id);
            } 
            else {
                alert(data.error || "Login failed");
            }

        } 
        catch (error) {
            console.error("Login error:", error);
            alert("Login failed: " + error.message);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchSummary = async (sessionId) => {
        try {
          const response = await fetch(`http://localhost:5000/get-summary/${sessionId}`);
          const summary = await response.json();
          navigate("/analysis", { state: { summary } });
        } 
        catch (error) {
          console.error("Failed to fetch summary:", error);
          alert("Failed to load analysis.");
        }
      };
      

      return (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center font-mono h-screen bg-white">
            <h1 className="text-3xl font-bold mb-6 text-violet-color">
              {step === 1 && "Please login to your instagram account"}
              {step === 2 && "Please verify your instagram account"}
            </h1>

            {loading && (
              <div className="mb-4 text-violet-color font-semibold text-center">
                Loading...please wait.
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-color mx-auto mt-2"></div>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-80">
              {step === 1 && (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-light-violet-color p-2 mb-4 w-full text-violet-color border-2 focus:outline-violet-color rounded-full"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-light-violet-color p-2 mb-4 w-full text-violet-color border-2 focus:outline-violet-color rounded-full"
                    required
                  />
                  <button type="submit" className="bg-violet-color text-white p-2 w-full rounded-full">
                    Get Analysis
                  </button>
                </>
              )}
      
              {step === 2 && (
                <>
                  <p className="mb-2 text-violet-color">
                    Two-factor code required. Please check your phone/app.
                  </p>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 2FA Code"
                    className="border-light-violet-color p-2 mb-4 w-full text-violet-color border-2 focus:outline-violet-color rounded-full"
                    required
                  />
                  <button type="submit" className="bg-violet-color text-white p-2 w-full rounded-full">
                    Verify
                  </button>
                </>
              )}
            </form>

        </div>
      </>
    );
}