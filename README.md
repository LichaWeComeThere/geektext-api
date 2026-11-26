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

## Who built what

Each feature was one person's responsibility from model to tests. The Postman collections in [`postman/`](postman) are named by owner and sprint.

### Manuel Diaz — Book browsing & sorting, repository setup

- Sprint 1: created the repository and the Express starter (`server.js`, `package.json`, the hello-world check), wrote the setup guide the team used to get running, and kept the sprint planning record.
- [`routes/browsing.js`](routes/browsing.js), spec in [`docs/BOOK_BROWSING.md`](docs/BOOK_BROWSING.md):
  - Genre listing with case-insensitive matching and author population.
  - Top-10 sellers by copies sold with a stable name tie-break.
  - Minimum-rating filter that computes per-book average and count with a MongoDB aggregation, joins the results onto books, and sorts by average.
  - Publisher-wide discount as a single `updateMany` with an update pipeline and `$round` to two decimals, case-insensitive publisher match via collation, with 400 / 404 / 204 responses.
- Three Postman collections (16 + 17 + 34 assertions); the Sprint 5 smoke test covers all four routes and runs headless with Newman.

### Herlin Guirado Fuentes — Book details

- [`models/Book.js`](models/Book.js) and [`models/Author.js`](models/Author.js): the book and author schemas the whole API shares, plus the [`seed/seedBooks.js`](seed/seedBooks.js) loader and sample catalog.
- [`routes/bookDetails.js`](routes/bookDetails.js) and [`routes/authors.js`](routes/authors.js): create a book (required-field and type validation, 409 on duplicate ISBN), create an author (409 on duplicate name), look up a book by ISBN and list books by author, each with the author's name populated.
- Three Postman collections (Sprints 3–5). Spec in [`docs/BOOK_DETAILS.md`](docs/BOOK_DETAILS.md).

### Carlos Encalada — Profile management, database setup

- Sprint 2: the MongoDB connection ([`config/db.js`](config/db.js)), `.env.example` and `dotenv` wiring, and the first seed script ([`scripts/seed.js`](scripts/seed.js)) that the other loaders followed.
- [`models/User.js`](models/User.js): user schema with a bcrypt pre-save hook (passwords are never stored in plain text) and an embedded credit-card subdocument.
- [`routes/users.js`](routes/users.js): create a user (409 on duplicate username), fetch and update a profile, add a credit card, with field validation on every write. Spec in [`docs/profile-management.md`](docs/profile-management.md).

### Mateo Garcia — Shopping cart

- [`models/Cart.js`](models/Cart.js) and [`seed/carts.js`](seed/carts.js).
- [`routes/cart.js`](routes/cart.js): view a cart with per-line and overall totals computed in integer cents (and a 409 if a book in the cart has since been deleted, instead of a wrong subtotal), add an item, change quantity, remove an item, empty the cart.
- Postman collection for Sprint 2. Spec in [`docs/MATEO_SPRINT2.md`](docs/MATEO_SPRINT2.md).

### Michael Duran — Book rating & commenting (Scrum Master)

- [`models/Rating.js`](models/Rating.js), [`models/Comment.js`](models/Comment.js) and [`seed/ratings.js`](seed/ratings.js).
- [`routes/ratings.js`](routes/ratings.js): rate a book 1–5 (one rating per user per book; rating again replaces the old one), comment on a book (1–1000 characters), list comments newest first, and a per-book average computed with an aggregation. Shared middleware validates the book id and checks that both user and book exist.
- Four Postman collections (Sprints 2–5). Spec in [`docs/BOOK_RATING.md`](docs/BOOK_RATING.md).

### Stephanie Garcia — Wishlist management (Product Owner)

- [`models/Wishlist.js`](models/Wishlist.js) and [`seed/wishlists.js`](seed/wishlists.js).
- [`routes/wishlists.js`](routes/wishlists.js): create a wishlist (max three per user, unique names), view one with book details populated, add and remove books, and move a book from a wishlist into the user's cart in one request, creating the cart if the user has none.
- As Product Owner, ran acceptance for each sprint.

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
| Manuel Diaz | Book browsing & sorting, repository setup | Developer |
| Herlin Guirado Fuentes | Book details | Developer |
| Carlos Encalada | Profile management, database setup | Developer |
| Mateo Garcia | Shopping cart | Developer |
| Michael Duran | Book rating & commenting | Scrum Master / Developer |
| Stephanie Garcia | Wishlist management | Product Owner / Developer |

Course project; the API runs over HTTP on localhost for development only. The Sprint 1 planning record is kept in [`docs/SPRINT1_HANDOFF.md`](docs/SPRINT1_HANDOFF.md).
