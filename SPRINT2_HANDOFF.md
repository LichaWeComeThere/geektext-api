# GeekText API — Group 4 Sprint 2 handoff

Updated: October 6, 2026 (morning, after Herlin's PO review and Michael's new clip)

This is the continuity record for Manuel Diaz (Sprint 2 Scrum Master) and the chat or coding agent running on his laptop. It summarizes what was done in the cloud chat during Sprint 2: the code on `main`, how to run and check it, the demo video plan and clip reviews, the state of the four Scrum documents, and what each member still owes. It is project documentation, not a course deliverable. For Sprint 1 history, read `SPRINT1_HANDOFF.md`.

## 1. Where things stand

- **Due Tuesday, October 6, by 10 pm** (instructor announcement of October 2): one team demo video (MP4, under 7 minutes, only completed stories) and the four Scrum documents. Manuel posts both in the Group 4 **Sprint 2 Deliverables** discussion on Canvas.
- **Clips are due to Manuel by Tuesday 3 pm** so he can put the video together.
- Five of six features are merged into `main` and work together on one shared MongoDB database. **Stephanie's wish list has not been pushed** (no branch or pull request as of the morning of October 6).
- **Herlin's PO review is done** (October 5): she accepted S2-01 to S2-05 as Done and S2-06 as Not done. Sprint goal: **partly achieved**. Velocity: **40 planned, 32 completed** (assuming Manuel's 8 hours).
- The four Scrum documents are drafted (latest ZIP: `Sprint2_Group4_draft_v4.zip`, kept outside the repo), with Herlin's review merged in. Yellow highlights mark what is still missing (section 8).
- Manuel's laptop now runs the API and Postman: on October 5 at about 10:50 pm, `GET /api/books/genre/Programming` returned 200 OK with the 3 Programming books.

## 2. Roles, stories, and hours

- **Product Owner:** Herlin Guirado Fuentes. **Scrum Master:** Manuel Diaz. (Sprint 1 was Stephanie as PO and Michael as SM; the roles rotate.)
- **Sprint goal:** design and seed the shared MongoDB database, and have each member build and demonstrate one GET route for their feature.

| Story | Owner | Feature | GET route | Branch / pull requests | Hours | Status |
| --- | --- | --- | --- | --- | --- | --- |
| S2-01 | Manuel Diaz (SM) | Book Browsing and Sorting | `/api/books/genre/:genre` | `sprint2/manuel-browsing`, PR #4 (merged) | 8? (not confirmed) | Merged |
| S2-02 | Carlos Encalada | Profile Management | `/api/users/:username` | `carlos/database-foundation` PR #2, `carlos/get-user-by-username` PR #7 (merged) | 6 | Merged |
| S2-03 | Herlin Guirado Fuentes (PO) | Book Details | `/api/books/isbn/:isbn` | `sprint2/herlin-book-details` PR #1, `sprint2/herlin-route-fix` PR #5 (merged) | 6 | Merged |
| S2-04 | Mateo Garcia | Shopping Cart | `/api/cart/:username` | `sprint2/mateo-cart`, PR #6 (merged) | 8 | Merged |
| S2-05 | Michael Duran | Rating and Commenting | `/api/books/:bookId/comments`, `/api/books/:bookId/rating` | `sprint2/michael-ratings`, PR #3 (merged) | 4 | Merged |
| S2-06 | Stephanie Garcia | Wish List Management | not pushed yet | expected `sprint2/stephanie-wishlist` | not given | **Not started on GitHub** |

Planned velocity is 40 hours (8 + 6 + 6 + 8 + 4 + 8). Completed velocity is 32 hours, the five stories Herlin accepted (S2-01 to S2-05). S2-06 goes back to the backlog for Sprint 3.

Note: the S2-01 commit (`5f06fa2`) was written in the cloud chat at Manuel's request, so GitHub shows its author as "Claude", not Manuel's account. Manuel opened and merged the pull request himself.

