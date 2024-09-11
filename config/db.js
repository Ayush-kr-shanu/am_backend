const mongoose = require("mongoose");
const config = require("./config");

const dbConnection = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Databse!");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = dbConnection;
