const app = require("./api/server.js");
const port = 8000;

app.listen(port, function() {
    console.log(`Application running on: http://localhost:${port}`);
});