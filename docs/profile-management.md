Profile Management API

Overview

The Profile Management feature allows GeekText users to create a profile, retrieve their profile information, update permitted profile fields, and add a credit card to their account.

Base URL:

http://127.0.0.1:3000/api/users

1. Create User

Endpoint:

POST /api/users

Example Request:

{
  "username": "sprint5.carlos",
  "password": "Password123!",
  "firstName": "Carlos",
  "lastName": "Sprint5",
  "email": "sprint5.carlos@example.com",
  "homeAddress": "500 Sprint Five Avenue, Miami, FL"
}

Expected Responses:

201 Created - User created successfully.

400 Bad Request - Required or invalid data was provided.

409 Conflict - Username or email already exists.

The password is hashed before being stored in MongoDB.

2. Retrieve User Profile

Endpoint:

GET /api/users/:username

Example:

GET /api/users/sprint5.carlos

Expected Responses:

200 OK - User profile returned successfully.

404 Not Found - User does not exist.

The normal profile response does not expose the user's password or stored credit-card information.

3. Update User Profile

Endpoint:

PATCH /api/users/:username

Example Request:

{
  "firstName": "CarlosUpdated",
  "lastName": "Sprint5Updated",
  "homeAddress": "555 Updated Avenue, Miami, FL"
}

Expected Responses:

200 OK - Profile updated successfully.

400 Bad Request - Invalid update or attempt to modify a protected field.

404 Not Found - User does not exist.

The username and email cannot be changed through this endpoint.

4. Add Credit Card

Endpoint:

POST /api/users/:username/credit-cards

Example Request:

{
  "cardholderName": "Carlos Sprint5",
  "cardNumber": "4242424242424242",
  "expirationMonth": 12,
  "expirationYear": 2027,
  "billingAddress": "555 Updated Avenue, Miami, FL"
}

Expected Responses:

201 Created - Credit card added successfully.

400 Bad Request - Missing, invalid, or expired card information.

404 Not Found - User does not exist.

Credit-card information is associated with the specified user but is excluded from the normal profile GET response.

The card data used during development and testing is sample data only. Real payment systems should use a secure payment provider and tokenization rather than storing raw payment-card information.

Sprint 5 Smoke Test

The complete Profile Management feature was tested sequentially after integration into the shared codebase.

Test Sequence

1. POST /api/users
Created a new user.
Result: 201 Created

2. GET /api/users/sprint5.carlos
Retrieved the newly created profile.
Result: 200 OK
Confirmed password and credit-card data were not exposed.

3. PATCH /api/users/sprint5.carlos
Updated first name, last name, and home address.
Result: 200 OK

4. POST /api/users/sprint5.carlos/credit-cards
Added a sample credit card to the user.
Result: 201 Created

5. GET /api/users/sprint5.carlos
Retrieved the profile again.
Result: 200 OK
Confirmed the profile updates persisted.
Confirmed credit-card data remained hidden.

Additional Regression Checks

The following previously implemented validation behavior was also verified during Sprint 5:

Duplicate username -> 409 Conflict

Attempt to update email -> 400 Bad Request

Attempt to update username -> 400 Bad Request

Invalid credit-card number -> 400 Bad Request

Expired credit card -> 400 Bad Request

All Profile Management smoke tests passed successfully.