import Header from "./Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Scatter, ComposedChart, Area, Pie, PieChart, Legend } from "recharts";

export default function AnalysisPage() {
  const location = useLocation();
  const summary = location.state?.summary;
  const username = location.state?.username;
  const [activeTab, setActiveTab] = useState("stats");
  const [postToggle, setPostToggle] = useState("yearly");
  const [likeToggle, setLikeToggle] = useState("yearly");
  const [commentToggle, setCommentToggle] = useState("yearly");
  const [engagementToggle, setEngagementToggle] = useState("yearly");
  const hasPosts = summary["Total Posts "] > 0;

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
    { label: "Total Likes:", value: hasPosts ? summary["Total Likes on Posts "]: "N/A" },
    { label: "Total Comments:", value: hasPosts ? summary["Total Comments "]: "N/A" },
    { label: "Average Likes:", value: hasPosts ? summary["Average Likes per Post "]: "N/A" },
    { label: "Average Comments:", value: hasPosts ? summary["Average Comments per Post "]: "N/A" },
    { label: "Inactive Followers:", value: hasPosts ? summary["Inactive Followers "]: "N/A" },
    { label: "Longest Inactive Streak:", value: hasPosts ? summary["Inactive Streak "] + " days": "N/A" },
    
  ];
  const perMonths = Object.keys(summary["Posts per Month "])
  .sort()
  .map((month) => ({
    name: month,
    posts: summary["Posts per Month "][month] || 0,
    likes: summary["Likes per Month "][month] || 0,
    comments: summary["Comments per Month "][month] || 0,
    engagement: summary["Engagement Rate Per Month "][month] || 0,
  }));
  const perYears = Object.keys(summary["Posts per Year "])
  .sort()
  .map((year) => ({
    name: year,
    posts: summary["Posts per Year "][year] || 0,
    likes: summary["Likes per Year "][year] || 0,
    comments: summary["Comments per Year "][year] || 0,
    engagement: summary["Engagement Rate Per Year "][year] || 0,
  }));

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
              <h2 className="text-lg font-mono font-semibold text-violet-color">{item.label}</h2>
              <p className="text-2xl font-mono font-bold text-violet-color">{item.value}</p>
            </div>
          ))}
        </div>
      ) : hasPosts ? (
        <div className="flex flex-wrap gap-8 items-center justify-center p-8">
          {/* Posts */}
          <div className="text-center w-[520px]">
            <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">Posts</h2>
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setPostToggle("monthly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Month</button>
              <button onClick={() => setPostToggle("yearly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Year</button>
            </div>
            <BarChart width={500} height={300} data={postToggle === "yearly" ? perYears : perMonths}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#bdbfee" />
              <Bar dataKey="posts" barSize={40} fill="#413ea0" />
            </BarChart>
          </div>

          {/* Likes */}
          <div className="text-center w-[520px]">
            <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">Likes</h2>
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setLikeToggle("monthly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Month</button>
              <button onClick={() => setLikeToggle("yearly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Year</button>
            </div>
            <LineChart width={500} height={300} data={likeToggle === "yearly" ? perYears : perMonths}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#bdbfee" />
              <Line type="monotone" dataKey="likes" stroke="#8888f8" fill="#8888f8" />
            </LineChart>
          </div>

          {/* Comments */}
          <div className="text-center w-[520px]">
            <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">Comments</h2>
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setCommentToggle("monthly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Month</button>
              <button onClick={() => setCommentToggle("yearly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Year</button>
            </div>
            <LineChart width={500} height={300} data={commentToggle === "yearly" ? perYears : perMonths}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#bdbfee" />
              <Line type="monotone" dataKey="comments" stroke="#FF0000" fill="#FF0000" />
            </LineChart>
          </div>

          {/* Engagement */}
          <div className="text-center w-[520px]">
            <h2 className="text-2xl font-mono font-semibold text-violet-color mb-4">Engagement Rate</h2>
            <p className="text-sm font-mono font-semibold text-violet-color mb-4">
              Overall Engagement Rate is {summary["Overall Engagement Rate "]}%
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => setEngagementToggle("monthly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Month</button>
              <button onClick={() => setEngagementToggle("yearly")} className="px-4 py-2 bg-light-violet-color text-white rounded-md">Per Year</button>
            </div>
            <ComposedChart width={500} height={300} data={engagementToggle === "yearly" ? perYears : perMonths}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#bdbfee" />
              <Legend />
              <Area type="monotone" dataKey="engagement" fill="#bdbfee" stroke="#bdbfee" />
              <Bar dataKey="posts" barSize={40} fill="#413ea0" />
              <Line type="monotone" dataKey="likes" stroke="#82ca9d" fill="#82ca9d" />
            </ComposedChart>
          </div>

          {/* Pie Chart */}
          <div className="w-[520px]">
            <h2 className="p-4 text-center text-2xl font-mono font-semibold text-violet-color mb-4">Active vs Inactive Followers</h2>
            <PieChart width={500} height={300}>
              <Pie
                data={[
                  { name: "Active", value: Math.min(summary["Total Likes on Posts "], summary["Total Followers "]), fill: "#413ea0" },
                  { name: "Inactive", value: summary["Inactive Followers "], fill: "#8888f8" },
                ]}
                cx="50%" cy="50%" outerRadius={80} label
              />
              <Tooltip />
            </PieChart>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-3xl font-mono font-bold text-violet-color">
          No posts found for this user.
        </div>
      )}
    </>
  );
}