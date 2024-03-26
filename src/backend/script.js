const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const config = {
    user: 'jeremymartin',
    password: '5l5MkBXtir5rcdiFaSl5tsXX',
    connectString: 'oracle.cise.ufl.edu:1521/orcl'
  };

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