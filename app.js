import 'dotenv/config';
import express from 'express';
import { connectionToDB } from './db.js';
import Character from './models/characterModel.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

connectionToDB();

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur mon API Sequelize'
  });
});

app.get('/test-create', async (req, res) => {
  try {
    const newCharacter = await Character.create({
      name: 'Mario',
      description: 'Un plombier'
    });

    res.json({
      message: 'Personnage créé avec succès',
      character: newCharacter
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error?.errors?.[0]?.message || 'Erreur serveur',
      error: true
    });
  }
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});