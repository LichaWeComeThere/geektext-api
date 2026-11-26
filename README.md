# GeekText API

REST API for an online bookstore, built by a six-person team for **CEN 4010 (Software Engineering I) at FIU**, Fall 2026. Node.js, Express 5, MongoDB with Mongoose. Each team member owned one feature end to end: routes, data model, seed data, documentation, and a Postman test collection.

![Node](https://img.shields.io/badge/Node.js-24%20LTS-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tests](https://img.shields.io/badge/API%20tests-Postman%20%2F%20Newman-FF6C37?logo=postman&logoColor=white)

## What it does

A bookstore back end with no front end: every feature is an HTTP endpoint that returns JSON and is exercised through Postman.

| Feature | Endpoints | Owner |
| --- | --- | --- |
| **Book browsing & sorting** | `GET /api/books/genre/:genre` · `GET /api/books/top-sellers` · `GET /api/books/rating/:rating` · `PATCH /api/books/discount` | Manuel Diaz |
| **Book details** | `POST /api/books` · `GET /api/books/isbn/:isbn` · `GET /api/books/author/:authorId` · `POST /api/authors` | Herlin Guirado Fuentes |
| **Profile management** | `POST /api/users` · `GET /api/users/:username` · `PATCH /api/users/:username` · `POST /api/users/:username/credit-cards` | Carlos Encalada |
| **Shopping cart** | `GET /api/cart/:username` · `POST /api/cart/:username/items` · `PATCH` / `DELETE /api/cart/:username/items/:isbn` · `DELETE /api/cart/:username/items` | Mateo Garcia |
| **Rating & commenting** | `POST` / `GET /api/books/:bookId/rating` · `POST` / `GET /api/books/:bookId/comments` | Michael Duran |
| **Wishlists** | `POST /api/wishlists` · `GET /api/wishlists/:username/:name` · `POST` / `DELETE …/books/:isbn` · `DELETE …/books/:isbn/move-to-cart` | Stephanie Garcia |

Full request/response specs with examples and error cases are in [`docs/`](docs): [Book browsing](docs/BOOK_BROWSING.md) · [Book details](docs/BOOK_DETAILS.md) · [Rating & comments](docs/BOOK_RATING.md) · [Profile management](docs/profile-management.md) · [Shopping cart](docs/MATEO_SPRINT2.md).

## My part (Manuel Diaz)

- **Repository and project setup** (Sprint 1): Express starter, MongoDB/Mongoose connection, `.env` handling, seed script pattern, and the setup guide the rest of the team used to get running on their own machines.
- **Book browsing & sorting** (Sprints 3–5), in [`routes/browsing.js`](routes/browsing.js) and documented in [`docs/BOOK_BROWSING.md`](docs/BOOK_BROWSING.md):
  - Genre listing with case-insensitive matching and author population.
  - Top-10 sellers by copies sold with a stable name tie-break.
  - Minimum-rating filter that computes per-book average and count with a MongoDB aggregation, then joins the results onto books and sorts by average.
  - Publisher-wide discount as a single `updateMany` with `$round` to two decimals, with input validation (400), unknown publisher (404) and a `204` success.
- **Three Postman collections** (16 + 17 + 34 assertions): the Sprint 5 smoke test runs all four routes in order and checks shapes, status codes and error messages, and can be run headless with Newman.

## Quick start

Requirements: Node.js 24 LTS, MongoDB Community Server running locally (`mongod`), and Postman or Newman for the tests.

```sh
git clone https://github.com/LichaWeComeThere/geektext-api.git
cd geektext-api
npm ci
cp .env.example .env          # MONGODB_URI=mongodb://127.0.0.1:27017/geektext

# load sample data (users, authors + books, ratings, carts, wishlists)
npm run seed
node seed/seedBooks.js
npm run seed:ratings
npm run seed:carts
npm run seed:wishlists

npm start                     # http://127.0.0.1:3000
```

`GET http://127.0.0.1:3000/` returns `{ "message": "Hello, GeekText!" }` when the server and database are up. The seed scripts are idempotent; re-run `node seed/seedBooks.js` to reset prices after exercising the discount endpoint.

## Testing

Each feature has a Postman collection in [`postman/`](postman). Import one into Postman and use the Collection Runner, or run it from the command line:

```sh
npx newman run postman/Manuel-Sprint5-BookBrowsing-SmokeTest.postman_collection.json
```

Collections assume freshly seeded data and a server on `127.0.0.1:3000`.

## Project structure

```
server.js          Express app: middleware, route mounting, startup
config/db.js       Mongoose connection from MONGODB_URI
models/            Author, Book, Cart, Comment, Rating, User, Wishlist schemas
routes/            One router per feature, mounted under /api
seed/, scripts/    Sample-data loaders
postman/           Postman collections per feature and sprint
docs/              Endpoint specs and sprint notes
```

## Team

| Member | Feature | Role |
| --- | --- | --- |
| Manuel Diaz | Book browsing & sorting, repo setup | Developer |
| Herlin Guirado Fuentes | Book details | Developer |
| Carlos Encalada | Profile management | Developer |
| Mateo Garcia | Shopping cart | Developer |
| Michael Duran | Book rating & commenting | Scrum Master / Developer |
| Stephanie Garcia | Wishlist management | Product Owner / Developer |

Course project; the API runs over HTTP on localhost for development only. The Sprint 1 planning record is kept in [`docs/SPRINT1_HANDOFF.md`](docs/SPRINT1_HANDOFF.md).
