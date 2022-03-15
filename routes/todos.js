/*
 * All routes for Todos are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/display", (req, res) => {
    db.query(`SELECT * FROM todos;`).then((data) => {
      // data.rows.forEach((row) => {
      //   console.log(data.rows);
      // });
      res.send(data.rows);
    });
  });

  router.post('/delete', (req, res) => {
    db.query(`DELETE FROM todos WHERE id = $1`, [req.body.id])
      .then(() => {
        res.send('ITEM DELETED');
      });
  });

  return router;

};
