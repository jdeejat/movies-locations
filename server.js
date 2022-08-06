require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

/* 
If you use multiple connections, you should make sure you export schemas, not models. Exporting a model from a file is called the export model pattern. The export model pattern is limited because you can only use one connection.
use below to connect to multiple databases
const mov = mongoose.createConnection(`${process.env.DATABASE_URL}`);
*/
mongoose.connect(process.env.DATABASE_URL);

//console.log(process.env); // to see all the environment variables

// START SERVER
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
