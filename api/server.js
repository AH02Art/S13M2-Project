// implement your server here
// require your posts router and connect it here
const express = require("express");
const postsRouter = require("./posts/posts-router.js");
const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.use("/api/posts", postsRouter)

app.use("*", function(request, response) {
    response.status(404).json({
        message: "not found"
    });
})

module.exports = app;