const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUserValidation, loginValidation } = require('./middlewares/validation');

const { PORT = 3000, DB = 'mongodb://localhost:27017/mestodb' } = process.env;
const { login, createUsers } = require('./controller/users');

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.post('/signup', createUserValidation, createUsers);
app.post('/signin', loginValidation, login);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена.' }));
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
