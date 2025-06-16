const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
});
const db = admin.firestore();

app.post('/signup', async (req, res) => {
  const { name, email } = req.body;

  try {
    const docRef = await db.collection('signups').add({
      name,
      email,
      createdAt: admin.firestore.Timestamp.now()
    });
    res.status(200).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/signups', async (req, res) => {
  try {
    const snapshot = await db.collection('signups').orderBy('createdAt', 'desc').get();
    const signups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(signups);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// This is necessary to actually start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
