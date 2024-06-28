const express = require("express");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const app = express();
const port = 9000;

// Replace the URI with your MongoDB connection string
const uri = process.env.URI;
const dbName = process.env.DB_NAME;

// Middleware to parse JSON bodies
app.use(express.json());

let client;
let db;

// Initialize database connection
async function initializeDB() {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to database");
}

// Function to generate search conditions recursively
function generateSearchConditions(obj, prefix = '') {
  let conditions = [];
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      conditions = conditions.concat(generateSearchConditions(obj[key], `${prefix}${key}.`));
    } else {
      conditions.push({ [`${prefix}${key}`]: { $regex: obj[key], $options: 'i' } });
    }
  }
  return conditions;
}

// Function to get an example document to understand the structure
async function getExampleDocument(collection) {
  const doc = await db.collection(collection).findOne();
  return doc || {};
}

// Function to search keyword in all collections
async function searchKeyword(keyword) {
  const collections = await db.listCollections().toArray();
  const searchRegex = { $regex: keyword, $options: 'i' };

  const searchPromises = collections.map(async (collection) => {
    const collectionName = collection.name;
    console.log(`Searching in collection: ${collectionName}`);
    try {
      const exampleDoc = await getExampleDocument(collectionName);
      const searchConditions = generateSearchConditions(exampleDoc, '');
      if (searchConditions.length === 0) return { collectionName, docs: [] };

      const docs = await db.collection(collectionName).find({
        $or: searchConditions
      }).toArray();

      if (docs.length > 0) {
        console.log(`Found ${docs.length} documents in collection ${collectionName}`);
      } else {
        console.log(`No documents found in collection ${collectionName}`);
      }

      return { collectionName, docs };
    } catch (error) {
      console.log(`Error searching in collection ${collectionName}: ${error.message}`);
      return { collectionName, docs: [] };
    }
  });

  const resultsArray = await Promise.all(searchPromises);

  const results = resultsArray.reduce((acc, { collectionName, docs }) => {
    if (docs.length > 0) {
      acc[collectionName] = docs;
    }
    return acc;
  }, {});

  return results;
}

// Endpoint to search keyword
app.get("/search/:keyword", async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const results = await searchKeyword(keyword);
    res.json({ count: Object.keys(results).length, results });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, async () => {
  await initializeDB(); // Initialize the DB connection before starting the server
  console.log(`Server is running on http://localhost:${port}`);
});
