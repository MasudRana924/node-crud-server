const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = 5000
// middle ware 
app.use(cors())
app.use(express.json());
// user  mydbuser1
// pass : ZQMDtROrRpX5J4Sn


const uri = "mongodb+srv://mydbuser1:ZQMDtROrRpX5J4Sn@cluster0.hrpwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object

//   console.log('hitting the database')
//   const user={name:'MSD',email:'captainCool@hmail.com',profession:'cricketer'}

//   collection.insertOne(user)
//   .then(()=>{
//       console.log('insert success')
//   })


// //   client.close();
// });
async function run() {
    try {
        await client.connect();
        const database = client.db("FoodMaster");
        const usersCollection = database.collection("users");
        // create a document to insert
        //   get api from data 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({})
            const users = await cursor.toArray()
            res.send(users)
        })
        //  single user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query)

            console.log(id)
            res.send(user)
        })

        //   post api for insert data through getting fromu sers 
        app.post('/users', async (req, res) => {
            const newUser = req.body
            const result = await usersCollection.insertOne(newUser)
            console.log('got new user  ', req.body)
            console.log('added user', result)
            // res.send('hit the post')
            res.json(result)
        })
        //  delete api 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.json(result)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running my crud')
})
app.listen(port, () => {
    console.log('Running serveron port 500')
})