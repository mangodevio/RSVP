import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Info, MessageCircle } from "lucide-react";
import RSVPForm from "./components/RSVPForm";
import WalimaInfo from "./components/WalimaInfo";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8f3ed] text-[#2d3047] flex flex-col">
      <header className="bg-[#2d3047] text-[#f8f3ed] py-6 px-4 sticky top-0 z-10">
        <h1 className="text-center font-serif text-xl sm:text-2xl">
          Mazin Ashfaq's Walima Celebration
        </h1>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-md overflow-y-auto">
        <Routes>
          <Route path="/" element={<RSVPForm />} />
          <Route path="/info" element={<WalimaInfo />} />
        </Routes>
      </main>

      <footer className="bg-[#2d3047] text-[#f8f3ed] py-4 px-4 sticky bottom-0 z-10">
        <div className="container mx-auto text-center">
          <span></span>
          <div className="flex items-center justify-center space-x-4 sm:space-x-6">
            <a
              href="sms:+19713009363"
              className="inline-flex items-center space-x-2 text-[#c1a57b] hover:text-white transition-colors text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Text Questions +1 (971) 300-9363</span>
            </a>
            <Link
              to={location.pathname === "/info" ? "/" : "/info"}
              className="inline-flex items-center space-x-2 text-[#c1a57b] hover:text-white transition-colors text-sm sm:text-base"
            >
              <Info className="w-4 h-4" />
              <span>
                {location.pathname === "/info"
                  ? "Back to RSVP"
                  : "Walima Details"}
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
