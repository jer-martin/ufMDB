const express = require('express');
const app = express();
const oracledb = require('oracledb');
const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});


const config = {
    user: 'jeremymartin',
    password: '5l5MkBXtir5rcdiFaSl5tsXX',
    connectString: 'oracle.cise.ufl.edu:1521/orcl'
  };

const getDiversity = async (genre) => {
  console.log('executing getDiversity with genre:', genre);
  let conn;
  try {
    conn = await oracledb.getConnection(config);

    const sql = `
      WITH ReleaseCounts AS (
        SELECT
            m.id AS movie_id,
            COUNT(r.id) AS num_releases,
            r.rdate as releasedate
        FROM
            jeremymartin.movies m
        JOIN jeremymartin.releases r ON r.id = m.id
        GROUP BY
            m.id, r.rdate
      )
      SELECT 
          year,
          AVG(num_languages) AS avg_num_languages,
          AVG(rating) AS avg_rating,
          gen
      FROM 
          (SELECT 
              m.id,
              m.year,
              m.rating,
              COUNT(DISTINCT l.language) AS num_languages,
              g.genre AS gen
          FROM 
              jeremymartin.movies m
          JOIN 
              jeremymartin.languages l ON m.id = l.id
          JOIN
              jeremymartin.genres g ON g.id = m.id
          JOIN 
              ReleaseCounts RC ON RC.movie_id = m.id
          WHERE 
              g.genre = :genre
          GROUP BY 
              m.id, m.year, m.rating, g.genre)
      WHERE
          year > 1940 AND year < 2023 AND
          rating IS NOT NULL
      GROUP BY 
          year, gen
      ORDER BY 
          year`;

    const result = await conn.execute(sql, [genre], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows.map(row => ({
      year: row.YEAR,
      avgNumLanguages: row.AVG_NUM_LANGUAGES,
      avgRating: row.AVG_RATING,
      genre: row.GEN
    }));
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

const getGenreComplexities = async (genre) => {
  // console.log('executing getGenreComplexities with genre:', genre);
  let conn;
  try {
    conn = await oracledb.getConnection(config);

    const sql = `
      WITH mgt(id, name, m_cplx, genre, theme_count, rating, rdate, genre_count, rn) AS (
        SELECT m.id, m.name, (t.tc * (m.rating / 5)), g.genre, t.tc, m.rating, r.rdate, gc.gc,
        ROW_NUMBER() OVER (PARTITION BY g.genre ORDER BY r.rdate DESC) AS rn
        FROM jeremymartin.movies m 
        JOIN (
            SELECT DISTINCT id, MIN(rdate) AS rdate
            FROM jeremymartin.releases 
            GROUP BY id
        ) r ON m.id = r.id
        JOIN (
            SELECT DISTINCT id, genre
            FROM jeremymartin.genres 
            GROUP BY id, genre
        ) g ON m.id = g.id
        JOIN (
            SELECT  id, COUNT(DISTINCT theme) AS tc
            FROM jeremymartin.themes
            GROUP BY id
        ) t on m.id = t.id
        JOIN (
            SELECT id, COUNT(DISTINCT genre) AS gc
            FROM jeremymartin.genres 
            GROUP BY id
        ) gc ON m.id = gc.id
        WHERE m.rating IS NOT NULL AND t.tc IS NOT NULL
    ), 
    ema (name, rdate, genre, m_cplx, rn, g_cplx) AS (
        SELECT name, rdate, genre, m_cplx, rn, m_cplx 
        FROM mgt
        WHERE rn = 1
        UNION ALL
        SELECT m.name, m.rdate, m.genre, m.m_cplx, m.rn, 
        (2/m.rn)*(m.m_cplx - e.g_cplx) + e.g_cplx 
        FROM mgt m, ema e 
        WHERE m.rn = e.rn + 1 AND m.genre = e.genre
    )
    SELECT name, rdate, genre, m_cplx, g_cplx
    FROM ema
    WHERE genre = :genre
    ORDER BY rdate DESC
          `;

    const result = await conn.execute(sql, [genre], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    // console.log('Result:', result);
    return result.rows.map(row => ({
      genre: row.GENRE,
      rdate: row.RDATE,
      movie: row.NAME,
      movie_complexity: row.M_CPLX,
      genre_complexity: row.G_CPLX
    }));
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

const getGenreMarketShareByCountry = async (genre, country) => {
  let conn;
  try {
    conn = await oracledb.getConnection(config);

    const sql = `
      WITH
      ranked_genres_per_country AS (
        SELECT
          Country,
          Genre,
          yor,
          COUNT(*) AS num_movies_in_genre_for_year
        FROM (
          SELECT DISTINCT
            g.ID,
            r.Country,
            g.genre,
            EXTRACT(YEAR FROM r.rdate) AS yor
          FROM jeremymartin.genres g
          JOIN jeremymartin.releases r ON r.id = g.id
          WHERE g.genre = :genre AND r.Country = :country
        )
        GROUP BY Country, Genre, yor
      ),
      totalMoviesPerCountry AS (
        SELECT
          Country,
          yor,
          COUNT(*) AS TotalMoviesForYear
        FROM (
          SELECT DISTINCT
            r.Country,
            r.ID,
            EXTRACT(YEAR FROM r.rdate) AS yor
          FROM jeremymartin.releases r
          WHERE r.Country = :country
        )
        GROUP BY Country, yor
      )
      SELECT
        rg.Country,
        rg.Genre,
        rg.yor AS "Year of Release",
        rg.num_movies_in_genre_for_year AS "Number of Movies in Genre",
        tmc.TotalMoviesForYear AS "Total Movies in Country",
        ROUND(100 * rg.num_movies_in_genre_for_year / tmc.TotalMoviesForYear, 2) AS "Genre Percentage"
      FROM ranked_genres_per_country rg
      JOIN totalMoviesPerCountry tmc ON rg.Country = tmc.Country AND rg.yor = tmc.yor
      WHERE rg.Genre = :genre AND rg.Country = :country
      ORDER BY rg.Country, rg.Genre, rg.yor
    `;

    const result = await conn.execute(sql, { genre, country }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows.map(row => ({
      country: row.Country,
      genre: row.Genre,
      yearOfRelease: row['Year of Release'],
      moviesInGenre: row['Number of Movies in Genre'],
      totalMovies: row['Total Movies in Country'],
      genreMarketShare: row['Genre Percentage']
    }));
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

app.get('/get-average-role-percentage/:roleName', async (req, res) => {
  const { roleName } = req.params;

  let conn;
  try {
    conn = await oracledb.getConnection(config);

    const sql = `
      SELECT AVG(role_percentage) AS average_role_percentage
      FROM (
        SELECT
          100.0 * COUNT(CASE WHEN c.role = :roleName THEN 1 END) / NULLIF(COUNT(*), 0) AS role_percentage
        FROM crew c
        GROUP BY c.id
      )`;

    const result = await conn.execute(sql, [roleName], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    // console.log('Result:', result);
    if (result.rows.length > 0) {
      // Directly send percentages as top-level array of single values
      const percentages = result.rows.map(row => row.AVERAGE_ROLE_PERCENTAGE || 0); // Ensuring no undefined values
      res.json(percentages); // Send as an object for clearer structure
    } else {
      res.status(404).send('No data found');
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    if (conn) {
      await conn.close();
    }
  }
});


// this is literally just getting popularity
app.get('/get-movie-popularity/:movieId', async (req, res) => {
  const { movieId } = req.params;
  // const movieId = 1000001;

  let conn;
  try {
    conn = await oracledb.getConnection(config);

    const sql = `
    SELECT 
    movie_id,
    movie_name,
    popularity
    FROM (
        SELECT 
            m.id AS movie_id,
            m.name AS movie_name,
            (COUNT(r.id) + (2 * m.rating)) AS popularity
        FROM 
            movies m
        LEFT JOIN 
            releases r ON m.id = r.id
        GROUP BY 
            m.id, m.name, m.rating
    ) t
    WHERE
        popularity IS NOT NULL
        AND movie_id = :movieId
    ORDER BY
        popularity DESC`;

        console.log("Executing SQL:", sql);
        console.log("With parameters:", { movieId });

    const result = await conn.execute(sql, [movieId], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    // console.log('Result:', result);
    if (result.rows.length > 0) {
      const moviePopularity = result.rows.map(row => ({
        movieId: row.MOVIE_ID,  // Accessing the MOVIE_ID property
        movieName: row.MOVIE_NAME,  // Accessing the MOVIE_NAME property
        popularity: ((row.POPULARITY - 3.38) / (164.7 - 3.38)) * 10  // Normalizing the POPULARITY property to be between 0 and 10
      }));
      // console.log('Movies:', moviePopularity);
      res.json(moviePopularity);  // Sending the array of movie objects
  }} catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    if (conn) {
      await conn.close();
    }
  }
});


 
  
app.get('/get-movie/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    const movieData = await getMovie(movieId);
    res.json(movieData); // Send the movie data back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-barbie', async (req, res) => {
  console.log('r')
  // const { movieId } = req.params.movieId;

  try {
    const movieData = await getMovie(1000001);
    res.json(movieData); // Send the movie data back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/test', async (req, res) => {
  res.json({ message: 'Hello from the server!' });
})


// here are the important queries

// vedic first

app.get('/get-diversity/:genre', async (req, res) => {
  console.log('req.params:', req.params);
  const { genre } = req.params;
  console.log('genre:', genre);

  try {
    const diversityData = await getDiversity(genre);
    res.json(diversityData); // Send the movie data back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-genre-complexity/:genre', async (req, res) => {
  console.log('req.params:', req.params);
  const { genre } = req.params;
  // console.log('genre:', genre);

  try {
    const GCData = await getGenreComplexities(genre);
    // console.log('GCData:', GCData);
    res.json(GCData); // Send the movie data back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-market-share/:genre/:country', async (req, res) => {
  console.log('req.params:', req.params);
  const { genre, country } = req.params;
  // console.log('genre:', genre);

  try {
    const GMData = await getGenreMarketShareByCountry(genre, country);
    // console.log('GMData:', GMData);
    res.json(GMData); // Send the movie data back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DO NOT MOVE THIS. DO NOT PUT ANY OTHER ROUTES BELOW THIS, IT WILL BREAK THE WHOLE THING
app.use(express.static(path.join(__dirname, '../../build')));       
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});


async function run() {
  let connection;

  try {
    // connection = await oracledb.getConnection(config);

    // await conn.close();
    // const result = await connection.execute(
    //   `SELECT * FROM Movies WHERE id = :id`,
    //   [1000001]
    // );
    // const result = await getDiversity('Action');
    // console.log(result);

    // console.log(result.rows);

  } catch (err) {
    console.error('Caught an error!' , err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

run();