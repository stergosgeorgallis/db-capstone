import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const OMDB_API_KEY = process.env.OMDB_API_KEY;


app.get("/", async (req, res) => {
  const sortBy = req.query.sort || "date_added";
  let orderBy = "date_added DESC"; 
  if (sortBy === "rating") {
    orderBy = "rating DESC"; 
  } else if (sortBy === "title") {
    orderBy = "title ASC"; 
  }

  try {
    const result = await db.query(`SELECT * FROM movies ORDER BY ${orderBy}`);
    
    //EJS sent 
    res.render("index.ejs", { 
      movies: result.rows, 
      currentSort: sortBy 
    });
  } catch (err) {
    console.error("Error fetching movies from database:", err);
    res.status(500).send("Server Error");
  }
});


app.post("/add", async (req, res) => {
  const { title, rating, review } = req.body;

  try {
    
    const apiResponse = await axios.get(
      `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`
    );

    const posterUrl = (apiResponse.data.Poster && apiResponse.data.Poster !== "N/A")
      ? apiResponse.data.Poster
      : "https://via.placeholder.com/300x450?text=No+Poster+Available";

    const releaseYear = apiResponse.data.Year || "N/A";
    const movieTitle = apiResponse.data.Title || title;

    


    await db.query(
      "INSERT INTO movies (title, release_year, rating, review, poster_url) VALUES ($1, $2, $3, $4, $5)",
      [movieTitle, releaseYear, rating, review, posterUrl]
    );

    
    res.redirect("/");
  } catch (err) {
    console.error("Error adding new movie:", err);
    res.redirect("/");
  }
});


app.post("/edit", async (req, res) => {
  const { id, rating, review } = req.body;

  try {
    await db.query(
      "UPDATE movies SET rating = $1, review = $2 WHERE id = $3",
      [rating, review, id]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error updating movie:", err);
    res.redirect("/");
  }
});


app.post("/delete", async (req, res) => {
  const { id } = req.body;

  try {
    await db.query("DELETE FROM movies WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.redirect("/");
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

