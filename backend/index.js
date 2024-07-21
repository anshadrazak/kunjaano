const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://anshadrazakk:Asdrzkknt%40123@cluster0.qyxtmlr.mongodb.net/cluster0?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDb() {
    try {
        if (!client.isConnected()) {
            await client.connect();
            console.log('Connected to MongoDB');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

app.get('/balance', async (req, res) => {
    try {
        await connectToDb();
        console.log('Fetching projects from database');

        const projects = await client.db("Saamanam").collection("Items").find({}).toArray();
        console.log('Projects fetched:', projects);

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Error fetching projects');
    }
});

app.post('/add', async (req, res) => {
    try {
        await connectToDb();
        const newProject = req.body;
        const result = await client.db("Saamanam").collection("Items").insertOne(newProject);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).send('Error adding project');
    }
});

app.put('/edit/:id', async (req, res) => {
    try {
        await connectToDb();
        const { id } = req.params;
        const updatedProject = req.body;

        console.log('Editing project with id:', id);
        console.log('Updated project data:', updatedProject);

        const result = await client.db("Saamanam").collection("Items").updateOne({ _id: new ObjectId(id) }, { $set: updatedProject });

        if (result.matchedCount > 0) {
            res.json(updatedProject);
        } else {
            res.status(404).send('Project not found');
        }
    } catch (error) {
        console.error('Error editing project:', error);
        res.status(500).send('Error editing project');
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        await connectToDb();
        const { id } = req.params;

        console.log('Deleting project with id:', id);

        const result = await client.db("Saamanam").collection("Items").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount > 0) {
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).send('Project not found');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).send('Error deleting project');
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
