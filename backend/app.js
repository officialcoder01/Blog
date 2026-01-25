require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const adminRouter = require('./routes/adminRouter');
const commentRouter = require('./routes/commentRouter');
const jwtStrategy = require('./strategies/jwt');
const passport = require('passport');

const app = express();

const port = process.env.PORT || 3000;

passport.use(jwtStrategy);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})