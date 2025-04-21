import bodyParser from "body-parser";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// fileupload log
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'assets'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// end here

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))




const posts = [
    { id: 1, title: "First Blog", content: "This is the full content of the first blog post..." ,thumbnail:"/assets/astronaut_lost_in_space_by_v1ruben_dgmh1x4.png"},
    { id: 2, title: "Second Blog", content: "This is the full content of the second blog post...", thumbnail:"/assets/astronaut_lost_in_space_by_v1ruben_dgmh1x4.png"}
];

app.get('/',(req,res)=>{
    res.render("home.ejs",{posts})
})

app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("post.ejs", { post });
});

app.get("/NewPost",(req,res)=>{
    res.render("New-post.ejs")
})

app.get("/about",(req,res)=>{
    res.render("about.ejs")
})

// app.post("/submit",(req,res)=>{

//     const{title,content} = req.body;

//     let newpost = {
//         id : posts.length + 1,
//         title,
//         content
//     }

//     posts.push(newpost);

//     res.redirect("/");

// })

//create new post log
app.post("/submit", upload.single('thumbnail'), (req, res) => {
    const { title, content } = req.body;
    
    let thumbnailPath = "assets/astronaut_lost_in_space_by_v1ruben_dgmh1x4.png";
    if (req.file) {
        thumbnailPath = "/assets/" + req.file.filename;
    }

    let newpost = {
        id: posts.length + 1,
        title,
        content,    
        thumbnail: thumbnailPath
    }

    posts.push(newpost);
    res.redirect("/");
});

// app.get("/layout",(req,res)=>{
//     res.render("layout.ejs")
// })

app.get("/edit/:id",(req,res)=>{
    const post = posts.find(p => p.id == req.params.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("edit-post.ejs", { post });
})

app.post("/edit/:id", upload.single('thumbnail'), (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }

    // Update post data
    post.title = req.body.title;
    post.content = req.body.content;
    
    // Update thumbnail if a new one was uploaded
    if (req.file) {
        post.thumbnail = "/assets/" + req.file.filename;
    }

    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }

    // Remove post from array
    posts.splice(postIndex, 1);

    res.redirect("/");
});


app.listen(port,()=>{
    console.log(`server running on port: ${port}`)
})