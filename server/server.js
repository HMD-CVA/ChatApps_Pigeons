const express = require('express');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars');
const path = require('path');

dotenv.config();

const route = require('./src/routers/index');
const { connectToDB } = require('./src/configs/dbConfig');

// Kết nối database
connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Handlebars view engine
app.engine('handlebars', engine({
    defaultLayout: false
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

route(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});