import express from 'express'; import Product from '../models/Product.js'; import {auth,roles} from '../middleware/auth.js';
const r=express.Router();
r.get('/',async(req,res,next)=>{try{const page=Math.max(1,+req.query.page||1),limit=Math.min(50,+req.query.limit||12),q=req.query.q||'',filter=q?{name:{$regex:q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'}}:{};const items=await Product.find(filter).select('name description price stock category').sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean();res.json({items,page,limit})}catch(e){next(e)}});
r.post('/',auth,roles('admin'),async(req,res,next)=>{try{res.status(201).json({item:await Product.create(req.body)})}catch(e){next(e)}});
r.put('/:id',auth,roles('admin'),async(req,res,next)=>{try{res.json({item:await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).lean()})}catch(e){next(e)}});
export default r;