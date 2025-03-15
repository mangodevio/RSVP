import React from "react";
import { MapPin, Calendar, Clock, Gift } from "lucide-react";
import {
  createWeddingEvent,
  generateGoogleCalendarUrl,
  downloadIcsFile,
} from "../services/calendarService";

function WeddingInfo() {
  const handleAddToGoogleCalendar = () => {
    const event = createWeddingEvent();
    const url = generateGoogleCalendarUrl(event);
    window.open(url, "_blank");
  };

  const handleAddToAppleCalendar = () => {
    const event = createWeddingEvent();
    downloadIcsFile(event);
  };

  return (
    <div className="space-y-6 sm:space-y-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-serif mb-2">
          Mr. and Mrs. Ashfaqs Wedding Celebration
        </h1>
        <p className="text-[#c1a57b]">Join us on our special day</p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1a57b] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="font-medium mb-1">Date</h2>
            <p className="text-sm sm:text-base">Saturday, May 3rd, 2025</p>

            {/* Calendar Buttons - Moved here to be closer to the Date section */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                <button
                  onClick={handleAddToGoogleCalendar}
                  className="flex-1 bg-white border border-gray-300 py-2 px-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                >
                  <img
                    src="/RSVP/google-logo.png"
                    alt="Google"
                    className="w-7 h-7"
                  />
                  Add to Calendar
                </button>
                <button
                  onClick={handleAddToAppleCalendar}
                  className="flex-1 bg-white border border-gray-300 py-2 px-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
                >
                  <img
                    src="/RSVP/apple-logo.png"
                    alt="Apple"
                    className="w-4 h-5 mr-2"
                  />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 sm:space-x-4">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1a57b] flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-medium mb-1">Time</h2>
            <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <li>1:30 PM - Walima Start</li>
            </ul>
          </div>
        </div>

        <div className="flex items-start space-x-3 sm:space-x-4">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1a57b] flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-medium mb-1">Venue</h2>
            <div className="text-sm sm:text-base">
              <p>Muslim Educational Trust</p>
              <p>10330 SW Scholls Ferry Rd</p>
              <p>Tigard, OR 97223</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 sm:space-x-4">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#c1a57b] flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-medium mb-1">Gifts</h2>
            <p className="text-sm sm:text-base">
              Your presence is the greatest gift of all.
            </p>
          </div>
        </div>

        <div className="bg-[#f8f3ed] p-3 sm:p-4 rounded-lg mt-4 sm:mt-6">
          <h2 className="font-medium mb-2">Additional Notes</h2>
          <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <li>• Please adhere to islamic modesty principles</li>
            <li>
              • We are requesting no pictures to protect the privacy of bride,
              groom and other guests.
            </li>
            <li>• Please arrive on time.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WeddingInfo;
