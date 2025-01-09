require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const sequelize = require('./src/config/database');
const routes = require('./src/routes');

class App {
  constructor() {
    this.app = express();
    this.port = parseInt(process.env.APP_PORT, 10) || 3002;

    this.configureMiddleware();
    this.configureRoutes();
    this.connectToDatabase();
  }

  configureMiddleware() {
    this.app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/public', express.static(path.join(__dirname, 'public')));
 }

  configureRoutes() {
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`, {
        query: req.query,
        params: req.params
      });
      next();
    });
    this.app.use('/api', routes);
  }

  async connectToDatabase() {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      await sequelize.sync();
      console.log('Models synchronized with database.');
      this.app.listen(this.port, () => {
        console.log(`Serveris running on http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}

new App();