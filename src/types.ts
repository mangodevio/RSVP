/**
 * Type definitions for the RSVP application
 */

/**
 * RSVP form data interface
 */
export interface RSVPData {
  name: string;
  phone: string;
  partySize: string | number;
  status: "confirmed" | "tentative";
}

/**
 * API response interface
 */
export interface ApiResponse {
  success: boolean;
  error?: string;
}

/**
 * Calendar event data interface
 */
export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}
