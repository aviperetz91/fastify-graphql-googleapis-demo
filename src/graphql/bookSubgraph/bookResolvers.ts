function getBooks() {
    return [
        { id: 1, title: 'The Great Gastby', author: 'F. Scott fitzgerald' },
        { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
        { id: 3, title: '1984', author: 'George Orwell' },
    ];
}

export const bookResolvers = {
    Query: {
        books: async () => {
            return getBooks();
        }
    }
}