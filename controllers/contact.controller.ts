// import { google } from 'googleapis';
import axios from 'axios';

export default class ContactController {
  async fetchContacts(accessToken: string): Promise<Contact[]> {
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
      let googleConnections: GoogleConnection[] =
        googleConnectionListResponse.data.connections || [];
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
}

export interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
}

interface GoogleConnectionList {
  connections: GoogleConnection[];
  totalPeople: number;
  totalItems: number;
}

interface GoogleConnection {
  resourceName: string;
  etag: string;
  names: Name[];
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumbers[];
}

interface Name {
  metadata: {
    primary: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  displayName: string;
  familyName: string;
  givenName: string;
  displayNameLastFirst: string;
  unstructuredName: string;
}

interface EmailAddress {
  metadata: {
    primary: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  value: string;
}

interface PhoneNumbers {
  metadata: {
    primary: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  value: string;
  canonicalForm: string;
}
