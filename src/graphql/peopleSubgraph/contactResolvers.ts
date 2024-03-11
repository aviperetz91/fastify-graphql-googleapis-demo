// import { google } from 'googleapis';
import axios from 'axios';
import { validateGoogleAccessToken } from '../../utils/validateGoogleAccessToken';

export interface Contact {
    name: String;
    email: String;
}

export async function fetchContactsData(accessToken: string): Promise<Contact[]> {
    try {
        await validateGoogleAccessToken(accessToken);
        // const googlePeople = google.people({
        //     version: 'v1',
        //     auth: accessToken,
        // });
        // const contactsResponse = await googlePeople.people.connections.list({
        //     resourceName: 'people/me',
        //     personFields: 'names,emailAddresses',
        // });
        const contactsResponse = await axios.get(
            'https://people.googleapis.com/v1/people/me/connections',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    personFields: 'names,emailAddresses',
                },
            }
        );
        let contactListData = contactsResponse.data.connections || [];
        const contacts: Contact[] = contactListData.map((contact: any) => ({
            name: contact.names && contact.names.length > 0 ? contact.names[0].displayName || '' : '',
            email: contact.emailAddresses && contact.emailAddresses.length > 0 ? contact.emailAddresses[0].value || '' : '',
        }));
        return contacts;
    } catch (error: any) {
        console.error('Failed to fetch People data:', error);
        throw new Error('Failed to fetch People data');
    }
}

export const contactResolvers = {
    Query: {
        contacts: async (_: any, __: any, context: any) => {
            return fetchContactsData(context.accessToken);
        }
    }
}