Smart Todo Project
Contributors:
[Connor Mullin] (https://github.com/CJM1994)
[Sha Faqiri] (https://github.com/ShahrukhFaqiri)
[Manuel Zuniga] (https://github.com/Nachosonfriday)

=========

Smart Todo is an API-based single-page todo app. It was used to practice our HTML, CSS, JS, jQuery and AJAX front-end skills, and our NodeJS, SQL, and Express back-end skills.

It uses 4 different API's to search and categorize user inputs into preset categories on the page. The user is able to login or register, edit their name, and move items between categories. It stores the user's entries in to a database that can be retrieved afterwards. 

=========

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:3000/`

=========

## Dependencies

- body-parser 
- cookie-session
- ejs
- express
- pg
- request
- request-promise-native
