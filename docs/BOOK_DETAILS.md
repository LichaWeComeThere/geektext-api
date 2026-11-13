# Book Details

Owner: Herlin Guirado Fuentes. The book routes are in `routes/bookDetails.js`, which `server.js` mounts at `/api/books`. The author route is in `routes/authors.js`, mounted at `/api/authors`. The API runs at `http://127.0.0.1:3000`.

| Route | What it does | Success |
| --- | --- | --- |
| `GET /api/books/isbn/:isbn` | One book's details, found by its ISBN | 200 + the book |
| `GET /api/books/author/:authorId` | Every book by one author, sorted by name | 200 + JSON list of books |
| `POST /api/books` | An administrator creates a new book | 201 + the new book |
| `POST /api/authors` | An administrator creates a new author | 201 + the new author |

Every book in a response includes its author's `_id`, `firstName` and `lastName`. IDs (`_id`) are different on each computer, so copy them from your own responses.

## Data

The two Mongoose models are in `models/`. One author can write many books, and every book has exactly one author, saved as the author's `_id` in the book's `author` field.

| Book field | Type | Rule |
| --- | --- | --- |
| `isbn` | Text | Required, unique, 13 digits with no dashes |
| `name` | Text | Required |
| `description` | Text | Optional, defaults to `""` |
| `price` | Number | Required, 0 or more |
| `author` | Author `_id` | Required, must be an existing author |
| `genre` | Text | Required |
| `publisher` | Text | Required |
| `yearPublished` | Number | Optional, a whole number |
| `copiesSold` | Number | Optional, a whole number, defaults to 0 |

| Author field | Type | Rule |
| --- | --- | --- |
| `firstName` | Text | Required |
| `lastName` | Text | Required |
| `biography` | Text | Optional, defaults to `""` |
| `publisher` | Text | Optional |

Both models also get `createdAt` and `updatedAt` automatically.

## GET /api/books/isbn/:isbn

Returns one book. Dashes in the ISBN are removed first, so `978-1-7365-0101-6` and `9781736501016` find the same book.

| Parameter | Where | Example |
| --- | --- | --- |
| `isbn` | URL | `9781736501016` or `978-1-7365-0101-6` |

Example: `GET /api/books/isbn/9781736501016` returns 200:

```json
{
  "_id": "6af6b352ad36f5ae87c32253",
  "isbn": "9781736501016",
  "name": "Recursion Without Tears",
  "description": "A friendly, example-first guide to thinking recursively, from factorials to tree traversals.",
  "price": 34.99,
  "author": {
    "_id": "6af6b352ad36f5ae87c3224d",
    "firstName": "Ada",
    "lastName": "Pemberton"
  },
  "genre": "Programming",
  "publisher": "Byteforge Press",
  "yearPublished": 2019,
  "copiesSold": 18450,
  "createdAt": "2026-11-13T06:50:58.825Z",
  "updatedAt": "2026-11-13T06:50:58.825Z",
  "__v": 0
}
```

| Status | When | Body |
| --- | --- | --- |
| 200 | A book has that ISBN | The book |
| 404 | No book has that ISBN | `{ "message": "No book found with ISBN 9780000000000" }` |
| 500 | Database error | `{ "message": "Could not get book details", "error": "..." }` |

## GET /api/books/author/:authorId

Returns every book by one author, sorted by name. Use the `author._id` from any of that author's books.

| Parameter | Where | Rule |
| --- | --- | --- |
| `authorId` | URL | An author's `_id` (24 characters) |

Example: Ada Pemberton's `_id` returns 200 with her 3 seeded books, in this order:

1. Recursion Without Tears (`9781736501016`)
2. Statistics Before Coffee (`9781736509098`)
3. The Patient Debugger (`9781736502020`)

Each book has the same fields as the ISBN example.

| Status | When | Body |
| --- | --- | --- |
| 200 | The author exists | JSON list of books, or `[]` if the author has no books yet |
| 400 | The ID isn't a valid ID, for example `abc` | `{ "message": "authorId is not a valid ID" }` |
| 404 | No author has that ID | `{ "message": "No author found with ID 000000000000000000000000" }` |
| 500 | Database error | `{ "message": "Could not get books by author", "error": "..." }` |

## POST /api/books

Creates a book. The checks run in this order, and the first one that fails sends the error: required fields, ISBN, price, `yearPublished`, `copiesSold`, `authorId` format, author exists, ISBN not already used. Any extra fields in the body are ignored.

Request body:

```json
{
  "isbn": "978-1-7365-2002-4",
  "name": "Deploying Node APIs",
  "description": "Take an Express API from your laptop to the cloud, step by step.",
  "price": 32.99,
  "authorId": "6af6b367b501e25d0c0c6f33",
  "genre": "Web Development",
  "publisher": "Lambda House",
  "yearPublished": 2026
}
```

| Field | Rule |
| --- | --- |
| `isbn` | Required. 13 digits; dashes are allowed and removed before saving |
| `name`, `genre`, `publisher` | Required text |
| `price` | Required. A number that is 0 or more |
| `authorId` | Required. The `_id` of an existing author |
| `description` | Optional text |
| `yearPublished` | Optional. A whole number |
| `copiesSold` | Optional. A whole number that is 0 or more, defaults to 0 |

