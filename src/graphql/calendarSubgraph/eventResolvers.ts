// import { google } from 'googleapis';
import axios from 'axios';
import { validateGoogleAccessToken } from '../../utils/validateGoogleAccessToken';

export interface Event {
    name: String;
    location: String;
    description: String;
}

export async function fetchEvents(accessToken: string): Promise<Event[]> {
    try {
        await validateGoogleAccessToken(accessToken);
        // const calendar = google.calendar({
        //     version: 'v3',
        //     auth: accessToken
        // });
        // const eventsResponse = await calendar.events.list({
        //     calendarId: 'primary',
        //     orderBy: 'startTime',
        // });
        const eventsResponse = await axios.get(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        let eventListData = eventsResponse.data.items || [];
        const events: Event[] = eventListData.map((event: any) => ({
            name: event.summary || '',
            location: event.location || '',
            description: event.description || ''
        }));
        return events;
    } catch (error: any) {
        console.error('Failed to fetch Calendar data:', error);
        throw new Error('Failed to fetch Calendar data');
    }
}

export const eventResolvers = {
    Query: {
        events: async (_: any, __: any, context: any) => {
            return fetchEvents(context.accessToken);
        }
    }
}