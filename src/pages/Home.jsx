import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import TetCountdown from "../components/TetCountdown";
import Loading from "../components/Loading";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 giây

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full">
      <Header />
      
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <TetCountdown />
        </div>

        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-red-600 to-red-700 text-yellow-400 px-8 py-3 rounded-full text-lg font-bold shadow-lg hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-200">
            🧧 Chúc mừng năm mới! 🧧
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home; 