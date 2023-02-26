const express = require("express")
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const {encrypt, compare} = require('./handleBcrypt')
const User = require('./models/user')
const Post = require('./models/post')
const Like = require('./models/likes')
const Comment = require('./models/comments')
require('dotenv').config();
const mongoose = require('mongoose');

const user =  process.env.REACT_APP_MONGODB_USER;
const password = process.env.REACT_APP_MONGODB_PASSWORD;
const mongoDB = 'react-wegram';
const uri=`mongodb+srv://${user}:${password}@cluster0.qy7pbul.mongodb.net/${mongoDB}?retryWrites=true&w=majority`;

mongoose.connect(uri)
.then(() =>console.log('Base de datos conectada.'))
.catch(e => console.log(e));

const corsOptions ={
    origin: 'https://react-wegram-frontend.vercel.app',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/registration', async(req,res)=>{

    const {username, name, email, password} = req.body
    const passwordHash = await encrypt(password)
    try{
        const user = await User.find({email: email})
        if(user.length>0){
            res.send('exists')
        }else{
            const userDB = new User({
                username: username,
                name: name,
                email: email,
                password: passwordHash
            })
            await userDB.save()
            .then(res.send('success'))
        }
    }catch(error){
        console.log(error)
    }
})

app.post('/login', async(req, res)=>{

    const email = req.body.email
    const password = req.body.password

    try{
        const user = await User.find({email: email})
        if(user.length > 0){
            
            const checkPassword = await compare(password, user[0].password)

            if(checkPassword){
                res.send({id: user[0].id, username: user[0].username, name: user[0].name, email: user[0].email})
            }else{
                res.send('notFound')
            }
        }else{
            res.send('notFound')
        }

    }catch(error){
        console.log(error)
    }
})

app.post('/createPost', async(req, res)=>{

    const description = req.body.description
    const userId = req.body.userId
    const urlImage = req.body.urlImage
    const username = req.body.username

    try{
        const postDB = new Post({
            description: description,
            userId: userId,
            urlImage: urlImage,
            likes: 0,
            comments: 0,
        })
        await postDB.save();

    }catch(error){
        console.log(error)
    }
})

app.post('/getIdPosts', async (req,res)=>{

    const {userId} = req.body;
    try{
        const myPosts = await Post.find({userId: userId});
        const arrayPosts = [];
        if(myPosts.length > 0){

            const user = await User.find({_id: userId});

            if(user.length > 0){
                myPosts.map((post)=>{
                    if(post.userId === user[0]._id.toString()){
                        arrayPosts.push({urlImage: post.urlImage, username: user[0].username, description: post.description, _id: post._id, likes: post.likes, comments: post.comments, userId: post.userId})
                    }
                })
                res.send(arrayPosts)
            }
        }else{
            const user = await User.find({_id: userId});
            arrayPosts.push({username: user[0].username, userId: user[0]._id, _id: 0})
            res.send(arrayPosts)
        }
    }catch(error){
        console.log(error)
    }
})

app.get('/getPosts', async(req, res)=>{
    try{
        const posts = await Post.find();
        const arrayPosts = [];

        if(posts.length>0){

            const users = await User.find();

            if(users.length > 0){
                posts.map((post)=>{
                    users.map((user)=>{
                        if(post.userId === user._id.toString()){
                            arrayPosts.push({urlImage: post.urlImage, username: user.username, description: post.description, _id: post._id, likes: post.likes, comments: post.comments, userId: user._id.toString()})
                        }
                    })
                })
                res.send(arrayPosts)
            }
        }else{

        }
    }catch(error){
        console.log(error)
    }
})

app.post('/editProfile', async(req, res)=>{

    const {id, name, username} = req.body;
    try {
        await User.findOneAndUpdate({_id: id}, {name: name, username: username}, {returnOriginal: false})
    } catch (error) {
        console.log(error)
    }
})

app.post('/postLike', async(req,res)=>{
    const {userId, postId} = req.body;

    try{
        const like = await Like.find({postId: postId, userId: userId})
        if(like.length>0){
            await Like.deleteOne({postId: postId, userId: userId})
            .then(
                await Post.findOneAndUpdate({_id: postId}, {$inc: {likes: -1}}, {returnOriginal: false})
            )
        }else{
            const likeDB = new Like({
                userId: userId,
                postId: postId,
            })
            await likeDB.save()
            .then(
                await Post.findOneAndUpdate({_id: postId}, {$inc: {likes: 1}}, {returnOriginal: false})
            )
        }
    }catch(error){
        console.log(error)
    }
})

app.post('/getLikes', async(req, res)=>{

    const {userId} = req.body;

    try{
        const likes = await Like.find({userId: userId});
        if(likes.length>0){
            res.send(likes)
        }else{
            res.send({_id: '0', userId: '0', postId: '0'})
        }
    }catch(error){
        console.log(error)
    }
})

app.post('/getPost', async(req, res)=>{
    const {id} = req.body;
    const arrayPosts = [];
    
    try{
        const posts = await Post.find({_id: id});

        if(posts.length > 0){

            const users = await User.find();
            if(users.length > 0){
                posts.map((post)=>{
                    users.map((user)=>{
                        if(post.userId === user._id.toString()){
                            arrayPosts.push({urlImage: post.urlImage, username: user.username, description: post.description, _id: post._id, likes: post.likes, comments: post.comments, userId: user._id.toString()})
                        }
                    })
                })
                res.send(arrayPosts[0])
            }

        }
    }catch(error){
        console.log(error)
    }
})

app.post('/postComment', async(req,res)=>{

    const {userId, postId, comment} = req.body;
    try{
        const commentDB = new Comment({
            userId: userId,
            postId: postId,
            comment: comment
        })

        await commentDB.save();

        const comments = await Comment.find({postId: postId});
        
        await Post.findOneAndUpdate({_id: postId}, {comments: comments.length}, {returnOriginal: false})
        
    }catch(error){
        console.log(error)
    }

})

app.post('/getComments', async(req,res)=>{

    const {postId} = req.body;
    const commentsArray = [];
    try{
        const comments = await Comment.find({postId: postId});
        const users = await User.find();
        if(users.length>0){
            comments.map((comment)=>{
                users.map((user)=>{
                    if(comment.userId === user._id.toString()){
                        commentsArray.push({username: user.username, comment: comment.comment, userId: user._id})
                    }
                })
            })
            res.send(commentsArray)
        }
    }catch(error){
        console.log(error)
    }
})

app.get('/getAllComments', async(req,res)=>{

    try{
        const comments = await Comment.find();
        if(comments.length>0){
            res.send(comments);
        }

    }catch(error){
        console.log(error)
    }
})

app.post('/getProfilePosts', async(req,res)=>{

    const {userId} = req.body;

    try{
        const myPosts = await Post.find({userId: userId});

        const arrayPosts = [];
        if(myPosts.length > 0){

            const user = await User.find({_id: userId});

            if(user.length > 0){
                myPosts.map((post)=>{
                    if(post.userId === user[0]._id.toString()){
                        arrayPosts.push({urlImage: post.urlImage, username: user.username, description: post.description, _id: post._id, likes: post.likes, comments: post.comments})
                    }
                })
                res.send(arrayPosts)
            }
        }
    }catch(error){
        console.log(error)
    }
})

app.listen(3001, ()=>{
    console.log("Running on port 3001")
})