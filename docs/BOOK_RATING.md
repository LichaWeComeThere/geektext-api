# Book Rating and Commenting

Owner: Michael Duran. All four routes are in `routes/ratings.js`, which `server.js` mounts at `/api/books`. The API runs at `http://127.0.0.1:3000`. Ratings are stored in the `Rating` model (`models/Rating.js`) and comments in the `Comment` model (`models/Comment.js`).

| Route | What it does | Success |
| --- | --- | --- |
| `POST /api/books/:bookId/rating` | A user rates a book 1 to 5 stars | 204, no body |
| `POST /api/books/:bookId/comments` | A user comments on a book | 204, no body |
| `GET /api/books/:bookId/comments` | Every comment on a book, newest first | 200 + JSON list of comments |
| `GET /api/books/:bookId/rating` | The book's average rating | 200 + JSON object |

`:bookId` is the book's MongoDB `_id`, for example `6afa58bdc566fad75edade58`. Get one from any book route, such as `GET /api/books/top-sellers` or `GET /api/books/isbn/:isbn`. The `userId` in the POST bodies is a user's `_id`, which `GET /api/users/:username` returns.

All errors from these routes look like `{ "error": "..." }`. Every route returns 400 `{ "error": "Invalid bookId" }` if `:bookId` isn't a valid MongoDB ID.

## POST /api/books/:bookId/rating

Saves a user's rating of a book. Each user has **one rating per book**: if the same user rates the same book again, the new rating replaces the old one instead of being added. That way one user can't pull an average up or down by rating many times. A unique database index on `bookId` + `userId` enforces this.

Each rating stores a datestamp. `createdAt` is when the user first rated the book, and `updatedAt` is when they last changed the rating.

Request body:

```json
{ "userId": "6ae7f7e66214e4382f2e8629", "rating": 4 }
```

| Field | Rule |
| --- | --- |
| `userId` | Required. The `_id` of an existing user |
| `rating` | Required. A whole number from 1 to 5. Text such as `"4"` and decimals such as `4.5` are not accepted |

The response is 204 with no body, since the spec says the response data is none. Use `GET /api/books/:bookId/rating` to see the effect.

| Status | When | Body |
| --- | --- | --- |
| 204 | The rating was saved or replaced | none |
| 400 | `rating` isn't a whole number from 1 to 5 | `{ "error": "rating must be a whole number from 1 to 5" }` |
| 400 | `userId` is missing or isn't a valid ID | `{ "error": "Valid userId is required" }` |
| 400 | `:bookId` isn't a valid ID | `{ "error": "Invalid bookId" }` |
| 404 | No user has that `userId` | `{ "error": "User not found" }` |
| 404 | No book has that `:bookId` | `{ "error": "Book not found" }` |

## POST /api/books/:bookId/comments

Saves a user's comment on a book with a datestamp (`createdAt`). Spaces at the start and end are removed before saving. Unlike ratings, a user can comment on the same book as many times as they like.

Request body:

```json
{ "userId": "6ae7f7e66214e4382f2e8629", "comment": "Clear explanations and good examples." }
```

| Field | Rule |
| --- | --- |
| `userId` | Required. The `_id` of an existing user |
| `comment` | Required text, 1 to 1000 characters after trimming spaces |

| Status | When | Body |
| --- | --- | --- |
| 204 | The comment was saved | none |
| 400 | `comment` is missing, not text, only spaces, or over 1000 characters | `{ "error": "comment must be 1–1000 characters" }` |
| 400 | `userId` is missing or isn't a valid ID | `{ "error": "Valid userId is required" }` |
| 400 | `:bookId` isn't a valid ID | `{ "error": "Invalid bookId" }` |
| 404 | No user has that `userId` | `{ "error": "User not found" }` |
| 404 | No book has that `:bookId` | `{ "error": "Book not found" }` |

## GET /api/books/:bookId/comments

Returns every comment on a book, newest first. Comments saved in the same millisecond come back in reverse save order, so the order is always the same. A book with no comments, including a book ID that doesn't exist, returns an empty list.

Example: `GET /api/books/6afa58bdc566fad75edade58/comments` returns 200:

