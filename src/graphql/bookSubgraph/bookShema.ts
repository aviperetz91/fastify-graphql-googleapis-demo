export const bookSchema = `
    type Book {
        id: Int!
        title: String!
        author: String!
    }

    type Query {
        books: [Book!]!
    }
`;