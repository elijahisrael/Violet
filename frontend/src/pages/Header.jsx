import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    return (
        <div className="fixed top-4 left-4 z-50">
          <button onClick={() => navigate("/")}>
            <img
              src="/violet_logo.png" // ← replace this with your actual image path
              alt="Home"
              style={{ height: "175px", width: "175px" }}
              className="object-contain hover:opacity-80 transition"
            />
          </button>
        </div>
      );
    }