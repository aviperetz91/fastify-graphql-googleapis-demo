export const eventSchema = `
    type Event {
        name: String!
        location: String!
        description: String!,
    }

    type Query {
        events: [Event!]!
    }
`;