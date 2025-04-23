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
                setLoading(false);
                setStep(2);
                setSessionId(data.session_id);
            } 
            else if (data.status === "success") { 
              fetchSummary(data.session_id);
            } 
            else if (data.status === "sms_2fa") {
                setLoading(false);
                setStep(1);
                setCode("");
                alert("SMS 2FA is not supported. Please use the app for 2FA.")
            } 
            else if (data.status === "challenge_required") {
                setLoading(false);
                setStep(1);
                setCode("");
                alert("Challenge required. Please check your Instagram account for any security challenges.");
            }        
            else {
                setLoading(false);
                alert(data.error || "Login failed");
            }

        } 
        catch (error) {
            console.error("Login error:", error);
            setLoading(false);
            alert("Login failed: " + error.message);
        }
    };

    const fetchSummary = async (sessionId) => {
        try {
          const response = await fetch(`http://localhost:5000/get-summary/${sessionId}`);
          const summary = await response.json();
          navigate("/analysis", { state: { summary, username } });
        } 
        catch (error) {
          console.error("Failed to fetch summary:", error);
          alert("Failed to load analysis.");
        }
      };
      

      return (
        <>
            <Header />           
            {loading && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
                    <h1 className="text-2xl text-violet-color font-mono font-bold mb-4">
                        Loading...this might take a moment.
                    </h1>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-color"></div>
                </div>
            )}     
            {!loading && (
                <div className="flex flex-col items-center justify-center font-mono bg-white">
                    <h1 className="text-3xl font-bold mb-6 text-violet-color">
                        {step === 1 && "Please login to your Instagram account"}
                        {step === 2 && "Please verify your Instagram account"}
                    </h1>
                    <form onSubmit={handleLogin} className="w-80">
                        {step === 1 && (
                            <>
                                <p className="mb-6 text-sm font-mono text-center text-violet-color">
                                    *To use this service 2FA is required. SMS 2FA is not supported so please enable app-based 2FA in your Instagram settings.
                                </p>
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
                                    Two-factor code required. Please check your authentication app.
                                </p>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter Code"
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
            )}
        </>
    );
}