import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
await mongoose.connect(process.env.MONGODB_URI);
const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`API listening on ${port}`));