import mongoose from 'mongoose';
const item=new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},name:String,price:Number,quantity:Number},{_id:false});
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',index:true},items:[item],total:{type:Number,required:true},status:{type:String,enum:['PLACED','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'],default:'PLACED',index:true},idempotencyKey:{type:String,index:true}},{timestamps:true});
schema.index({user:1,createdAt:-1});
export default mongoose.model('Order',schema);