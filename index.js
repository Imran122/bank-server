const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

//configure midleware cors
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://bankapp:bankappdIw6ANe@cluster0.ljci6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
//connect to db
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ljci6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//stripe related stuff


async function run() {
    try {
        await client.connect();
        const database = client.db('UserDataTable');
        const usersCollection = database.collection('userListData');





        //api for save product from admin dashboard
        app.post('/userList', async (req, res) => {
            const saveUser = req.body;
            const result = await usersCollection.insertOne(saveUser)

            res.json(result)
        });

        //GET APi to get data
        app.get('/userListAll', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        });



        console.log('db connected');
    }
    finally {

        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})