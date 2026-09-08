import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,index:true},email:{type:String,required:true,unique:true,index:true},password:{type:String,required:true},role:{type:String,enum:['customer','admin'],default:'customer'}},{timestamps:true});
export default mongoose.model('User',schema);