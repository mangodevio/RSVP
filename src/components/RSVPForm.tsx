import React, { useState, useRef, useEffect, createRef } from "react";
import { Send, CheckCircle, HelpCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formConfig } from "../utils/formUtils";
import {
  generateGoogleCalendarUrl,
  downloadIcsFile,
} from "../services/calendarService";
import { CalendarEvent } from "../types";

type FormView =
  | "initial"
  | "confirmed"
  | "tentative"
  | "submitted"
  | "calendar";

// Create a reminder event for March 30th, 2025
const createReminderEvent = (): CalendarEvent => {
  // Reminder date: March 30th, 2025
  const startDate = new Date("2025-03-30T12:00:00");
  // 1 hour event
  const endDate = new Date("2025-03-30T13:00:00");

  return {
    title: "RSVP to Mazin's Wedding",
    description:
      "Reminder to RSVP for Mazin's wedding celebration on May 3rd, 2025.",
    location:
      "Muslim Educational Trust, 10330 SW Scholls Ferry Rd, Tigard, OR 97223",
    startDate,
    endDate,
  };
};

function RSVPForm() {
  const navigate = useNavigate();
  const [formView, setFormView] = useState<FormView>("initial");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    partySize: "",
    honeypot: "", // Honeypot field to catch bots
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const iframeRef = createRef<HTMLIFrameElement>();

  // Auto-redirect to wedding details after submission
  useEffect(() => {
    if (formView === "submitted") {
      // Show success message briefly, then redirect
      const redirectTimer = setTimeout(() => {
        navigate("/info");
      }, 2000); // 2 seconds delay

      return () => clearTimeout(redirectTimer);
    }
  }, [formView, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status: "confirmed" | "tentative"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Simple rate limiting - prevent multiple submissions in a short time period
    const lastSubmission = localStorage.getItem("lastRsvpSubmission");
    if (lastSubmission) {
      const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission, 10);
      // If less than 30 seconds since last submission
      if (timeSinceLastSubmission < 30000) {
        setErrorMessage("Please wait a moment before submitting again.");
        setIsSubmitting(false);
        return;
      }
    }

    // Honeypot check - if the honeypot field has a value, it's likely a bot
    if (formData.honeypot) {
      console.log("Honeypot triggered - likely bot submission");
      // Pretend to submit but don't actually do it
      setTimeout(() => {
        setFormView("submitted");
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    try {
      // Record this submission attempt
      localStorage.setItem("lastRsvpSubmission", Date.now().toString());
      // Create a hidden form to submit to Google Forms
      const form = document.createElement("form");
      form.method = "POST";
      form.action = formConfig.formAction;
      form.target = "hidden-iframe"; // Submit to our hidden iframe

      // Add the form fields
      const nameField = document.createElement("input");
      nameField.type = "hidden";
      nameField.name = formConfig.fieldNames.name;
      nameField.value = formData.name;
      form.appendChild(nameField);

      const phoneField = document.createElement("input");
      phoneField.type = "hidden";
      phoneField.name = formConfig.fieldNames.phone;
      phoneField.value = formData.phone;
      form.appendChild(phoneField);

      const partySizeField = document.createElement("input");
      partySizeField.type = "hidden";
      partySizeField.name = formConfig.fieldNames.partySize;
      partySizeField.value = formData.partySize;
      form.appendChild(partySizeField);

      const statusField = document.createElement("input");
      statusField.type = "hidden";
      statusField.name = formConfig.fieldNames.status;
      statusField.value =
        status === "confirmed"
          ? "I'll be there Inshallah"
          : "Remind me again closer to the event";
      form.appendChild(statusField);

      // Append the form to the body, submit it, and remove it
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // The form submission result will be handled by the iframe's onLoad event
      // No need to set formView here as it's handled in the iframe onLoad
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage(
        "An unexpected error occurred. Please try again or contact the event organizer."
      );
      setIsSubmitting(false);
    }
  };

  // Show success message if submitted (will auto-redirect)
  if (formView === "submitted") {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center">
          <p className="font-medium">Thank you for your RSVP!</p>
          <p className="text-sm mt-2">Redirecting to wedding details...</p>
        </div>
      </div>
    );
  }

  // Initial view with choice buttons
  if (formView === "initial") {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif mb-2">
            Will you be attending?
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Please let us know if you'll be joining us
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setFormView("confirmed")}
            className="w-full bg-[#2d3047] text-white py-3 rounded-lg flex items-center justify-center space-x-3 hover:bg-opacity-90 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>I'll be there</span>
          </button>

          <button
            onClick={() => setFormView("calendar")}
            className="w-full border-2 border-[#2d3047] text-[#2d3047] py-3 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Not sure yet</span>
          </button>
        </div>
      </div>
    );
  }

  // Calendar reminder view
  if (formView === "calendar") {
    const reminderEvent = createReminderEvent();

    const handleAddToGoogleCalendar = () => {
      const url = generateGoogleCalendarUrl(reminderEvent);
      window.open(url, "_blank");
    };

    const handleAddToAppleCalendar = () => {
      downloadIcsFile(reminderEvent);
    };

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif mb-2">
            Add a Calendar Reminder
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Add a reminder to your calendar so you don't forget to RSVP
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={handleAddToGoogleCalendar}
              className="flex-1 bg-white border border-gray-300 py-2 px-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-sm"
            >
              <img
                src="/RSVP/google-logo.png"
                alt="Google"
                className="w-7 h-7 mr-1"
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

          <button
            onClick={() => setFormView("initial")}
            className="w-full border border-[#2d3047] text-[#2d3047] py-3 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors"
          >
            <span>Back</span>
          </button>
        </div>
      </div>
    );
  }

  // RSVP Form (either confirmed or tentative)
  return (
    <>
      <form
        onSubmit={(e) =>
          handleSubmit(e, formView === "confirmed" ? "confirmed" : "tentative")
        }
        className="space-y-4 sm:space-y-6"
      >
        {/* Hidden iframe for form submission */}
        <iframe
          name="hidden-iframe"
          id="hidden-iframe"
          ref={iframeRef}
          style={{ display: "none" }}
          title="Hidden frame for form submission"
          sandbox="allow-scripts allow-forms"
          onLoad={() => {
            // This will be triggered when the iframe loads after form submission
            if (isSubmitting) {
              // Only process if we're actually submitting (not on initial iframe load)
              setTimeout(() => {
                setFormView("submitted");
                setIsSubmitting(false);
              }, 200);
            }
          }}
        />
        <div className="text-center mb-4">
          <h2 className="text-xl font-serif mb-2">
            {formView === "confirmed"
              ? "Confirm Your Attendance"
              : "Tentative RSVP"}
          </h2>
          <p className="text-sm text-gray-600">
            {formView === "confirmed"
              ? "We're excited to have you join us!"
              : "We'll send you a reminder closer to the date"}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p className="font-medium">Unable to submit your RSVP</p>
            </div>
            <p className="text-sm">{errorMessage}</p>
            <p className="text-sm mt-1">
              Please{" "}
              <a href="sms:+19713009363" className="underline">
                text (971) 300-9363
              </a>{" "}
              to RSVP instead
            </p>
          </div>
        )}

        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-[#c1a57b] bg-white focus:outline-none focus:ring-2 focus:ring-[#c1a57b]"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            required
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-[#c1a57b] bg-white focus:outline-none focus:ring-2 focus:ring-[#c1a57b]"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="partySize" className="block text-sm font-medium">
            Number of Guests
          </label>
          <input
            type="number"
            id="partySize"
            required
            min="1"
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-[#c1a57b] bg-white focus:outline-none focus:ring-2 focus:ring-[#c1a57b]"
            value={formData.partySize}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            If you know someone else is adding you to their party, please avoid
            submitting to prevent duplicate counts.
          </p>
        </div>

        {/* Honeypot field - hidden from users but bots will fill it out */}
        <div style={{ display: "none" }}>
          <label htmlFor="honeypot">Leave this empty</label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleInputChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormView("initial")}
            disabled={isSubmitting}
            className="flex-1 border border-[#2d3047] text-[#2d3047] py-2.5 sm:py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#2d3047] text-white py-2.5 sm:py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  );
}

export default RSVPForm;
