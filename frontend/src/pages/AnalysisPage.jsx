// import { useLocation } from "react-router-dom";

// const { state } = useLocation();
// const summary = state?.summary;
import Header from "./Header";

export default function AnalysisPage() {
    return (
      <>
        <Header />
        <div className="p-10 text-center text-3xl text-green-600">
          ✅ Analysis Page Loaded!
        </div>
      </>
    );
  }
  