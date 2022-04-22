const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { sendEmailWithNodemailer } = require("./helpers/email");
const port = process.env.PORT || 5000;

//configure midleware cors
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://bankapp:bankappdIw6ANe@cluster0.ljci6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//connect to db
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ljci6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//stripe related stuff

async function run() {
  try {
    await client.connect();
    const database = client.db("UserDataTable");
    const usersCollection = database.collection("userListData");

    //api for save product from admin dashboard
    /*  app.post("/userList", async (req, res) => {
      const saveUser = req.body;
      const result = await usersCollection.insertOne(saveUser);

      res.json(result);
    }); */

    //GET APi to get data
    app.get("/userListAll", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //save email pass auth data to mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;

      const result = await usersCollection.insertOne(user);
      console.log("ddd", result);

      let emailbody = `
            <h1>Account created successfully</h1>
           
            `;

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Hello ${user.displayName}. Thanks `,
        html: emailbody,
      };
      sendEmailWithNodemailer(emailData);

      res.json(result);
    });
    //logedin person balance deposit
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      console.log(user);
      res.json(user);
    });

    //update balance
    app.put("/updatebalance/:email", async (req, res) => {
      console.log("hello");
      const user = req.body;
      const filter = { email: user.email };
      const balance = req.body;

      //const balance = { balance: user.balance };
      console.log("xBalance ", balance);

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          balance: balance.balance,
        },
      };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //withdraw balance
    app.put("/withdraw/:email", async (req, res) => {
      console.log("hello");
      const user = req.body;
      const filter = { email: user.email };
      const balance = req.body;

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          balance: balance.balance,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //api for balance transfer
    app.put("/transfer/:email", async (req, res) => {
      console.log("hello");
      const user = req.body;
      const filter = { email: user.email };
      const balance = req.body;

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          balance: balance.balance,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    console.log("db connected");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
