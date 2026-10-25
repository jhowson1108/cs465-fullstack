# CS-465 Full Stack Development: Travlr Getaways

Travlr Getaways is a MEAN stack travel booking site built over the course of CS-465 at SNHU. It has two sides:

- **Customer site** (`app_server`): an Express site rendered with Handlebars that shows the available trips.
- **Admin site** (`app_admin`): an Angular single-page application where a logged-in administrator can add, edit, delete and search trips.

Both sides get their data from the same REST API (`app_api`), which stores trips and users in MongoDB through Mongoose. Admin changes are protected with JWT authentication.

## Running it locally

1. Start MongoDB (8.0 LTS) on `127.0.0.1:27017`.
2. Copy `.env.example` to `.env` and set `JWT_SECRET`.
3. From the repo root: `npm install`, `node app_api/models/seed.js`, then `npm start` (customer site and API on http://localhost:3000).
4. From `app_admin`: `npm install`, then `npm start` (admin SPA on http://localhost:4200). Use the Sign Up page to create an admin account.
5. Admin unit tests: `npm test` from `app_admin`.

## API endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/register` | No | Create a user and return a JWT |
| POST | `/api/login` | No | Check credentials and return a JWT |
| GET | `/api/trips` | No | List all trips |
| POST | `/api/trips` | Bearer token | Add a trip |
| GET | `/api/trips/:tripCode` | No | Get one trip |
| PUT | `/api/trips/:tripCode` | Bearer token | Update a trip |
| DELETE | `/api/trips/:tripCode` | Bearer token | Delete a trip |

## Module Eight Journal

### Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**

The project went through three kinds of frontend. It started as plain static HTML pages served by Express out of the `public` folder, where every page was a separate file and any change to the content meant editing the HTML by hand. In Module 3 I turned the travel page into a Handlebars template (`travel.hbs`) with shared header and footer partials. The server builds the full HTML page on each request and sends it to the browser, so the browser does very little work and every click is a full page load. That is simple and good for a public-facing site that mostly displays content.

The admin side is an Angular SPA. The browser loads the app once, and after that Angular swaps components in and out on the client and only talks to the server through JSON API calls. Navigating between the trip list, the add/edit forms and the login page does not reload the page, and the UI can react right away, like the search box filtering trips as you type. The tradeoff is that the SPA is more complex to set up (TypeScript, components, services, routing, a separate dev server and CORS), and the browser does much more of the work. JavaScript runs on both sides: in Express it runs on the server to handle routes and render templates, and in Angular (as TypeScript compiled to JavaScript) it runs in the browser.

**Why did the backend use a NoSQL MongoDB database?**

MongoDB stores data as JSON-like documents, which matches how the data already moves through the rest of the stack. A trip is one document with its code, name, length, start date, resort, price, image and description, so there is no need for table joins or for translating between rows and objects. Since every layer of the MEAN stack speaks JavaScript and JSON, the data keeps the same shape from the database to the API to the browser. MongoDB's flexible schema also made it easy to start from the `trips.json` file and seed it straight into the database, and Mongoose still let me add structure and validation on top with a schema where every trip field is required.

### Functionality

**How is JSON different from JavaScript and how does JSON tie together the frontend and backend development pieces?**

JavaScript is a programming language. JSON (JavaScript Object Notation) is only a text format for data that borrows JavaScript's object syntax. JSON has no functions, variables or logic, keys must be in double quotes, and it is limited to strings, numbers, booleans, null, arrays and objects. Because it is just text, any language can read and write it.

In this project JSON is the common language between every piece. The API controllers query MongoDB and send the results back with `res.json()`. The Express customer site fetches `/api/trips` and passes the parsed JSON into the Handlebars template, and the Angular admin site gets the same JSON through `HttpClient` and maps it to the `Trip` model. Going the other way, the add and edit forms send JSON in the request body, and the login and register endpoints return a JSON object holding the JWT. Because both frontends use the same API and the same format, the backend does not need to know or care which client is calling it.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**

- **Static HTML to templates:** the travel page started with hard-coded trip listings. I replaced them with a Handlebars `{{#each}}` loop and moved the header and footer into partials, so the layout lives in one place and the page is driven by data.
- **JSON file to database:** in Module 4 the trips moved from `data/trips.json` into MongoDB with a Mongoose schema and a seed script, so the data could be changed without editing files.
- **Splitting out the API:** in Module 5 the models moved into `app_api`, and the customer site's controller was changed to call the REST API instead of querying Mongoose directly. That separated the data layer from the presentation layer and let the Angular admin site reuse the exact same endpoints.
- **Async/await and better error handling:** the API controllers use `async/await` with `try/catch` and return proper status codes (201 on create, 400 on validation errors, 404 when a trip is not found) instead of sending everything back as a 200 or 500.
- **Services and interceptors in Angular:** all HTTP calls live in `TripDataService`, and login and register share one `handleAuthAPICall` helper. A `JwtInterceptor` attaches the token to outgoing requests in one place instead of each component doing it, and an `authGuard` protects the add and edit routes.

The main reusable UI component is `TripCardComponent`. The trip listing just loops over the trips and renders one card for each, and the card handles its own edit and delete buttons and emits an event when a trip is deleted so the list can refresh. The benefits of reusable components are less duplicated code, a consistent look across the app, changes that only need to be made in one place, and pieces that are small enough to unit test on their own.

### Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**

An endpoint is a URL the API exposes, like `/api/trips` or `/api/trips/:tripCode`, and the HTTP method says what to do with it. GET retrieves data, POST creates a new record, PUT updates an existing one, and DELETE removes one. The same URL can do different things depending on the method, so each method and endpoint pair has to be tested separately. That means checking not just the success case but the failure cases too: a trip code that does not exist should return 404, a trip missing required fields should return 400, and the list endpoint should return the right data in JSON. I tested the endpoints with Postman and by watching the requests in the browser's developer tools, then checked the results in MongoDB Compass.

Security adds another layer. The GET endpoints are public so the customer site can show trips, but POST, PUT and DELETE require a valid JSON Web Token in an `Authorization: Bearer` header. Users log in through `/api/login`, where Passport checks the email and password against a salted PBKDF2 hash stored in MongoDB, and the server returns a token that expires after one hour. That makes testing harder because every protected request first needs a login call to get a token, and then the token has to be copied into the request headers. It also means testing that security actually works: requests with no header, a malformed header, or an expired or fake token should all get a 401 and never touch the database. CORS had to be set up as well so the Angular app on port 4200 was allowed to call the API on port 3000 and send the Authorization header. On the Angular side I wrote unit tests for the authentication service, the auth guard and the sign up form so the login logic is checked without having to click through it every time.

### Reflection

**How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**

This course was the first time I built a complete application from the database all the way up to two different frontends, and it gave me a much clearer picture of how the pieces of a real web app fit together. Before this, I had worked on parts of programs, but not on how a request travels from a browser through routes, controllers and a database and back again.

The skills I got the most out of were designing and building a RESTful API with Express, modeling data in MongoDB with Mongoose, and building an Angular SPA with components, services and routing. I also learned how to add authentication with Passport and JWTs, how to handle CORS, and how to test endpoints with Postman and write unit tests for the frontend. Using Git with a branch for each module also gave me practice keeping a project organized over several weeks. The MEAN stack and REST APIs are used by a lot of companies, so having a working full stack project in my portfolio that I can walk through and explain makes me a stronger candidate for software development roles.
