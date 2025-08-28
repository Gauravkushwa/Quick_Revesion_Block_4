const library = {

    books: [{ title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937 }],
    
    addBook(book) {
        book.title = book.title?.trim();
        book.author = book.author?.trim();
    if (
        !book.title || typeof book.title !== "string" || !book.author || typeof book.author !== "string" || !book.year || typeof book.year !== "number"
    ) {
    
    return ({success: false, message: "Book information is incomplete"});
    
    }
    if(this.books.some(B => B.title === book.title)) return ({success: false, message: "This title is Already Present"})
    this.books.push(book);
    return {success : true, message: "Book Added successfully...", data: book}
    },
    
    findBookByTitle(title) {
        const book = this.books.find(b => b.title.toLocaleLowerCase() === title.toLocaleLowerCase());
        if(book){
            return {success: true, data: book}
        }else{
            return {success: false, message: "title not Found..."}
        }
    },
    
    removeBook(title) {
    
    const index = this.books.findIndex(book => book.title.toLocaleLowerCase() === title.toLocaleLowerCase());
    
    if (index !== -1) {
    
    const removedBook = this.books.splice(index, 1)[0];
    return { success: true, data: removedBook };

    
    } else {
    
        return { success: false, message: "Book not found" };

    
    } } };
    
    library.addBook({ author: "George Orwell", year: 1949 });
    
    console.log(library.books.length);