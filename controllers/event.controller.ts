// import { google } from 'googleapis';
import axios from 'axios';

export default class EventController {
  async fetchEvents(accessToken: string): Promise<Event[]> {
    try {
      // const googleCalendar = google.calendar({
      //   version: 'v3',
      //   auth: accessToken,
      // });
      // const GoogleCalendarEventListResponse = await googleCalendar.events.list({
      //   calendarId: 'primary',
      //   orderBy: 'startTime',
      // });
      const GoogleCalendarEventListResponse = await axios.get<GoogleCalendarEventList>(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      let googleCalendarEvents: GoogleCalendarEvent[] =
        GoogleCalendarEventListResponse.data.items || [];
      const eventList: Event[] = googleCalendarEvents.map((gEvent: GoogleCalendarEvent) => ({
        name: gEvent.summary || '',
        location: gEvent.location || '',
        description: gEvent.description || '',
      }));
      return eventList;
    } catch (error) {
      console.error('Failed to fetch Calendar data:', error);
      throw new Error('Failed to fetch Calendar data');
    }
  }
}

export interface Event {
  name: string;
  location: string;
  description: string;
}

interface GoogleCalendarEventList {
  kind: string;
  etag: string;
  summary: string;
  description: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  defaultReminders: DefaultReminder[];
  nextSyncToken: string;
  items: GoogleCalendarEvent[];
}

interface DefaultReminder {
  method: string;
  minutes: number;
}

interface GoogleCalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description: string;
  location: string;
  creator: {
    email: string;
    self: boolean;
  };
  organizer: {
    email: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  iCalUID: string;
  sequence: number;
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
}
