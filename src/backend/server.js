const express = require('express');
const app = express();
const oracledb = require('oracledb');

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const config = {
    user: 'jeremymartin',
    password: '5l5MkBXtir5rcdiFaSl5tsXX',
    connectString: 'oracle.cise.ufl.edu:1521/orcl'
  };

  
async function getMovie (movieId) {
    let conn

    try {

      conn = await oracledb.getConnection(config);

      const result = await conn.execute(
        `SELECT * FROM Movies WHERE id = :id`,
        [movieId]
      );

      console.log(result.rows);

    } catch (err) {
      console.error('Caught an error!' , err);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  }

  app.get('/get-movie/:movieId', async (req, res) => {
    const { movieId } = req.params;
  
    try {
      const movieData = await getMovie(movieId);
      res.json(movieData); // Send the movie data back to the frontend
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  async function run() {
    let connection;
  
    try {
      connection = await oracledb.getConnection(config);
  
      const result = await connection.execute(
        `SELECT * FROM Movies WHERE id = :id`,
        [1000001]
      );
  
      console.log(result.rows);
  
    } catch (err) {
      console.error('Caught an error!' , err);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
  
  run();