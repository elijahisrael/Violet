import Header from "./Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function AnalysisPage() {
  const location = useLocation();
  const summary = location.state?.summary;
  const username = location.state?.username;
  const [activeTab, setActiveTab] = useState("stats");

  if (!summary) {
    return (
      <div className="text-center mt-10 text-3xl font-mono font-bold text-violet-color">
        No summary data provided.
      </div>
    );
  }

  const statCards = [
    { label: "Followers:", value: summary["Total Followers "] },
    { label: "Following:", value: summary["Total Following "] },
    { label: "Total Posts:", value: summary["Total Posts "] },
    { label: "Total Likes:", value: summary["Total Likes on Posts "] },
    { label: "Total Comments:", value: summary["Total Comments "] },
    { label: "Average Likes:", value: summary["Average Likes per Post "] },
    { label: "Average Comments:", value: summary["Average Comments per Post "] },
    { label: "Inactive Followers:", value: summary["Inactive Followers "] },
    { label: "Longest Inactive Streak:", value: summary["Inactive Streak "] + " days" },
    
  ];

  return (
    <>
      <Header />
      <div className="p-10 text-center text-3xl m-10 font-mono font-bold text-violet-color">
        Welcome {username}
      </div>
      
      <div className="flex justify-center mb-6 space-x-6">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "stats"
              ? "bg-violet-color text-white"
              : "bg-gray-100 text-violet-color"
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab("graphs")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "graphs"
              ? "bg-violet-color text-white"
              : "bg-gray-100 text-violet-color"
          }`}
        >
          Graphs & Charts
        </button>
      </div>

      {activeTab === "stats" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 justify-items-center px-4 max-w-7xl mx-auto">
          {statCards.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-60 h-28 m-4 bg-gray-50 rounded-lg shadow-md hover:shadow-violet-200"
            >
              <h2 className="text-lg font-mono font-semibold text-violet-color">
                {item.label}
              </h2>
              <p className="text-2xl font-mono font-bold text-violet-color">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold text-violet-color mb-6">
            Engagement Graphs (Coming Soon)
          </h2>
          {/* Replace this with your actual chart components later */}
          <div className="w-full max-w-4xl h-64 bg-gray-100 rounded-xl shadow-inner flex items-center justify-center">
            <p className="text-gray-400 text-lg font-mono">
              Chart content goes here.
            </p>
          </div>
        </div>
      )}
    </>
  );
}