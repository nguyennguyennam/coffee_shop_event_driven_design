const { Pool } = require("pg");

const pool = new Pool({
  user: "neondb_owner",
  host: "ep-floral-scene-a8hcdsq3-pooler.eastus2.azure.neon.tech",
  database: "neondb",
  password: "npg_nrg0lK4kRiPb",
  port: 5432,
    ssl: {
        rejectUnauthorized: true, // Chấp nhận kết nối SSL không xác thực
    },
});

module.exports = pool;
