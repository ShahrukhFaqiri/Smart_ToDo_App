const express = require("express");
const request = require("request-promise-native");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    let description = req.body.submit;
    let category = null;
    const queries = initializeQueries(description);

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

    Promise.all([movies, books, restaurants])
      .then((result) => {
        console.log(result);
      })

  });

  const addIntoDb = (userId, description, category) => {
    const values = [userId, description, category];

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

  return router;

};

const initializeQueries = (input) => {
  let encodedInput = encodeURIComponent(input);
  let movieQuery = process.env.MOVIE_API + `${encodedInput}`;
  let bookQuery =
    process.env.BOOK_API + `${encodedInput}%22&langRestrict=en&maxResults=1`;
  let restaurantQuery =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.28,-123.12&radius=500&type=restaurant&keyword=${input}` +
    process.env.RESTAURANT_API;
  return {
    movie: movieQuery,
    book: bookQuery,
    restaurant: restaurantQuery,
  };
};

//Fetch External Apis based on User's input!

// fetchQuery(queries)
// .then((result) => {
//     console.log(`Query`, result);
//     // let resultLength = JSON.parse(result).results.length;
//     // if (resultLength > 0) {
//     //   category = "Movies";
//     // }
//     // let finalResult = { description, category };
//   })
//   // .then((data) => {
//   //   addIntoDb(req.session.userId, data.description, data.category);
//   // });
