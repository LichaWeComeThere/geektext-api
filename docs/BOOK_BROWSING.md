# Book Browsing and Sorting

Owner: Manuel Diaz. All four routes are in `routes/browsing.js`, which `server.js` mounts at `/api/books`. The API runs at `http://127.0.0.1:3000`.

| Route | What it does | Success |
| --- | --- | --- |
| `GET /api/books/genre/:genre` | Books in one genre, sorted by name | 200 + JSON list of books |
| `GET /api/books/top-sellers` | The 10 books with the most copies sold, highest first | 200 + JSON list of books |
| `GET /api/books/rating/:rating` | Books whose average rating is the given value or higher, highest first | 200 + JSON list of books |
| `PATCH /api/books/discount` | Lowers the price of every book from one publisher by a percent | 204, no body |

Every book in a response includes its author's first and last name.

## GET /api/books/genre/:genre

Returns every book in a genre, sorted by name. Upper/lower case doesn't matter, so `Programming` and `programming` return the same books. A genre with no books returns an empty list.

| Parameter | Where | Example |
| --- | --- | --- |
| `genre` | URL | `Programming` |

Example: `GET /api/books/genre/Programming` returns 200 with 3 books. The first one:

```json
{
  "_id": "6af526cc09ba9ce5cc62e0ae",
  "isbn": "9781736503034",
  "name": "Java in the Wild",
  "description": "Modern Java for real projects, covering collections, streams, and clean object-oriented design.",
  "price": 44.99,
  "author": {
    "_id": "6af526cc09ba9ce5cc62e09f",
    "firstName": "Theo",
    "lastName": "Lindqvist"
  },
  "genre": "Programming",
  "publisher": "Lambda House",
  "yearPublished": 2021,
  "copiesSold": 12780,
  "createdAt": "2026-11-12T02:39:08.749Z",
  "updatedAt": "2026-11-12T02:41:34.979Z",
  "__v": 0
}
```

| Status | When |
| --- | --- |
| 200 | Always, with an empty list `[]` if no books have that genre |

## GET /api/books/top-sellers

Returns the 10 books with the most copies sold, highest first. Books with the same `copiesSold` are sorted by name. It takes no parameters.

Example: `GET /api/books/top-sellers` returns 200 with 10 books. The first one is "REST Easy: Designing APIs People Love" with `copiesSold` 31200. Each book has the same fields as the genre example.

| Status | When |
| --- | --- |
| 200 | Always |

## GET /api/books/rating/:rating

Returns the books whose average rating is the given value or higher. Averages come from the Rating collection and are rounded to 2 decimals. The results are sorted by average rating, highest first, then by name. Books with no ratings are left out.

| Parameter | Where | Rule |
| --- | --- | --- |
| `rating` | URL | A number from 1 to 5, for example `4` or `3.5` |

Each book has the usual fields plus two more:

| Field | Meaning |
| --- | --- |
| `averageRating` | The book's average rating, rounded to 2 decimals |
| `ratingCount` | How many ratings the book has |

Example: `GET /api/books/rating/4` returns 200 with 2 books. The first one ends with:

```json
{
  "name": "Recursion Without Tears",
  "publisher": "Byteforge Press",
  "averageRating": 4.67,
  "ratingCount": 3
}
```

| Status | When | Body |
| --- | --- | --- |
| 200 | Valid rating | JSON list of books, or `[]` if none are high enough |
| 400 | Not a number from 1 to 5, for example `9`, `0` or `abc` | `{ "message": "Rating must be a number from 1 to 5" }` |

## PATCH /api/books/discount

Lowers the price of every book from one publisher by a percent, in a single database update. New prices are rounded to 2 decimals. The publisher match ignores upper/lower case.

Request body:

```json
{ "publisher": "Byteforge Press", "discountPercent": 10 }
```

| Field | Rule |
| --- | --- |
| `publisher` | Required text |
| `discountPercent` | A number from 0 to 100. Text such as `"10"` is not accepted |

Example: a 10% discount on Byteforge Press changes The Patient Debugger from 39.99 to 35.99. The response is 204 with no body. Use `GET /api/books/isbn/9781736502020` before and after to see the change.

| Status | When | Body |
| --- | --- | --- |
| 204 | The prices were lowered | none |
| 400 | `publisher` is missing or empty | `{ "message": "Publisher is required" }` |
| 400 | `discountPercent` isn't a number from 0 to 100 | `{ "message": "discountPercent must be a number from 0 to 100" }` |
| 404 | No books have that publisher | `{ "message": "No books found from publisher Nobody Press" }` |

Rounding uses MongoDB's `$round`, which rounds an exact half cent to the even digit. For example, 10.625 becomes 10.62.

## Smoke test

`postman/Manuel-Sprint5-BookBrowsing-SmokeTest.postman_collection.json` tests all four routes in order: genre, top sellers, rating, then discount. It has 13 requests and 34 tests.

1. Make sure MongoDB is running and `.env` exists (`cp .env.example .env`).
2. Load the data, one command at a time:

   ```sh
   npm run seed
   node seed/seedBooks.js
   npm run seed:ratings
   ```

3. Start the API: `npm start`
4. In Postman, import the collection and run it in order with the Collection Runner. All 34 tests should pass.
5. **Reset the prices afterwards.** The discount really changes the database, so run:

   ```sh
   node seed/seedBooks.js
   ```

The tests check the shape of each answer rather than exact prices, so the collection still passes if you run it again before resetting. To run it from the command line instead, use `npx newman run postman/Manuel-Sprint5-BookBrowsing-SmokeTest.postman_collection.json`.

The older collections still work: `Manuel-Sprint3-Browsing` (16 tests) and `Manuel-Sprint4-Discount` (17 tests). The Sprint 3 one checks exact counts, so run it on freshly seeded data.
