# GeekText API — Group 4

Sprint 1 establishes the team, feature ownership, product backlog, development tools, and repository. This starter runs one local hello-world request to verify the Node.js and Express setup. Bookstore features are planned for later sprints.

## Team and feature ownership

| Member | Feature | Sprint 1 role |
| --- | --- | --- |
| Manuel Diaz | Book Browsing and Sorting | Developer |
| Herlin Guirado Fuentes | Book Details | Developer |
| Carlos Encalada | Profile Management | Developer |
| Mateo Garcia | Shopping Cart | Developer |
| Michael Duran | Book Rating and Commenting | Scrum Master / Developer |
| Stephanie Garcia | Wishlist Management | Product Owner / Developer |

## Selected tools

- JavaScript with Node.js 24 LTS and Express 5.2.1.
- Visual Studio Code for development; Git and GitHub for source control.
- Postman as the API client. The project is a REST API and has no single-page application frontend.
- MongoDB as the planned common database, accessed by the API only. Database connectivity and feature implementation will follow in later sprints.

The final API must use HTTPS. This Sprint 1 setup check runs over HTTP on the local loopback address only.

## Database setup

GeekText uses MongoDB with Mongoose.

Create your local environment file:

```sh
cp .env.example .env
```

The default local connection is:

```text
mongodb://127.0.0.1:27017/geektext
```

Make sure MongoDB is running before starting the API.

To load the development database with fake user data:

```sh
npm run seed
```

Then start the API:

```sh
npm start
```

The seed script creates three fake users for development and testing. It can be run repeatedly without accumulating duplicate seed users.

## Local setup

Install [Node.js 24 LTS](https://nodejs.org/en/download), Git, Visual Studio Code, Postman, MongoDB Community Server, and the MongoDB Shell (`mongosh`). Then run:

```sh
git clone https://github.com/LichaWeComeThere/geektext-api.git
cd geektext-api
npm ci
npm run start
```

In Postman, send `GET http://127.0.0.1:3000/`. The expected result is `200 OK` with this JSON body:

```json
{
  "message": "Hello, GeekText!"
}
```

Stop the server with `Ctrl+C`. Each member should complete this check on their own computer before the Sprint 1 demonstration.

For the separate database installation check, start the local MongoDB service, open `mongosh`, and run `db.runCommand({ ping: 1 })`. A successful result includes `ok: 1`. The starter does not connect to or change the database.

For Sprint 1 learning, review the course's REST API Expectations material and complete the [Express Hello World](https://expressjs.com/en/starter/hello-world.html) and [GitHub Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world) tutorials. Use a personal practice repository for the GitHub tutorial.

Version references: [Node.js release status](https://nodejs.org/en/about/previous-releases) and [Express 5.2.1 release](https://github.com/expressjs/express/releases/tag/v5.2.1).
