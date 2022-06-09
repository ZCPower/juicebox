const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params

    try {
        const postsByTagName = await getPostsByTagName(tagName);

        const posts = postsByTagName.filter(post => {
            if (post.active) return true;
            if (req.user && post.author.id === req.user.id) return true;
            return false
        });


        if (posts) {
            res.send(posts);
        } else {
            next({
                name: 'No posts with that tag',
                message: 'try a real tag, dumby'
            })
        }

    } catch ({ name, message }) {
    }
});


tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

module.exports = tagsRouter;