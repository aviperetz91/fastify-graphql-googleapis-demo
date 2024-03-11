export const contactSchema = `
    type Contact {
        name: String!
        email: String!
    }

    type Query {
        contacts: [Contact!]!
    }
`;