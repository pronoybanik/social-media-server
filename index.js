const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.POST || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.lijbrwd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const allPost = client.db('social-site').collection('allPost');
    const aboutDetailsData = client.db('social-site').collection('aboutDetails');

    try {

        app.post('/allPost', async (req, res) => {
            const data = req.body;
            const result = await allPost.insertOne(data);
            res.send(result)
        });

        app.get('/getAllPost', async (req, res) => {
            const data = {};
            const result = await allPost.find(data).toArray()
            res.send(result)
        });

        app.put('/users/like/:id', async (req, res) => {


            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    Like: 'like'
                }
            }
            const result = await allPost.updateOne(filter, updateDoc, option);
            res.send(result);
        });

        app.get('/homePageData', async (req, res) => {
            const query = { Like: "like" }
            const result = await allPost.find(query).limit(3).toArray();
            res.send(result);
        });

        app.get('/postDetails/:id', async (req, res) => {
            const id = req.params.id;
            const data = await allPost.find({ _id: new ObjectId(id) }).toArray();
            res.send(data);

        });

        app.get('/aboutDetails', async (req, res) => {
            const data = {};
            const result = await aboutDetailsData.find(data).toArray()
            res.send(result);
        });


        app.put('/updateAbout/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const data = req.body;
            const option = { upsert: true };
            const updateData = {
                $set: {
                    name: data.name,
                    email: data.email,
                    address: data.address,
                    university: data.university

                }
            }
            const result = await aboutDetailsData.updateOne(filter, updateData, option);
            res.send(result);
        });



    }


    finally {

    }
}
run().catch(data => console.log(data))



app.get('/', (req, res) => {
    res.send('Phone server running');
});

app.listen(port, () => {
    console.log(`That server running ${port}`);
});
