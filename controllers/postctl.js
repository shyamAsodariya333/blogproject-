const post_model= require('../models/post_model');
const moment = require("moment")

const path = require('path');

const add_post = (req,res)=>{
    return res.render('add_post')
}

const postsInsertData =async(req,res)=>{
    
        console.log(req.body)
        console.log(req.file);

    var img = "";
    if (req.file) {
        img = post_model.postimgpath + "/" + req.file.filename;
    }
    
    req.body.postimage = img;
    req.body.current_date=moment().format('lll');
    req.body.userName = req.user.name;
 
    await post_model.create(req.body);
    req.flash('success',"add post data success");
    return res.redirect("back");
  
}

const view_post =async(req,res)=> {
    var postData=await post_model.find();
    return res.render('view_post',{
        postData : postData
    })

}

module.exports={
    add_post ,postsInsertData ,view_post
}