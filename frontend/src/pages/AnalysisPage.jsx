import Header from "./Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Scatter, ComposedChart, Area, Pie, PieChart } from "recharts";

export default function AnalysisPage() {
  const location = useLocation();
  const summary = location.state?.summary;
  const username = location.state?.username;
  const [activeTab, setActiveTab] = useState("stats");
  const [postToggle, setPostToggle] = useState("yearly");
  const [likeToggle, setLikeToggle] = useState("yearly");
  const [commentToggle, setCommentToggle] = useState("yearly");
  const [engagementToggle, setEngagementToggle] = useState("yearly");

  if (!summary) {
    return (
      <div className="text-center mt-10 text-3xl font-mono font-bold text-violet-color">
        Oops! Something went wrong. Please try again.
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
      <div className="mt-6 mb-10 text-center text-3xl font-mono font-bold text-violet-color">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 justify-items-center px-6 max-w-7xl mx-auto">
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
        <div className="flex flex-wrap gap-6 items-center justify-center p-8">
          <div className="text-center w-[420px]">
          <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">
            Posts
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setPostToggle("monthly")}
            >
              Per Month
            </button>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setPostToggle("yearly")}
            >
              Per Year
            </button>
          </div>
          {postToggle ==="yearly" ? (
            <>
            <BarChart width={400} height={300} data={Object.entries(summary["Posts per Year "]).map(([year, count]) => ({ name: year, posts: count}))} >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#bdbfee" />
              <Bar dataKey="posts" barSize={40} fill="#413ea0" />
            </BarChart>
            </>
          ):(
            <>
            <BarChart width={400} height={300} data={Object.entries(summary["Posts per Month "]).map(([month, count]) => ({ name: month, posts: count}))} >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#bdbfee" />
              <Bar dataKey="posts" barSize={40} fill="#413ea0" />
            </BarChart>
          </>
          )}
          </div>
          <div className="text-center w-[420px]">
          <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">
            Likes
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setLikeToggle("monthly")}
            >
              Per Month
            </button>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setLikeToggle("yearly")}
            >
              Per Year
            </button>
          </div>
            {likeToggle ==="yearly" ? (
              <>
              <LineChart width={400} height={300} data={Object.entries(summary["Likes per Year "]).map(([year, count]) => ({ name: year, likes: count}))} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#bdbfee" />
                <Line dataKey="likes" stroke="#8888f8" fill="#8888f8" />
              </LineChart>
              </>
            ):(
              <>
              <LineChart width={400} height={300} data={Object.entries(summary["Likes per Month "]).map(([month, count]) => ({ name: month, likes: count}))} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#bdbfee" />
                <Line dataKey="likes" stroke="#8888f8" fill="#8888f8" />
              </LineChart>
            </>
            )}
          </div>
          <div className="text-center w-[420px]">
          <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">
            Comments
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setCommentToggle("monthly")}
            >
              Per Month
            </button>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setCommentToggle("yearly")}
            >
              Per Year
            </button>
          </div>
            {commentToggle ==="yearly" ? (
              <>
              <LineChart width={400} height={300} data={Object.entries(summary["Comments per Year "]).map(([year, count]) => ({ name: year, comments: count}))} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#bdbfee" />
                <Line dataKey="comments" stroke="#8888f8" fill="#8888f8" />
              </LineChart>
              </>
            ):(
              <>
              <LineChart width={400} height={300} data={Object.entries(summary["Comments per Month "]).map(([month, count]) => ({ name: month, comments: count}))} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#bdbfee" />
                <Line dataKey="comments" stroke="#8888f8" fill="#8888f8" />
              </LineChart>
            </>
            )}
          </div>
          <div className="text-center w-[420px]">
          <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">
            Engagement Rate
          </h2>
          <p className="text-sm font-mono font-semibold text-violet-color mb-4">
            Overall Engagement Rate is {summary["Overall Engagement Rate "]}%
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setEngagementToggle("monthly")}
            >
              Per Month
            </button>
            <button
              className="mb-4 px-4 py-2 bg-light-violet-color text-white rounded-md"
              onClick={() => setEngagementToggle("yearly")}
            >
              Per Year
            </button>
          </div>
            {engagementToggle ==="yearly" ? (
              <>
              <ComposedChart width={400} height={300} data={Object.entries(summary["Engagement Rate Per Year "]).map(([year, count]) => ({ name: year, engagement: count}))} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#bdbfee" />
                <Area type="monotone" dataKey="engagement" fill="#bdbfee" stroke="#8888f8" />
                <Bar dataKey="engagement" barSize={40} fill="#413ea0" />
                <Line type="monotone" dataKey="engagement" stroke="#8884d8" fill="#8888f8" />
              </ComposedChart>
              </>
            ):(
              <>
              <ComposedChart width={400} height={300} data={Object.entries(summary["Engagement Rate Per Month "]).map(([month, count]) => ({ name: month, engagement: count}))} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#bdbfee" />
                <Area type="monotone" dataKey="engagement" fill="#bdbfee" stroke="#8888f8" />
                <Bar dataKey="engagement" barSize={40} fill="#413ea0" />
                <Line type="monotone" dataKey="engagement" stroke="#8884d8" fill="#8888f8" />
              </ComposedChart>
            </>
            )}
          </div>
          <div className="w-[420px]">
          <h2 className=" p-4 text-center text-2xl font-mono font-semibold text-violet-color mb-4">
            Active vs Inactive Followers 
          </h2>
          <PieChart width={400} height={300}> 
            <Pie 
              data={[
                { name: "Active", value: Math.min(summary["Total Likes on Posts "], summary["Total Followers "]), fill: "#413ea0" },
                { name: "Inactive", value: summary["Inactive Followers "], fill: "#8888f8" },
              ]}
              cx="50%" cy="50%" outerRadius={80} label
              >
            </Pie>
            <Tooltip />
          </PieChart>
          </div>
        </div>
      )}
    </>
  );
}