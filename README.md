# Movie & Series db Capstone 🎬

This is my Capstone Project for the web development bootcamp. It's a simple web application that helps me keep track of the movies and TV series I watch, rate them, and write short personal reviews. 

I used the OMDb API to automatically fetch movie posters when I type a title.

## Technologies Used
- Node.js & Express.js (Using ES6 Modules)
- PostgreSQL (for the database)
- EJS, HTML, and basic CSS
- Axios (for API requests)
- Dotenv (for environment variables)

## How to run this project locally

**1. Install dependencies:**
Open your terminal in the project folder and run:
`npm install`

**2. Set up the Database:**
Open pgAdmin (or your PostgreSQL), create a new database named `movies_db`, and then run this SQL command to create the table:
```sql
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) UNIQUE NOT NULL,
    release_year VARCHAR(10),
    rating INTEGER CHECK 
    (rating >= 1 AND rating <= 10),
    review TEXT,
    poster_url VARCHAR(255),
    date_added DATE DEFAULT CURRENT_DATE
);
```

**3. Create a .env file:** 
DB_USER=postgres
DB_HOST=localhost
DB_NAME=movies_db
DB_PASSWORD=yours_postgres_password
DB_PORT=5432
OMDB_API_KEY=yours_omdb_api_key

**4. Start the app using nodemon:**
**5. Open: http://localhost:3000**
**Thank You Very Much all**
    
