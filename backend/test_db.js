const pool = require("./db");

async function testDB() {
    try {
       const res = await pool.query("SELECT NOW()");
       console.log("Conection succesful", res.rows[0]);
    } catch (error) {
        console.error("Error conecting db", error);
    }
}


testDB();