The response is 201 with the saved book, with the ISBN saved without dashes and the author's name filled in:

```json
{
  "isbn": "9781736520024",
  "name": "Deploying Node APIs",
  "description": "Take an Express API from your laptop to the cloud, step by step.",
  "price": 32.99,
  "author": {
    "_id": "6af6b367b501e25d0c0c6f33",
    "firstName": "Grace",
    "lastName": "Holloway"
  },
  "genre": "Web Development",
  "publisher": "Lambda House",
  "yearPublished": 2026,
  "copiesSold": 0,
  "_id": "6af6b367b501e25d0c0c6f34",
  "createdAt": "2026-11-13T06:51:19.089Z",
  "updatedAt": "2026-11-13T06:51:19.089Z",
  "__v": 0
}
```

| Status | When | Body |
| --- | --- | --- |
| 201 | The book was saved | The new book |
| 400 | A required field is missing or empty | `{ "message": "Missing required field(s): isbn, genre, publisher, price, authorId" }` (lists only the missing ones) |
| 400 | The ISBN isn't 13 digits | `{ "message": "ISBN must be 13 digits" }` |
| 400 | The price isn't a number that is 0 or more | `{ "message": "Price must be a number that is 0 or more" }` |
| 400 | `yearPublished` isn't a whole number | `{ "message": "yearPublished must be a whole number" }` |
| 400 | `copiesSold` isn't a whole number that is 0 or more | `{ "message": "copiesSold must be a whole number that is 0 or more" }` |
| 400 | `authorId` isn't a valid ID | `{ "message": "authorId is not a valid ID" }` |
| 404 | No author has that ID | `{ "message": "No author found with ID 000000000000000000000000" }` |
| 409 | Another book already has that ISBN | `{ "message": "A book with ISBN 9781736520024 already exists" }` |
| 500 | Database error | `{ "message": "Could not create book", "error": "..." }` |

## POST /api/authors

Creates an author. The same first and last name can't be added twice, whatever the capitalization, so `grace holloway` counts as a copy of `Grace Holloway`. Spaces at the start and end of each field are removed before saving.

Request body:

```json
{
  "firstName": "Grace",
  "lastName": "Holloway",
  "biography": "Cloud engineer who writes practical guides to deploying web apps.",
  "publisher": "Lambda House"
}
```

| Field | Rule |
| --- | --- |
| `firstName`, `lastName` | Required text |
| `biography`, `publisher` | Optional text |

The response is 201 with the saved author. Use its `_id` as `authorId` when you create that author's books:

```json
{
  "firstName": "Grace",
  "lastName": "Holloway",
  "biography": "Cloud engineer who writes practical guides to deploying web apps.",
  "publisher": "Lambda House",
  "_id": "6af6b367b501e25d0c0c6f33",
  "createdAt": "2026-11-13T06:51:19.043Z",
  "updatedAt": "2026-11-13T06:51:19.043Z",
  "__v": 0
}
```

| Status | When | Body |
| --- | --- | --- |
| 201 | The author was saved | The new author |
| 400 | `firstName` or `lastName` is missing or empty | `{ "message": "Missing required field(s): firstName, lastName" }` (lists only the missing ones) |
| 400 | A field is sent but isn't text, for example a number | `{ "message": "biography must be text" }` |
| 409 | An author with that first and last name already exists | `{ "message": "Author Grace Holloway already exists", "authorId": "6af6b367b501e25d0c0c6f33" }` |
| 500 | Database error | `{ "message": "Could not create author", "error": "..." }` |

The 409 includes the existing author's `_id`, so a client can use that author instead of creating a copy.

## Smoke test

`postman/Herlin-Sprint5-BookDetails-SmokeTest.postman_collection.json` tests all four routes in order: get by ISBN, get by author, create an author, create a book, then both reads again on the new author and book. It has 18 requests and 46 tests.

1. Make sure MongoDB is running and `.env` exists (`cp .env.example .env`).
2. Load the books: `node seed/seedBooks.js`
3. Start the API: `npm start`
4. In Postman, import the collection and run it in order with the Collection Runner. All 46 tests should pass.

Each run creates a new test author named "Smoke Test" plus a number, and a new book with an ISBN starting with `97899`, so the collection passes again without resetting. The test data uses its own genre ("Testing") and publisher ("Smoke Test Press"), so it doesn't change the results of the other features' tests. To remove it:

```sh
mongosh geektext --eval 'printjson(db.authors.deleteMany({ firstName: "Smoke" })); printjson(db.books.deleteMany({ isbn: /^97899/ }))'
```

To run it from the command line instead, use `npx newman run postman/Herlin-Sprint5-BookDetails-SmokeTest.postman_collection.json`.

The older collections still work: `Herlin-Sprint3-BookDetails` (create book and books by author) and `Herlin-Sprint4-BookDetails` (create author). They have no automatic tests; they're the requests from the Sprint 3 and Sprint 4 demos.
