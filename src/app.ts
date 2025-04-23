import express from 'express';
import dotenv from  'dotenv';
import categoryRoutes from './routes/categoryRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import tagRoutes from './routes/tagRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/users', userRoutes)
//http://localhost:3001/api/users
// {"username": "admin", "password": "123456", "email": "}


const PORT = process.env.PORT
app.listen(PORT || 3001, () =>{
    console.log(`Sunucu ${PORT} portunda ayakta !!!`);
    console.log('sss')
})