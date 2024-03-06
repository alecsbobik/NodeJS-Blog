const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET 
// HOME
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "My first ever, simple blog created with NodeJS, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextpage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextpage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});

// GET 
// POST :id
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        const locals = {
            title: "First Ever Blog using Node.js",
            description: "My first ever, simple blog created with NodeJS, Express & MongoDb.",
            // currentRoute: `/post/${slug}`
        }

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });

    } catch (error) {
        console.log(error);
    }

});

// GET 
// POST -searchTerm
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "My first ever, simple blog created with NodeJS, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }

            ]
        });

        res.render("search", {
            data,
            locals
        });

    } catch (error) {
        console.log(error);
    }

});





// router.get('', async (req, res) => {
//     const locals = {
//         title: "NodeJS Blog",
//         description: "My first ever, simple blog created with NodeJS, Express & MongoDb."
//     }

//     try {

//         const data = await Post.find();
//         res.render('index', { locals, data })

//     } catch (error) {
//         console.log(error);
//     }

// });

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    })
});


// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         },
//         {
//             title: "First time using NodeJS",
//             body: "Learning Node.js can be an exciting journey! Node.js is a great choice for beginners because it uses JavaScript, a language already familiar to many frontend developers."
//         },
//         {
//             title: "Learning MongoDB",
//             body: " MongoDB empowers developers to build faster, smarter, and more scalable applications. Whether you’re a beginner or an experienced developer, learning MongoDB opens up exciting possibilities! "
//         },
//         {
//             title: "HTML",
//             body: "Hypertext Markup Language"
//         },
//         {
//             title: "Self Studying Programming",
//             body: "is hard!!!!"
//         },
//         {
//             title: "Create Web-based System using HTML, CSS, JS & Php",
//             body: "The system aims to "
//         },
//     ])
// }

// insertPostData();



module.exports = router;