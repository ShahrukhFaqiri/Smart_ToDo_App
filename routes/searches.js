const express = require("express");
const request = require("request-promise-native");
const domainDb = require("../db/domainDb");
const router = express.Router();

module.exports = (db) => {
  /*
   * Logic for post request from todo-form on index page to add new todos
   * Make query requests to external apis for search input
   * Call function to compile needed data from api request results
   * Call function to insert new todo to DB
   * Call function to add new element to view
   */
  router.post("/", (req, res) => {
    const input = req.body.submit;
    const queries = initializeQueries(input);

    const movies = request(queries.movie).then((result) => {
      const parsedResult = JSON.parse(result).results;
      let weight = 0;

      if (parsedResult.length !== 0) {
        for (let i = 0; i < parsedResult.length; i++) {
          if (input === parsedResult[i].title) {
            weight++;
            break;
          }
        }
      }
      return weight;
    });

    const books = request(queries.book).then((result) => {
      const parsedResult = JSON.parse(result).items;
      const totalItems = JSON.parse(result).totalItems;
      let weight = 0;

      if (totalItems !== 0) {
        for (let i = 0; i < parsedResult.length; i++) {
          if (input === parsedResult[i].volumeInfo.title) {
            weight++;
            break;
          }
        }
      }
      return weight;
    });

    const restaurants = request(queries.restaurant).then((result) => {
      const parsedResult = JSON.parse(result).results;
      let weight = 0;

      if (parsedResult.length !== 0) {
        for (let i = 0; i < 3; i++) {
          if (input === parsedResult[i].name) {
            weight++;
          }
        }
      }
      return weight;
    });

    const googleSearch = request(queries.product).then((result) => {
      const parsedResult = JSON.parse(result).organic_results;
      const searchDomains = [];

      for (let i = 0; i < parsedResult.length; i++) {
        const domain = parsedResult[i].link.replace(/.+\/\/|www.|\..+/g, "");
        searchDomains.push(domain);
      }

      return searchDomains;
    });

    Promise.all([movies, books, restaurants, googleSearch]).then((result) => {
      console.log(result);
      catagorizeSearchResults();
      console.log(`hello`);
    });
  });

  const addIntoDb = (userId, input, category) => {
    const values = [userId, input, category];

    db.query(
      `
          INSERT INTO todos (user_id, description, category)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
      values
    ).then((data) => {
      console.log(`ADDED ${JSON.stringify(data.rows)} TO TABLE TODOS}`);
    });
  };

  const catagorizeSearchResults = () => {
    for (let [key, value] of Object.entries(domainDb)) {
      console.log(key, value);
    }
  };

  return router;
};

const initializeQueries = (input) => {
  const encodedInput = encodeURIComponent(input);
  const movieQuery = process.env.MOVIE_API + `${encodedInput}`;
  const bookQuery = process.env.BOOK_API + `${encodedInput}%22&langRestrict=en`;
  const restaurantQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.205,-122.911&radius=5000&type=restaurant&keyword=${input}${process.env.RESTAURANT_API}`;
  const productQuery = `https://serpapi.com/search.json?engine=google&q=${encodedInput}&api_key=${process.env.PRODUCT_API}`;

  return {
    movie: movieQuery,
    book: bookQuery,
    restaurant: restaurantQuery,
    product: productQuery,
  };
};
