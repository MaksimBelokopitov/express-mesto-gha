const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { PORT = 3000, DB = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '656dceea48a17a9e9c55e3c2',
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена.' }));

mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
