/**
 * Calendar Service
 * Provides utilities for adding events to Google and Apple calendars
 */
import { CalendarEvent } from "../types";

/**
 * Generates a Google Calendar URL for the event
 * @param event Calendar event data
 * @returns URL string for Google Calendar
 */
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startDate = formatDate(event.startDate);
  const endDate = formatDate(event.endDate);

  // Encode event details for URL
  const title = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.location);
  const description = encodeURIComponent(event.description);

  // Add reminders (1 week and 1 day before)
  // Google Calendar uses 'popup' reminders with minutes before the event
  // 1 week = 10080 minutes, 1 day = 1440 minutes
  const reminders = "POPUP=10080&POPUP=1440";

  // Construct Google Calendar URL with reminders
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}&add=${reminders}&sf=true&output=xml`;
};

/**
 * Generates an iCalendar (.ics) file content for Apple Calendar
 * @param event Calendar event data
 * @returns iCalendar file content as string
 */
export const generateIcsFileContent = (event: CalendarEvent): string => {
  // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, "");
  };

  const startDate = formatDate(event.startDate);
  const endDate = formatDate(event.endDate);
  const now = formatDate(new Date());

  // Construct iCalendar content with reminders (1 week and 1 day before)
  return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Walima RSVP App//EN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
DTSTAMP:${now}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title}
TRIGGER:-P7D
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title}
TRIGGER:-P1D
END:VALARM
END:VEVENT
END:VCALENDAR`;
};

/**
 * Triggers download of an iCalendar (.ics) file
 * @param event Calendar event data
 */
export const downloadIcsFile = (event: CalendarEvent): void => {
  const icsContent = generateIcsFileContent(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Create a link element and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Creates a calendar event object from Walima details
 * @returns Calendar event object
 */
export const createWalimaEvent = (): CalendarEvent => {
  // Walima date: May 3rd, 2025 at 6:30 PM
  const startDate = new Date("2025-05-03T18:30:00");
  // Assuming the event lasts 4 hours
  const endDate = new Date("2025-05-03T21:30:00");

  return {
    title: "Mazin's Walima Celebration",
    description:
      "Join us for our special day. Please adhere to islamic modesty principles. We are requesting no pictures to protect the privacy of bride, groom and other guests.",
    location:
      "Muslim Educational Trust, 10330 SW Scholls Ferry Rd, Tigard, OR 97223",
    startDate,
    endDate,
  };
};
