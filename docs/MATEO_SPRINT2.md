# Mateo's Sprint 2 shopping cart

## What this part does

`GET http://127.0.0.1:3000/api/cart/alice.reader` returns Alice's cart, including each book's ISBN, name, current price, quantity, line total, total number of copies, and subtotal. The subtotal excludes tax and shipping.

Sprint 2's group-chat requirement is a database design, fake data, and one GET route per feature. This implementation reads a cart. Add, update, delete, checkout, and authentication are future work. The username parameter is for the local development demonstration; it is not an authorization check for a deployed application.

## Database design

| Field | Meaning |
| --- | --- |
| `_id` | Cart's MongoDB ID |
| `userId` | Reference to the team's User model; one cart per user |
| `items[].bookId` | Reference to the team's Book model |
| `items[].quantity` | Positive whole number of copies |
| `createdAt`, `updatedAt` | Automatic timestamps |

Books and users are referenced by their real MongoDB IDs rather than copied into the cart. Prices and totals are calculated when the cart is retrieved. Passwords, email addresses, and home addresses are not returned.

## Start on Windows

Run commands in the GitHub repository folder, which contains `package.json` and `server.js`. Use VS Code's Terminal > New Terminal or GitHub Desktop's Repository > Open in your command-line shell.

1. Make sure the local MongoDB Community Server service is running. MongoDB Compass is a client; opening Compass alone does not start the database server. In Windows Services, find MongoDB Server and start it if it is stopped.
2. Install the project dependencies:

   ```powershell
   npm ci
   ```

3. Create `.env` only if it does not already exist:

   ```powershell
   if (!(Test-Path .env)) { Copy-Item .env.example .env }
   ```

   The team's setting is `MONGODB_URI=mongodb://127.0.0.1:27017/geektext`.

4. Load the development samples in this order, one command at a time:

   ```powershell
   npm run seed
   node seed/seedBooks.js
   npm run seed:ratings
   npm run seed:carts
   ```

   These are development seed commands. The user seed replaces the three demo users and the ratings seed replaces existing ratings/comments. The cart seed resets the three sample carts. Do not use these seed commands against a database containing real data.

   If you run `npm run seed` again, repeat the books, ratings, and carts commands in order. The user IDs change; downstream samples must point to the new users. The cart seed updates its three fixed demo cart IDs, so rerunning it also repairs their user references without accumulating duplicate carts.

5. Start the API and leave this terminal running:

   ```powershell
   npm start
   ```

   It should print `GeekText API running at http://127.0.0.1:3000`.

## Show it in Postman

Import `postman/Mateo-Sprint2-Cart.postman_collection.json`, then open the Alice request and press Send. Alternatively, create a request manually, select GET, and enter:

```text
http://127.0.0.1:3000/api/cart/alice.reader
```

There is no request body. Expected status: `200 OK`.

Alice's sample contains:

| Book | Unit price | Quantity | Line total |
| --- | ---: | ---: | ---: |
| Recursion Without Tears | 34.99 | 2 | 69.98 |
| The Patient Debugger | 39.99 | 1 | 39.99 |

Expected `totalQuantity`: **3**. Expected `subtotal`: **109.97**. MongoDB IDs will vary between computers.

Other checks:

| URL ending | Expected result |
| --- | --- |
| `/api/cart/bob.books` | One copy of Java in the Wild, subtotal 44.99 |
| `/api/cart/charlie.tech` | Empty items, totalQuantity 0, subtotal 0, 200 OK |
| `/api/cart/does-not-exist` | 404, User not found |

An existing user without a saved cart also receives an empty cart with 200 OK. A cart referencing a deleted book receives 409 rather than an incorrect subtotal. Database errors return 500.

## Put your work into GitHub

Use your existing GitHub Desktop repository. If it is not on your computer, use File > Clone repository and select `LichaWeComeThere/geektext-api`.

1. Save any existing local edits before switching branches. If GitHub Desktop shows changes you do not recognize, stop and inspect them instead of discarding them.
2. Select `main` under Current branch, click Fetch origin, and click Pull origin if offered. This brings in your teammates' merged work.
3. Under Current branch, choose New branch, name it `sprint2/mateo-cart`, and create it from the updated main.
4. Copy the downloaded `install-cart.cjs` into this repository folder beside `server.js`. Do not copy the entire downloaded project over the repository.
5. Open a terminal in the repository folder and run:

   ```powershell
   node install-cart.cjs
   ```

   The installer adds the cart files and patches only the cart import, route registration, npm script, and README section. It preserves other teammate edits. It stops if an existing cart file differs from this version. If it stops, send the exact error for help.
6. After it reports success, delete the copied `install-cart.cjs` from the repository folder; it is a delivery tool, not part of your feature.
7. Follow the startup and Postman steps above. Get Alice's 200 response before committing.
8. In GitHub Desktop, review the changed files. They should include the cart model, route, seed, Postman collection, this guide, and small changes to `server.js`, `package.json`, and `README.md`. `.env` and `node_modules` should not appear.
9. Enter this Summary: `Add Sprint 2 shopping cart model, seed data, and GET route`. Click Commit to sprint2/mateo-cart.
10. Click Publish branch, or Push origin if the branch is already published. Click Create Pull Request, keeping base `main` and compare `sprint2/mateo-cart`.
11. Use this pull request description:

    ```text
    Adds the Shopping Cart database model, three sample carts, and GET /api/cart/:username for the Sprint 2 demonstration. The route returns book details, quantities, line totals, and subtotal using the existing User and Book models.

    Setup: npm run seed, node seed/seedBooks.js, npm run seed:ratings, npm run seed:carts, then npm start.

    Demo: GET http://127.0.0.1:3000/api/cart/alice.reader
    Expected: 200 OK, totalQuantity 3, subtotal 109.97.
    ```

12. Share the PR link and your working example URL with the group. Follow the group's review/merge process. After merging, teammates must pull main and run `npm run seed:carts` after their other seeds.

Opening a PR proposes the change; the code reaches main when the PR is merged. The delivered ZIP has not been pushed or merged automatically.

## What to say in the recording

Keep the server running, open the Alice request in Postman, and share your screen. Say:

> My feature is Shopping Cart. This GET request lets a shopper see the books in their cart, each book's quantity and price, and the subtotal.

Click Send, point to 200 OK and the items, then say:

> This sample cart has two different books and three copies total. The subtotal is 109.97.

Practice until you can explain why quantity two makes the first line total 69.98. The group's message asks for working Postman output, with about one minute per feature, rather than a code walkthrough.

## Information for Manuel's sprint documents

- Feature: Shopping Cart.
- Data: Cart with userId, items containing bookId and quantity, and automatic timestamps.
- Fake data: Alice with two book entries, Bob with one, Charlie with an empty cart.
- GET route: `/api/cart/:username`.
- Working example: `/api/cart/alice.reader`.
- Hours: report your actual hours; do not claim an invented number.
- Blockers/status: report whether the feature is running on your laptop and whether your PR is merged.

The screenshots mention four team documents but do not show their titles or full rubric. This guide supplies your feature details; it does not establish that every team submission requirement is complete.
