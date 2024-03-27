const express = require('express');
const app = express();
const oracledb = require('oracledb');
const path = require('path');

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '../../build')));

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

      // console.log(result.rows);
      // await conn.close();
      return result.rows; // now need to have it close the connection somehow


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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.get('/api/test', async (req, res) => {
  res.json({ message: 'Hello from the server!' });
})

async function run() {
  let connection;

  try {
    // connection = await oracledb.getConnection(config);

    const movieData = await getMovie(1000001);
    console.log('Movie data fetched:\n', movieData);
    // await conn.close();
    // const result = await connection.execute(
    //   `SELECT * FROM Movies WHERE id = :id`,
    //   [1000001]
    // );

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