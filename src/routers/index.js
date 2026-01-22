
function route(app) {
    app.get('/', (req, res) => {
        res.send('<h1>CC</h1>Welcome to the Home Page');
    });
}

module.exports = route;