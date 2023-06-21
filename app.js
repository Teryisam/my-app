const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.json());

/*------------------------------------------
--------------------------------------------
Database Connection
--------------------------------------------
--------------------------------------------*/
const conn = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "Grafana" /* MySQL User */,
  password: "grafanauseR1!" /* MySQL Password */,
  database: "node_restapi" /* MySQL Database */,
});

/*------------------------------------------
--------------------------------------------
Shows Mysql Connect
--------------------------------------------
--------------------------------------------*/
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected with App...");
});

/**
 * Get All Items
 *
 * @return response()
 */
app.get("/api/items", (req, res) => {
    try{
  let sqlQuery = "SELECT * FROM items";

  let query = conn.query(sqlQuery, (err, results) => {
    // if (err) throw err;
    if (err) {console.log(err);}
    res.json(results);
  });} catch (err) {
    console.log(err);
  }
});

/**
 * Get Single Item
 *
 * @return response()
 */
app.get("/api/items/:id", (req, res) => {
    try{
  let sqlQuery = "SELECT * FROM items WHERE id=" + req.params.id;

  let query = conn.query(sqlQuery, (err, results) => {
    // if (err) throw err;
    if (err) {console.log(err);}
    res.json(results[0]);
  });} catch (err) {
    console.log(err);
  }
});

/**
 * Get Single Item By Email
 *
 * @return response()
 */
app.get("/api/item/:email", (req, res) => {
  try {
    const { email } = req.params;
    let sqlQuery = "SELECT * FROM items WHERE email='"+email+"'";

    let query = conn.query(sqlQuery, [email], (err, results) => {
      //   if (err) throw err;
      if (err) {
        console.log(err);
      }
      res.json(results[0]);
    });
  } catch (err) {
    console.log(err);
  }
});

/**
 * Create New Item
 *
 * @return response()
 */
app.post("/api/items", (req, res) => {
    try{
  const {
    firstName,
    lastName,
    bvn,
    dateOfBirth,
    phoneNumber,
    email,
    password,
    confirmPassword,
    acctType,
  } = req.body;
  let data = {
    firstName,
    lastName,
    bvn,
    dateOfBirth,
    phoneNumber,
    email,
    password,
    confirmPassword,
    acctType,
  };

  let sqlQuery = "INSERT INTO items SET ?";

  let query = conn.query(sqlQuery, data, (err, results) => {
    // if (err) throw err;
    if (err) {console.log(err)}
    // res.send(apiResponse(results));
    let sqlQuery2 = "SELECT * FROM items WHERE firstName='"+firstName+"' AND lastName='"+lastName+"' AND bvn='"+bvn+"' AND dateOfBirth='"+dateOfBirth+"' AND phoneNumber='"+phoneNumber+"' AND email='"+email+"' AND password='"+password+"' AND confirmPassword='"+confirmPassword+"' AND acctType='"+acctType+"'";
    //   res.send(apiResponse(results));
      let query2 = conn.query(sqlQuery2, (err, results2) => {
        if (err) console.log(err);
        // res.send(apiResponse(results2));
        res.json(results2[0]);
      });
  });} catch (err) {
    console.log(err);
  }
});

/**
 * Login
 *
 * @return response()
 */
app.post("/api/items/login", (req, res) => {
    try {
  const { email, password } = req.body;
  let data = {
    email,
    password,
  };

    let sqlQuery = "SELECT * FROM items WHERE email =? AND password = ?";

    let query = conn.query(sqlQuery, [email, password], (err, results) => {
      // if (err) throw err;
      if (err) {
        console.log(err);
      }
      res.json(results[0]);
    });
  } catch (err) {
    console.log(err);
  }
});

/**
 * Update Item
 *
 * @return response()
 */
app.put("/api/items/:id", (req, res) => {
    try{
  const {
    firstName,
    lastName,
    bvn,
    dateOfBirth,
    phoneNumber,
    email,
    password,
    confirmPassword,
    acctType,
  } = req.body;
  let sqlQuery =
    "UPDATE items SET firstName=?,lastName=?,bvn=?,dateOfBirth=?,phoneNumber=?,email=?,password=?,confirmPassword=?,acctType=? WHERE id="+req.params.id;

  let query = conn.query(
    sqlQuery,
    [
      firstName,
      lastName,
      bvn,
      dateOfBirth,
      phoneNumber,
      email,
      password,
      confirmPassword,
      acctType,
    ],
    (err, results) => {
    //   if (err) throw err;
    let sqlQuery2 = "SELECT * FROM items WHERE id=" + req.params.id;
    //   res.send(apiResponse(results));
      let query2 = conn.query(sqlQuery2, (err, results2) => {
        if (err) console.log(err);
        // res.send(apiResponse(results2));
        res.json(results2[0]);
      });
    }
  );} catch (err) {
    console.log(err)
}
});

/**
 * Delete Item
 *
 * @return response()
 */
app.delete("/api/items/:id", (req, res) => {
  let sqlQuery = "DELETE FROM items WHERE id=" + req.params.id + "";

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results) {
  return JSON.stringify({ status: 200, error: null, response: results });
}

/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(3030, () => {
  console.log("Server started on port 3030...");
});
