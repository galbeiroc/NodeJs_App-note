const mongoose = require('mongoose');

const uris = 'mongodb://localhost/notes-db-app';
mongoose
  .connect(uris, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(db => console.log('DB is Connected'))
  .catch(err => console.error(err));
