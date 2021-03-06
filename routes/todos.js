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
    if (req.session.username) {
      db.query(`SELECT * FROM todos WHERE user_id = $1 ORDER BY timestamp ASC;`, [
        req.session.userId,
      ]).then((data) => {
        res.send(data.rows);
      });
    }
  });

  router.post("/delete", (req, res) => {
    db.query(`DELETE FROM todos WHERE id = $1`, [req.body.id]).then(() => {
      res.send("ITEM DELETED");
    });
  });

  router.post("/edit", (req, res) => {
    console.log(`in the backend here!`);
    return db
      .query(`UPDATE todos SET category = $1 WHERE id = $2 RETURNING *;`, [
        req.body.category,
        req.body.id,
      ])
      .then((data) => {
        return res.status(200).json(data.rows[0]);
      });
  });

  router.post('/check', (req, res) => {
    console.log(`IN the back we are`, req.body.complete);
    return db
    .query('SELECT complete FROM todos WHERE id = $1;', [req.body.id])
    .then((data) => {
      console.log('data val', data.rows[0].complete);
      return db
        .query('UPDATE todos SET complete = $1 WHERE id = $2 RETURNING *;', [!data.rows[0].complete, req.body.id])
        .then((data) => {
          return res.status(200).send(data.rows[0]);
        });
    });
  });

  return router;
};
