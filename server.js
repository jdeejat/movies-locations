require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

/* 
If you use multiple connections, you should make sure you export schemas, not models. Exporting a model from a file is called the export model pattern. The export model pattern is limited because you can only use one connection.
use below to connect to multiple databases
const mov = mongoose.createConnection(`${process.env.DATABASE_URL}`);
*/
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('DB connection successful'));
//.catch((err) => console.log("DB connection error")); // this will work for small application

//console.log(process.env); // to see all the environment variables

// START SERVER
const server = app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on port 3000');
});

// for large application, use process.on('unhandledRejection', (err) => {
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