## 3. Instructor answers and team decisions

Herlin emailed the instructor the team's questions. His answers (October 4):

1. A book can be looked up by **ISBN** as the parameter. The team keeps `GET /api/books/isbn/:isbn`.
2. Cart, Rating, and Wish List can refer to a user by **username or user ID**; both are fine. Profile and Cart use the username; Rating and Comment store MongoDB `_id`s.
3. Wish-list names must be **unique for each user**, not across all users. Each user can have at most 3 wish lists.

Team decisions:

- "Books with rating x and higher" will use the **average calculated from the Rating collection**, as Michael's `/rating` route does. Confirmed by Herlin as PO (October 5).
- The **CreditCard** model is planned for **Sprint 3** (Carlos confirmed it is his next work).

From the October 2 announcement: Sprint 2 may show the database, a model, or code if an endpoint is not ready, but finished routes should be shown working in Postman.

## 4. The code on `main`

`main` is at `68fe00d` (merge of PR #7). Stack: Node 24, Express 5.2.1, Mongoose 9, dotenv, bcryptjs. MongoDB runs locally only (no Atlas).

| File | Purpose |
| --- | --- |
| `config/db.js` | Shared MongoDB connection (Carlos). Uses `MONGODB_URI` from `.env`. |
| `models/User.js` | Users; passwords hashed with bcrypt and never returned. |
| `models/Author.js`, `models/Book.js` | Authors and books (Herlin). |
| `models/Cart.js` | One cart per user; items reference books (Mateo). |
| `models/Rating.js`, `models/Comment.js` | Ratings 1–5 and comments with timestamps (Michael). |
| `routes/browsing.js` | Genre route (Manuel). |
| `routes/bookDetails.js`, `routes/users.js`, `routes/cart.js`, `routes/ratings.js` | The other GET routes. |
| `scripts/seed.js`, `seed/seedBooks.js`, `seed/ratings.js`, `seed/carts.js` | Fake data. |
| `docs/MATEO_SPRINT2.md`, `postman/Mateo-Sprint2-Cart.postman_collection.json` | Mateo's notes and Postman collection. |

`server.js` mounts the routes under `/api/books` (ratings, browsing, book details), `/api/cart`, and `/api/users`, and listens on `http://127.0.0.1:3000`.

**Fake data after seeding:** 3 users (`alice.reader`, `bob.books`, `charlie.tech`); 6 authors and 15 books, 3 in each of 5 genres (Programming, Web Development, Data Science, Cybersecurity, Game Development), from 4 publishers; 20 ratings and 12 comments; 3 carts (Charlie's is empty).

**Seed order matters** (ratings and carts point to existing users and books):

```sh
npm run seed              # users
node seed/seedBooks.js    # authors and books
npm run seed:ratings      # ratings and comments
npm run seed:carts        # carts
```

If `npm run seed` is run again later, run all four again, because the user IDs change.

## 5. Running it on Manuel's laptop (macOS)

The laptop was set up on October 5 (Node, MongoDB, and Postman installed; repo cloned). To start again:

1. Start MongoDB (for a Homebrew install: `brew services start mongodb-community`). An older Sprint 1 setup may also exist under `~/Downloads/Sprint 1/.setup` with `start-mongodb.sh`.
2. In the repo: `git checkout main && git pull && npm install`. If there is no `.env`: `cp .env.example .env` (it contains `MONGODB_URI=mongodb://127.0.0.1:27017/geektext`).
3. Run the four seeds in the order above.
4. `npm start`, then use Postman (no Postman account is needed).

Before changing anything, check `git status`; do not discard local changes.

## 6. Expected results (quick check)

| Request | Expected |
| --- | --- |
| `GET /api/books/genre/Programming` | 200, 3 books sorted by name: Java in the Wild, Recursion Without Tears, The Patient Debugger, each with its author. Case does not matter. |
| `GET /api/books/genre/Poetry` | 200, `[]` |
| `GET /api/books/isbn/9781736504048` | 200, *REST Easy: Designing APIs People Love*, $42.50, Web Development, author Marcus Okafor |
| `GET /api/books/isbn/9780000000000` | 404 |
| `GET /api/users/alice.reader` | 200, Alice's username, name, email, home address, and no password |
| `GET /api/users/nobody` | 404 |
| `GET /api/cart/alice.reader` | 200, 2 × Recursion Without Tears + 1 × The Patient Debugger, 3 books, subtotal 109.97 |
| `GET /api/cart/charlie.tech` | 200, empty cart, subtotal 0 |
| `GET /api/books/<bookId>/comments` | 200, that book's comments, newest first, with dates. Get a `bookId` from the ISBN route, for example ISBN 9781736501016 (Recursion Without Tears). |
| `GET /api/books/<bookId>/rating` | 200, average rating and rating count. A bad ID gives 400 `Invalid bookId`. |

Herlin tested the book details, genre, comments, and rating routes on `main` on a fresh setup on Saturday, October 3, and they worked on the first try.

## 7. Demo video

One team video, under 7 minutes, in this order. Each member records their own clip (mic on, Postman zoomed in, no private windows), and Manuel combines them in iMovie (File → Share → File → MP4). The full script is `Sprint2_Demo_Script.docx` (in the ZIP).

| # | Who | Shows | Clip status |
| --- | --- | --- | --- |
| 1 | Herlin (PO) | Intro + `GET /api/books/isbn/9781736504048` (under 1:15) | Pending |
| 2 | Carlos | `GET /api/users/alice.reader` | **Received and checked**: 46.5 sec, follows the script (200, profile, no password). Skipped the optional 404, which is fine. |
| 3 | Manuel | `GET /api/books/genre/Programming` | **Recorded October 5, 10:53 pm**, follows the script. Original 1:11; the cloud chat cut 18 seconds of silence (0:48–1:05) to make a **49.5-second trimmed MP4**. Use the trimmed version. |
| 4 | Mateo | `GET /api/cart/alice.reader` | Pending |
| 5 | Michael | `/comments` and `/rating` for one book | **New clip received October 6 (53 sec), good to use.** It has audio, runs both routes in the browser (2 comments with dates; average 4.75 from 4 ratings; an invalid ID gives "Invalid bookId"; a book with no ratings gives null and 0). He explains in his own words instead of reading the script, and the first ~10 seconds show the Comment and Rating models. His first clip (no audio, 1:47) is replaced. |
| 6 | Stephanie | Her wish-list GET, or the Wishlist model / data in Compass if the route isn't ready | Pending. S2-06 was not accepted, and the Review says only accepted stories are shown, so Manuel and Herlin need to decide whether her part goes in the video (Sprint 2 allows showing a model or data when a route isn't ready). |
| 7 | Manuel | Wrap-up slide: stories done, sprint goal, hours | Record Tuesday, after Herlin's PO review |

**Manuel's part 3 script:**

- Say: "I'm Manuel, the Scrum Master this sprint, and I own Book Browsing and Sorting. This route lets a shopper see all the books in a genre."
- Show `GET http://127.0.0.1:3000/api/books/genre/Programming` → Send.
- Say: "It returns 200 with the 3 Programming books: Java in the Wild, Recursion Without Tears, and The Patient Debugger, sorted by name, with each book's author. Upper or lower case in the genre doesn't matter." Optional: `/genre/Poetry` returns an empty list. End with "That's Book Browsing."

**Manuel's part 7 (wrap-up) script:** "To wrap up Sprint 2: we completed 5 of 6 stories: Book Browsing, Profile Management, Book Details, Shopping Cart, and Rating and Commenting. The wish list story moves to Sprint 3. Our sprint goal, designing and seeding the shared database and building a GET route for each feature, was partly achieved. We planned 40 hours and completed 32. Thanks for watching." 

When checking a clip: confirm it has audio, follows the member's part of the script, shows the route working (200 and the data), is under about 50 seconds, and shows no private windows.

## 8. The four Scrum documents

The documents are generated in the cloud chat from the Sprint 1 templates (same styles, header, and footer). The latest package is `Sprint2_Group4_draft_v4.zip` with `TeamPlanning.docx`, `TeamStandup.docx`, `TeamReview.docx`, `TeamRetro.docx`, and `Sprint2_Demo_Script.docx`. They are not stored in the repo (the course does not require it). Keep editing them in the cloud chat (which has the generator) or by hand in Word; do not rebuild them from scratch here.

**Already filled:** roles, stories, routes, branches and pull requests, test cases, the database collections and owners, the instructor's answers, hours and AI-use sentences for Carlos, Herlin, Mateo, and Michael, standup and retro answers from Carlos, Herlin, Mateo, and Michael, the Sprint 1 action-item follow-up, the confirmed Sprint 2 action items, the clip results for Carlos, Manuel, and Michael, and Herlin's PO review (accepted stories, PASS results with what she tested, velocity 40 planned / 32 completed, sprint goal partly achieved, the confirmed rating decision, and her updated AI sentence). Herlin edited the v3 documents herself; her changes were merged into v4, keeping the newer fixes.

**Still missing (yellow):**

- Stephanie: wish-list details (route, number of seeded lists), hours, AI sentence, standup and retro answers.
- Manuel: hours, OK on his AI sentence, standup and retro answers.
- One sentence per remaining clip (Herlin, Mateo) on what it showed, plus the final video length and posting date.
- Standup 1 "next work" for Carlos, Mateo, Michael, and both Standup entries for Stephanie.
- Meeting labels: change "by group chat" to the October 5 Discord meeting once Manuel shares his notes.

**Retro action items (confirmed by Michael, October 5):**

| Item | Owner | Due |
| --- | --- | --- |
| Write the team's shared conventions (the `/api` prefix, branch names, the database connection, seed order) in the README | Michael Duran | October 9, 2026 |
| Run the seeds and test the route locally, and post a test URL in each pull request before it is merged | All members | Every Sprint 3 pull request |
| Open pull requests at least 3 days before the sprint ends | All members | 3 days before Sprint 3 ends |
| Post one checklist of what each member submits and how to open a pull request | Sprint 3 Scrum Master | First day of Sprint 3 |

**Sprint 1 action items follow-up:** keeping evidence together — Done (by Manuel, `SPRINT1_HANDOFF.md`); archiving the Sprint 1 records — Done (Michael posted them in the Sprint 1 discussion); database scope and ERD — Partly done (scope set in Sprint 2 planning and PR #2; no ERD made); meeting schedule and story IDs — Partly done (Manuel shared the schedule; story IDs only used in PR #4).

## 9. Who still owes what

| Member | Still owes |
| --- | --- |
| Herlin | Clip (intro + ISBN). PO review is done. |
| Carlos | Nothing — all done |
| Mateo | Clip (cart) |
| Michael | Nothing — new clip received |
| Stephanie | Wish-list code pushed as a pull request; route, hours, AI sentence; clip; standup and retro answers |
| Manuel | Hours and AI sentence; standup and retro answers; wrap-up clip (Tuesday); combine the video; post the video and four documents by Tuesday 10 pm |

A standup and retrospective meeting was set for Monday, October 5, at 8:15 pm on Discord. Only Stephanie and Manuel still needed to answer the questions there; the others answered by message.

## 10. Working with Manuel

- Keep explanations short and simple. Messages for the team group chat should sound like a student: casual, lowercase.
- Do not change code, commit, push, or merge pull requests unless Manuel asks.
- Never put anyone's email address or phone number in documents, messages, or commits.
- When Stephanie opens her pull request, check it runs with the seeds and returns the right data before Manuel merges it.
- UML diagrams (use case, sequence, class diagram for each feature) are due October 26 and are not part of Sprint 2.
