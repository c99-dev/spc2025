const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

const rootRouter = require('./router/rootRouter');
const userRouter = require('./router/userRouter');
const productRouter = require('./router/productRouter');

app.use(morgan('dev'));

app.use('/', rootRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
