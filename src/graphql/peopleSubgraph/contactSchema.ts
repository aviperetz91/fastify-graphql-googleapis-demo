export const contactSchema = `
    type Contact {
        name: String!
        email: String!
        phoneNumber: String!
    }

    type Query {
        contacts: [Contact!]!
    }
`;
