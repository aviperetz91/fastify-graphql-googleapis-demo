export const peopleSchema = `
    type Contact {
        name: String!
        email: String!
    }

    type Query {
        contacts: [Contact!]!
    }
`;