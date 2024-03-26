const sliderModel=require('../models/slider-model')

const others_model=require('../models/others_model')

const offer_model=require('../models/offer_model')

const photos_model =require('../models/photos_model')

const post_model=require('../models/post_model')

const comment_model = require('../models/Comment_model')

const admin_model =require('../models/admim_model')

const category_model =require('../models/category_model')

const subcategory_model =require('../models/subcategory_model')

const moment = require("moment")

const path = require('path');

const home=async(req,res)=>{
    const sliderData= await sliderModel.find({status : true}); 
    const othersData= await others_model.find(); 
    const offerData= await offer_model.find(); 
    const photosData= await photos_model.find(); 
    const postData= await post_model.find(); 
    
    return res.render('user-panel/home',{
        sliderData:sliderData,
        othersData:othersData,
        offerData:offerData,
        photosData:photosData,
        postData : postData
    })
}

const blog_single=async(req,res)=>{
    console.log(req.params.id)
    const comment_count =await comment_model.find({postId:req.params.id}).countDocuments();
    const comment_data =await comment_model.find({postId:req.params.id})
    const AllIds =await post_model.find({}).select('_id')
    console.log(AllIds)
    
    let counts;
    AllIds.map((v,i)=>{
        if(v._id == req.params.id){
            counts= i;
        }
    })
    console.log(counts)

    const  blog_Data=await post_model.findById(req.params.id);
    // console.log(blog_Data)

    //RECENT POSTS
    const postData=await post_model.find({}).sort({_id:-1}).limit(3)
    console.log(postData)
    //endso
    return res.render('user-panel/blog_single',{
        blog_Data : blog_Data,
        AllIds:AllIds ,
        counts :counts,
        comment_count: comment_count,
        comment_data : comment_data,
        postData : postData
        
    })
}
const userComment= async (req,res)=> {
    console.log(req.file);
    var img = "";
    if (req.file) {
        img = comment_model.ipath + "/" + req.file.filename;
    }
    
    req.body.commentimg = img;
    req.body.status = true;
    req.body.current_date=moment().format('lll');
    
    console.log(req.body);
    
    await comment_model.create(req.body);
    req.flash('success',"add data success");
    return res.redirect("back");
}

const about= async (req,res)=>{
    const adminData =await  admin_model.find()

    return res.render('user-panel/about',{
        adminData : adminData
    })
}

const contact= async (req,res)=>{

    return res.render('user-panel/contact')
}

const work_columns= async (req,res)=>{
    try{
        const catData =  await category_model.find({status : true});
        const subCatData =  await subcategory_model.find({status : true});
        return res .render('user-panel/work_columns',{
            catData : catData,
            subCatData : subCatData
        })
        
    }catch(err){
        console.log(err)
        return res .require('back')

    }

}


module.exports={home , blog_single , userComment , about , contact ,work_columns}