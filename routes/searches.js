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
        for (let i = 0; i < parsedResult.length; i++) {

          const cleanResult =
            parsedResult[i].name
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
              .replace(/\s+/g, " ")
              .toLowerCase();

          const cleanInput =
            input
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
              .replace(/\s+/g, " ")
              .toLowerCase();

          if (cleanResult === cleanInput) {
            weight++;
          };
        };
      };
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
      const searchResults = result[3];
      const searchHits = catagorizeSearchResults(searchResults);
      console.log('Web Search Hits', searchHits);

      const movieScore = result[0] + searchHits.movies;
      const bookScore = result[1] + searchHits.books;
      const restaurantScore = result[2] + searchHits.restaurants;
      const productScore = searchHits.products;
      let category = "";

      const scores = [movieScore, bookScore, restaurantScore, productScore];
      console.log(`Scores, Movies ${scores[0]}, Books ${scores[1]}, Restaurants ${scores[2]}, Products ${scores[3]}`);

      for (let i = 0; i < scores.length; i++) {
        let biggestScore = 0;

        if (scores[i] > biggestScore) {
          biggestScore = scores[i];

          switch (i) {
            case 0:
              category = "Movies";
              break;
            case 1:
              category = "Books";
              break;
            case 2:
              category = "Restaurants";
              break;
            case 3:
              category = "Products";
              break;
            default:
              null;
          }
        }
      }

      return addIntoDb(req.session.userId, input, category).then((data) => {
        console.log(`ADDED ${JSON.stringify(data.rows)} TO TABLE TODOS}`);
        return res.status(200).json(data.rows[0]);
      });
    });
  });

  const addIntoDb = (userId, input, category) => {
    const values = [userId, input, category];
    return db.query(
      `
          INSERT INTO todos (user_id, description, category)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
      values
    )
  };

  const catagorizeSearchResults = (searchResults) => {
    const weight = {
      movies: 0,
      books: 0,
      products: 0,
      restaurants: 0,
    };

    for (let [key, value] of Object.entries(domainDb)) {
      for (const result of searchResults) {
        if (value.includes(result)) {
          weight[key]++;
        }
      }
    }

    return weight;
  };

  return router;
};

const initializeQueries = (input) => {
  const encodedInput = encodeURIComponent(input);
  const movieQuery = process.env.MOVIE_API + `${encodedInput}`;
  const bookQuery = process.env.BOOK_API + `${encodedInput}%22&langRestrict=en`;
  const restaurantQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.205,-122.911&radius=20000&type=restaurant&keyword=${input}${process.env.RESTAURANT_API}`;
  const productQuery = `https://serpapi.com/search.json?engine=google&q=${encodedInput}&api_key=${process.env.PRODUCT_API}`;

  return {
    movie: movieQuery,
    book: bookQuery,
    restaurant: restaurantQuery,
    product: productQuery,
  };
};
