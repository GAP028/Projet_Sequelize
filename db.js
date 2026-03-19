import { validateHeaderName } from 'node:http';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_URL);

async function connectionToDB() {
  try {
    await sequelize.authenticate();
    console.log('Connexion réussie à la base de données');

    await sequelize.sync();
    console.log('Synchronisation Sequelize réussie');
  } catch (error) {
    console.error('Erreur de connexion à la base :', error);
  }
}


export { sequelize, connectionToDB };