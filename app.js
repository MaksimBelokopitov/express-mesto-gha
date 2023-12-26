const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { rateLimit } = require('express-rate-limit');
const auth = require('./middlewares/auth');
const { createUserValidation, loginValidation } = require('./middlewares/validation');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000, DB = 'mongodb://localhost:27017/mestodb' } = process.env;
const { login, createUsers } = require('./controller/users');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Превышен лимит запросов, попробуйте позже.',
});

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.post('/signup', createUserValidation, createUsers);
app.post('/signin', loginValidation, login);

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена.'));
  next();
});
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(`DB connection error ${err}`));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