```json
[
  {
    "_id": "6afa58bec566fad75edade5a",
    "userId": "6ae7f7e66214e4382f2e862a",
    "text": "Smoke test comment from Bob.",
    "createdAt": "2026-11-16T01:13:34.006Z"
  },
  {
    "_id": "6afa58bdc566fad75edade59",
    "userId": "6ae7f7e66214e4382f2e8629",
    "text": "Smoke test comment from Alice.",
    "createdAt": "2026-11-16T01:13:33.995Z"
  }
]
```

| Status | When | Body |
| --- | --- | --- |
| 200 | Valid `:bookId` | JSON list of comments, or `[]` |
| 400 | `:bookId` isn't a valid ID | `{ "error": "Invalid bookId" }` |

## GET /api/books/:bookId/rating

Returns the average of all the ratings for a book, rounded to 2 decimals, and how many ratings it has. Because each user has one rating per book, `ratingCount` is also the number of users who rated it.

Example: after Alice rates a book 2 and Bob rates it 5, `GET /api/books/6afa58bdc566fad75edade58/rating` returns 200:

```json
{
  "bookId": "6afa58bdc566fad75edade58",
  "averageRating": 3.5,
  "ratingCount": 2
}
```

A book with no ratings, including a book ID that doesn't exist, returns `"averageRating": null` and `"ratingCount": 0`.

| Status | When | Body |
| --- | --- | --- |
| 200 | Valid `:bookId` | The object above |
| 400 | `:bookId` isn't a valid ID | `{ "error": "Invalid bookId" }` |

Book Browsing's `GET /api/books/rating/:rating` uses these same ratings to find books at or above an average. See `docs/BOOK_BROWSING.md`.

## Sample data

`npm run seed:ratings` deletes all ratings and comments, then gives the first 6 books fixed ratings and 2 comments each, so the averages are the same every run. Each user rates a book at most once. Run it after the user and book seeds:

```sh
npm run seed
node seed/seedBooks.js
npm run seed:ratings
```

## Smoke test

`postman/Michael-Sprint5-BookRating-SmokeTest.postman_collection.json` tests all four routes. It has 21 requests and 46 tests. It creates a new test book each run, so the book starts with no ratings or comments and the results are exact. Then it:

1. Checks that the new book has no average and no comments.
2. Has Alice rate it 4 and Bob rate it 5 (average 4.5 from 2).
3. Has Alice rate it again with 2 (average 3.5, still 2 ratings, because her rating was replaced).
4. Sends bad ratings, a user that doesn't exist, and an invalid book ID.
5. Has Alice, then Bob, comment, and checks they come back newest first with spaces trimmed.
6. Sends an empty comment, a comment on a missing book, and an invalid book ID.

To run it:

1. Make sure MongoDB is running and `.env` exists (`cp .env.example .env`).
2. Load the users and books: `npm run seed` then `node seed/seedBooks.js`
3. Start the API: `npm start`
4. In Postman, import the collection and run it in order with the Collection Runner. All 46 tests should pass.

The collection passes again without resetting. Its test books use their own ISBN prefix (`97898`), genre ("Testing"), and publisher ("Smoke Test Press"), and their ratings stay on those books, so it doesn't change the averages the other features' tests read. To remove the test books and their ratings and comments:

```sh
mongosh geektext --eval 'const ids = db.books.find({ isbn: /^97898/ }).toArray().map(b => b._id); printjson({ ratings: db.ratings.deleteMany({ bookId: { $in: ids } }).deletedCount, comments: db.comments.deleteMany({ bookId: { $in: ids } }).deletedCount, books: db.books.deleteMany({ _id: { $in: ids } }).deletedCount })'
```

To run it from the command line instead, use `npx newman run postman/Michael-Sprint5-BookRating-SmokeTest.postman_collection.json`.

The older collections still work. `Michael-Sprint4-Ratings` (44 tests) is the most complete; it rates the top-selling book with a seeded user, so it does change that book's average. `Michael-Sprint2-Ratings` and `Michael-Sprint3-Ratings` have no automatic tests; they're the requests from the earlier demos. They were written before the POSTs returned 204, so request names that say "(201)" now get 204.
