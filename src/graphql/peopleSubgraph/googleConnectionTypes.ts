export interface GoogleConnectionList {
  connections: GoogleConnection[];
  totalPeople: number;
  totalItems: number;
}

export interface GoogleConnection {
  resourceName: string;
  etag: string;
  names: Name[];
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumbers[];
}

export interface Name {
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

export interface EmailAddress {
  metadata: {
    primary: boolean;
    source: {
      type: string;
      id: string;
    };
  };
  value: string;
}

export interface PhoneNumbers {
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
