const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');

dotenv.config();

const route = require('./src/routes/index');
const { connectToDB } = require('./src/configs/dbConfig');

// Kết nối database
connectToDB();

const app = express();
const PORT = process.env.PORT || 8888;

// CORS - Cho phép Angular gọi API
app.use(cors({
  origin: process.env.LINK_CLIENT,
  credentials: true
}));

// Middleware parse JSON và URL-encoded data
app.use(express.json());                    // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// Cấu hình Handlebars view engine
app.engine('handlebars', engine({
    defaultLayout: false
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

route(app);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status_code = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(req.status_code || 500).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});