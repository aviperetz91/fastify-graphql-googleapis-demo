// import { google } from 'googleapis';
import axios from 'axios';
import { GoogleCalendarEvent, GoogleCalendarEventList } from './googleCalendarEventTypes';

interface Event {
  name: string;
  location: string;
  description: string;
}

async function fetchEvents(accessToken: string): Promise<Event[]> {
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

export const eventResolvers = {
  Query: {
    events: async (_: any, __: any, context: any) => {
      return fetchEvents(context.accessToken);
    },
  },
};
