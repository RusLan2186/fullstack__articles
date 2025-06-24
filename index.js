import express from 'express'
import mongoose from 'mongoose'
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js'
import { userController,  postController, commentsController} from './controllers/index.js'
import { handleValidationErrors, checkAuth } from './utils/index.js'
import dotenv from 'dotenv';
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'


mongoose
  .connect('mongodb+srv://admin:H7KPE6BLox4et7po@cluster0.sxtn9qs.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      { fs.mkdirSync('uploads') }
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage })

dotenv.config();
app.use(cors())

app.use(express.json())

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Hello World')
})



app.post('/auth/register', registerValidation, handleValidationErrors, userController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login)
app.get('/auth/me', checkAuth, userController.getMe)


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'The file was not uploaded' });
  }

  res.json({
     url: ('/uploads/' + req.file.originalname),
  });
});

app.get('/tags', postController.getLastTags)
app.get('/posts/tag/:tag', postController.getPostsByTag);
app.get('/posts', postController.getAllPosts)
app.get('/posts/popular', postController.getPopularPosts);
app.get('/posts/:id', postController.getOnePost)
app.delete('/posts/:id', checkAuth, postController.deletePost)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, postController.createPost)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, postController.updatePost)
app.get('/posts/popular', postController.getPopularPosts);

app.post('/posts/:postId/comments', checkAuth, commentCreateValidation, handleValidationErrors, commentsController.createComment);
app.get('/posts/:postId/comments', commentsController.getCommentsByPost);
app.get('/comments/last', commentsController.getLastCommentsGlobal);

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
