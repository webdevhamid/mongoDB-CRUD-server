const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// MIDDLEWARE
app.use(cors());
// JSON middleware
app.use(express.json());

// users coming from client side will be stored here
/*const users = [];
console.log(users);
*/

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://webdeveloperhamid:HB5tdfG3Nz3sJaG2@cluster0.w1xw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient instance with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // connect to the database and access it's users collection
    // const database = client.db("usersDB");
    // const usersCollection = database.collection("users");

    const usersCollection = client.db("usersDB").collection("users");
    const bookCollection = client.db("bookDB").collection("books");

    // Backend delete operation
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleted id num: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);

      res.send(result);

      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document with id", id);
      } else {
        console.log("No documents deleted!");
      }
    });

    // Backend read operation
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Backend get specific data operation
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // backend PUT operation
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(user, id);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };

      const result = await usersCollection.updateOne(filter, updatedUser, option);
      res.send(result);
    });

    // Backend POST operation
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
      // send the user which coming from client side to the users array
      /*
      user.id = users.length + 1;
      users.push(user);
      res.send(users);
    */

      // Insert the "user" document to the "usersCollection" collection
      // const result = await usersCollection.insertOne(user);

      // Send the response to the client
      // res.send(result);
    });

    // books (practice task)
    // Create book in the bookCollection database
    app.post("/books", (req, res) => {
      const book = req.body;
      const result = bookCollection.insertOne(book);
      res.send(result);
    });

    // Read all the books using 'GET' method
    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Read specific book data using the 'GET' method
    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.findOne(query);
      res.send(result);
    });

    // Update a book using "PUT" method from book database
    app.put("/books/:id", async (req, res) => {
      const id = req.params.id;
      const book = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBook = {
        $set: {
          name: book.name,
          email: book.email,
        },
      };

      const result = await bookCollection.updateOne(filter, updatedBook, options);
      res.send(result);
    });

    // DELETE a book using 'DELETE' method from book database
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bookCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// Setting the API
app.get("/", (req, res) => {
  res.send("Simple CRUD operation is running!");
});

// app.get("/users", (req, res) => {
//   res.send(users);
// });

// Running the server
app.listen(port, () => {
  console.log(`Simple CRUD operation is running on port ${port}`);
});
