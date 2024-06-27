const express = require("express");
const Post = require("./posts-model.js");

const router = express.Router();

router.get("/", function(request, response) {
    Post.find()
        .then((data) => {
            response.json(data);
        })
        .catch((error) => {
            response.status(500).json({ 
                message: "The posts information could not be retrieved",
                error: error.message
            });
        })
});
router.get("/:id", async function(request, response) {
    try {
        const id = await Post.findById(request.params.id);
        if (!id) {
            response.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
            response.status(200).json(id);
        }
    }
    catch(error) {
        response.status(500).json({ 
            message: "The post information could not be retrieved",
            error: error.message
        });
    }
});
router.post("/", function(request, response) {
    const { title, contents } = request.body;
    if ( !title || !contents ) {
        response.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id);
            })
            .then((data) => {
                response.status(201).json(data);
            })
            .catch((error) => {
                response.status(500).json({ 
                    message: "There was an error while saving the post to the database",
                    error: error.message
                });                
            })
    }
});
router.put("/:id", function(request, response) {
    const { title, contents } = request.body;
    if ( !title || !contents ) {
        response.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.findById(request.params.id)
            .then((data) => {
                if (!data) {
                    response.status(404).json({
                        message: "The post with the specified ID does not exist"
                    });
                } else {
                    return Post.update(request.params.id, request.body);
                }
            })
            .then((updatedPost) => {
                if (updatedPost) return Post.findById(request.params.id);
            })
            .then((post) => {
                response.status(200).json(post);
            })
            .catch((error) => {
                response.status(500).json({ 
                    message: "The posts information could not be retrieved",
                    error: error.message
                });                
            })
    }
});
router.delete("/:id", async function(request, response) {
    try {
        const id = await Post.findById(request.params.id);
        if (!id) {
            response.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
            await Post.remove(request.params.id)
            response.json(id);
        }
    } catch(error) {
        response.status(500).json({ 
            message: "The post could not be removed",
            error: error.message
        });         
    }
});
router.get("/:id/comments", async function(request, response) {
    try {
        const id = await Post.findById(request.params.id);
        if (!id) {
            response.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
            const comments = await Post.findPostComments(request.params.id);
            if (!comments) {
                response.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                response.json(comments);
            }
        }     
    } catch(error) {
        response.status(500).json({ 
            message: "The comments information could not be retrieved",
            error: error.message
        });
    }
});

module.exports = router;