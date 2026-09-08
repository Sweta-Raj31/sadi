import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,index:true},description:String,price:{type:Number,min:0,required:true},stock:{type:Number,min:0,required:true},category:{type:String,index:true}},{timestamps:true});
schema.index({category:1,createdAt:-1});
export default mongoose.model('Product',schema);