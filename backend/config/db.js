require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool(
    process.env.DATABASE_URL ? {
        connectionString: process.env.DATABASE_URL, 
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,   
        ssl: { rejectUnauthorized: false, },
    } : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    },
    
    
);

module.exports = pool;