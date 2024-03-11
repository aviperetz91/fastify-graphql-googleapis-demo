// import { google } from 'googleapis';
import axios from 'axios';
import { GoogleConnection, GoogleConnectionList } from './googleConnectionTypes';

interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
}

async function fetchContacts(accessToken: string): Promise<Contact[]> {
  try {
    // const googlePeople = google.people({
    //   version: 'v1',
    //   auth: accessToken,
    // });
    // const googleConnectionListResponse = await googlePeople.people.connections.list({
    //   resourceName: 'people/me',
    //   personFields: 'names,emailAddresses,phoneNumbers',
    // });
    const googleConnectionListResponse = await axios.get<GoogleConnectionList>(
      'https://people.googleapis.com/v1/people/me/connections',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { personFields: 'names,emailAddresses,phoneNumbers' },
      }
    );
    let googleConnections: GoogleConnection[] = googleConnectionListResponse.data.connections || [];
    const contactList: Contact[] = googleConnections.map((gConnection: GoogleConnection) => ({
      name: gConnection.names?.[0]?.displayName ?? '',
      email: gConnection.emailAddresses?.[0]?.value ?? '',
      phoneNumber: gConnection.phoneNumbers?.[0]?.canonicalForm ?? '',
    }));
    return contactList;
  } catch (error) {
    console.error('Failed to fetch People data:', error);
    throw new Error('Failed to fetch People data');
  }
}

export const contactResolvers = {
  Query: {
    contacts: async (_: any, __: any, context: any) => {
      return fetchContacts(context.accessToken);
    },
  },
};
