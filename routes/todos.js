/*
 * All routes for Todos are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {


  router.post('/', (req, res) => {

    if(req.session.userId){
      const values = [req.session.userId, req.body.submit, 'MOVIES'];
      db.query(`
        INSERT INTO todos (user_id, description, category)
        VALUES ($1, $2, $3)
        RETURNING *;
        `, values)
        .then(data => {
          console.log(`ADDED ${JSON.stringify(data.rows)} TO TABLE TODOS}`);
        });
    } else {
      res.status(403).send(`Please login to make a task!`)
    }
    // res.send('hello');


  });



  // Get back to this after frontend functional
  // router.post('/:id/delete', (req, res) => {

  //   if (req.session.userId) {
  //   const values = [req.session.userId];

  //   db.query(`
  //   DELETE * FROM todos
  //   WHERE user_id = $1
  //   AND id =
  //   `)

  //   }

  // });

  return router;

};
