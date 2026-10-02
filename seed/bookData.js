// Fake data for Feature 4 (Book Details).
// Every book, author, publisher, and ISBN here is made up for testing
// (the ISBNs have valid check digits but don't belong to real books).
//
// Built so teammates' routes have something to show:
//   - 15 books, all with different copiesSold  -> Top Sellers has more than 10 to rank
//   - 5 genres, 3 books each                   -> Books by Genre
//   - 4 publishers, 3-4 books each             -> Discount by Publisher
//   - every author has 2-3 books               -> Books by Author

const authors = [
  {
    firstName: 'Ada',
    lastName: 'Pemberton',
    biography: 'Former high school computer science teacher who now writes beginner-friendly programming books.',
    publisher: 'Byteforge Press',
  },
  {
    firstName: 'Theo',
    lastName: 'Lindqvist',
    biography: 'Full-stack developer who has shipped Java and front-end code for over fifteen years.',
    publisher: 'Lambda House',
  },
  {
    firstName: 'Marcus',
    lastName: 'Okafor',
    biography: 'Backend engineer who designs APIs for fintech startups and writes about clean HTTP design.',
    publisher: 'Null Pointer Publishing',
  },
  {
    firstName: 'Priya',
    lastName: 'Raman',
    biography: 'Data scientist and university lecturer focused on making machine learning approachable.',
    publisher: 'Circuit Lane Books',
  },
  {
    firstName: 'Lena',
    lastName: 'Vasquez',
    biography: 'Security consultant who spent a decade running penetration tests and training developers.',
    publisher: 'Null Pointer Publishing',
  },
  {
    firstName: 'Kenji',
    lastName: 'Hollis',
    biography: 'Indie game developer known for physics-based puzzle games.',
    publisher: 'Lambda House',
  },
];

// authorName must match an author's "firstName lastName" above.
// The seed script swaps it for that author's real _id.
const books = [
  // Programming
  {
    isbn: '9781736501016',
    name: 'Recursion Without Tears',
    description: 'A friendly, example-first guide to thinking recursively, from factorials to tree traversals.',
    price: 34.99,
    authorName: 'Ada Pemberton',
    genre: 'Programming',
    publisher: 'Byteforge Press',
    yearPublished: 2019,
    copiesSold: 18450,
  },
  {
    isbn: '9781736502020',
    name: 'The Patient Debugger',
    description: 'Practical habits for finding bugs methodically: reproduce, isolate, and fix them without guessing.',
    price: 39.99,
    authorName: 'Ada Pemberton',
    genre: 'Programming',
    publisher: 'Byteforge Press',
    yearPublished: 2022,
    copiesSold: 25300,
  },
  {
    isbn: '9781736503034',
    name: 'Java in the Wild',
    description: 'Modern Java for real projects, covering collections, streams, and clean object-oriented design.',
    price: 44.99,
    authorName: 'Theo Lindqvist',
    genre: 'Programming',
    publisher: 'Lambda House',
    yearPublished: 2021,
    copiesSold: 12780,
  },

  // Web Development
  {
    isbn: '9781736504048',
    name: 'REST Easy: Designing APIs People Love',
    description: 'How to design REST APIs that are predictable and pleasant to use, with clear routes, status codes, and error messages.',
    price: 42.5,
    authorName: 'Marcus Okafor',
    genre: 'Web Development',
    publisher: 'Null Pointer Publishing',
    yearPublished: 2023,
    copiesSold: 31200,
  },
  {
    isbn: '9781736505052',
    name: 'Node.js From the Ground Up',
    description: 'Build server-side JavaScript step by step, from the event loop to a working Express API backed by MongoDB.',
    price: 36.0,
    authorName: 'Marcus Okafor',
    genre: 'Web Development',
    publisher: 'Null Pointer Publishing',
    yearPublished: 2020,
    copiesSold: 21940,
  },
  {
    isbn: '9781736506066',
    name: 'CSS for Back-End Developers',
    description: 'Flexbox, Grid, and responsive layouts explained for developers who would rather be writing server code.',
    price: 29.99,
    authorName: 'Theo Lindqvist',
    genre: 'Web Development',
    publisher: 'Lambda House',
    yearPublished: 2018,
    copiesSold: 9860,
  },

  // Data Science
  {
    isbn: '9781736507070',
    name: 'Data Wrangling for the Impatient',
    description: 'Clean, reshape, and merge messy real-world datasets with Python and pandas.',
    price: 38.75,
    authorName: 'Priya Raman',
    genre: 'Data Science',
    publisher: 'Circuit Lane Books',
    yearPublished: 2021,
    copiesSold: 14620,
  },
  {
    isbn: '9781736508084',
    name: 'Machine Learning, Plainly',
    description: 'The core ideas behind machine learning models, explained with intuition first and math second.',
    price: 49.99,
    authorName: 'Priya Raman',
    genre: 'Data Science',
    publisher: 'Circuit Lane Books',
    yearPublished: 2024,
    copiesSold: 27480,
  },
  {
    isbn: '9781736509098',
    name: 'Statistics Before Coffee',
    description: 'Short, approachable chapters on probability and statistics, each readable in one sitting.',
    price: 24.99,
    authorName: 'Ada Pemberton',
    genre: 'Data Science',
    publisher: 'Byteforge Press',
    yearPublished: 2017,
    copiesSold: 7430,
  },

  // Cybersecurity
  {
    isbn: '9781736510001',
    name: 'Locks, Keys, and Hashes',
    description: 'Encryption, hashing, and password storage explained for developers who need to get them right.',
    price: 41.0,
    authorName: 'Lena Vasquez',
    genre: 'Cybersecurity',
    publisher: 'Null Pointer Publishing',
    yearPublished: 2020,
    copiesSold: 16050,
  },
  {
    isbn: '9781736511015',
    name: 'Threat Modeling for Small Teams',
    description: 'A lightweight, repeatable way for small dev teams to find security risks before attackers do.',
    price: 45.99,
    authorName: 'Lena Vasquez',
    genre: 'Cybersecurity',
    publisher: 'Byteforge Press',
    yearPublished: 2023,
    copiesSold: 8215,
  },
  {
    isbn: '9781736512029',
    name: 'The Phish Tank',
    description: 'Real-world phishing and social engineering cases, and how teams learned to spot them.',
    price: 27.5,
    authorName: 'Lena Vasquez',
    genre: 'Cybersecurity',
    publisher: 'Circuit Lane Books',
    yearPublished: 2019,
    copiesSold: 5940,
  },

  // Game Development
  {
    isbn: '9781736513033',
    name: 'Pixels and Physics',
    description: 'Build convincing 2D game physics from scratch: collisions, gravity, and movement that feels right.',
    price: 33.0,
    authorName: 'Kenji Hollis',
    genre: 'Game Development',
    publisher: 'Lambda House',
    yearPublished: 2016,
    copiesSold: 19875,
  },
  {
    isbn: '9781736514047',
    name: 'The Level Design Notebook',
    description: "A designer's field guide to pacing, player guidance, and building levels players remember.",
    price: 37.99,
    authorName: 'Kenji Hollis',
    genre: 'Game Development',
    publisher: 'Lambda House',
    yearPublished: 2022,
    copiesSold: 11330,
  },
  {
    isbn: '9781736515051',
    name: 'Shaders for Mortals',
    description: 'A gentle introduction to GPU shaders for game developers who have never written one.',
    price: 46.5,
    authorName: 'Kenji Hollis',
    genre: 'Game Development',
    publisher: 'Circuit Lane Books',
    yearPublished: 2024,
    copiesSold: 3280,
  },
];

module.exports = { authors, books };
