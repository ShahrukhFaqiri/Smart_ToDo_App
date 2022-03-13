const express = require("express");
const request = require("request-promise-native");
const router = express.Router();

module.exports = (db) => {
  let movieQuery = process.env.MOVIE_API;
  router.post("/", (req, res) => {
    let description = req.body.submit;
    let category = null;

    fetchMovies(movieQuery)
      .then((result) => {
        let resultLength = JSON.parse(result).results.length;
        if (resultLength > 0) {
          category = "Movies";
        }
        let finalResult = { description, category };
        return finalResult;
      })
      .then((data) => {
        addIntoDb(req.session.userId, data.description, data.category);
      });
  });

    // if (req.session.userId) {
    //   const values = [req.session.userId, description, category];
    //   // res.send('hello');
    // })

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

const fetchMovies = (movieQuery) => {
  return request(movieQuery);
};

