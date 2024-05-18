const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const url = "mongodb://localhost:27017";
const dbName = "myproject";
const client = new MongoClient(url, { connectTimeoutMS: 5000 });

app.use(cors());
app.use(bodyParser.json());

console.log("Starting server...");

client.connect(async function (err) {
  if (err) {
    console.error("Failed to connect to the database. Error:", err);
    process.exit(1); // Exit the process with an error code
  }
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  const userCollection = db.collection("users");
  const notesCollection = db.collection("notes");

  app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    // If not, create a new user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { name, email, password: hashedPassword };
    const result = await userCollection.insertOne(newUser);

    if (result.insertedCount > 0) {
      const token = jwt.sign(
        { id: result.insertedId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ message: "User registered successfully", token });
    } else {
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Route for getting all notes
  app.get("/api/notes", async (req, res) => {
    const notes = await notesCollection.find({}).toArray();
    res.json(notes);
  });

  // Route for adding a new note
  app.post("/api/notes", async (req, res) => {
    const { text } = req.body;
    const newNote = { text };
    const result = await notesCollection.insertOne(newNote);
    if (result.insertedCount > 0) {
      res.status(200).json(result.ops[0]); // Return the new note
    } else {
      res.status(500).json({ message: "Failed to add note" });
    }
  });

  // Route for deleting a note
  app.delete("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    const _id = new ObjectID(id); // Convert string ID to MongoDB ObjectID
    const result = await notesCollection.deleteOne({ _id });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Note deleted successfully" });
    } else {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
