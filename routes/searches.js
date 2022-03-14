const express = require("express");
const request = require("request-promise-native");
const router = express.Router();
const fetch = require('cross-fetch');

module.exports = (db) => {

  /*
   * Logic for post request from todo-form on index page to add new todos
   * Make query requests to external apis for search input
   * Call function to compile needed data from api request results
   * Call function to insert new todo to DB
   * Call function to add new element to view
   */
  router.post("/", (req, res) => {

    const description = req.body.submit;
    const queries = initializeQueries(description);
    let category = null;

    const movies =
      request(queries.movie)
        .then((result) => {
          let resultLength = JSON.parse(result).results.length;
          if (resultLength > 0) {
            category = "Movies";
          }
          return resultLength;
        });

    const books =
      request(queries.book)
        .then((result) => {
          let resultLength = JSON.parse(result).items.length;
          return resultLength;
        });

    const restaurants =
      request(queries.restaurant)
        .then((result) => {
          let resultLength = JSON.parse(result).results.length;
          return resultLength;
        });

    const googleSearch =
      request(queries.product)
        .then((result) => {
          let resultLength = JSON.parse(result).organic_results.length;
          return resultLength;
        })

    // Add product api request (Promise)

    Promise.all([movies, books, restaurants, googleSearch])
      .then((result) => {
        console.log(result);
      });

  });

  const addIntoDb = (userId, description, category) => {

    const values = [userId, description, category];

    db.query(`
          INSERT INTO todos (user_id, description, category)
          VALUES ($1, $2, $3)
          RETURNING *;
          `, values)
      .then((data) => {
        console.log(`ADDED ${JSON.stringify(data.rows)} TO TABLE TODOS}`);
      });

  };

  return router;

};

const initializeQueries = (input) => {

  const encodedInput = encodeURIComponent(input);
  const movieQuery = process.env.MOVIE_API + `${encodedInput}`;
  const bookQuery = process.env.BOOK_API + `${encodedInput}%22&langRestrict=en&maxResults=1`;
  const restaurantQuery =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.3,-123.1&radius=500&type=restaurant&keyword=${input}${process.env.RESTAURANT_API}`;
  const productQuery = `https://serpapi.com/search.json?engine=google&q=${encodedInput}&api_key=${process.env.PRODUCT_API}`


  return {
    movie: movieQuery,
    book: bookQuery,
    restaurant: restaurantQuery,
    product: productQuery
  };

};
