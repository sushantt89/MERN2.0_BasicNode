const mongoose = require("mongoose");
const ConnectionString =
  "mongodb+srv://sushantmaharjan89:1234567890@cluster0.xh9m9as.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function connectToDatabase() {
  await mongoose.connect(ConnectionString);
  console.log("Connected to DB successfully!");
}
module.exports = connectToDatabase;
