const mongoose = require("mongoose");

async function connectDatabase() {
    const connectionString = process.env.MONGO_URL + process.env.DATABASE_NAME;
    const response = await mongoose.connect(connectionString);
    console.log("database is connected");
}

module.exports = connectDatabase;