const slider= require('../models/slider-model');
const path = require('path');

const add_slider = (req,res)=>{
    return res.render('add_slider')
}

const sliderInsertData= async(req,res) =>{  
    try {
        console.log(req.body)
    console.log(req.file);

    var img = "";
    if (req.file) {
        img = slider.sliderimgpath + "/" + req.file.filename;
    }
    
    req.body.sliderimage = img;
    req.body.status = true;
 
    await slider.create(req.body);
    req.flash('success',"add slider data success");
    return res.redirect("back");
    }catch{

    }
    
}

const view_slider=async(req,res)=> {
    var search="";
    if(req.query.search){
        search=req.query.search;
    }
    var page=0;
    var per_page=2;
    if(req.query.page){
        page=req.query.page
    }

    let allData=await slider.find({}).countDocuments();
    let totalPage =Math.ceil(allData/per_page);

    const  slidersData =await slider.find({
        $or:[
            {title: {$regex:search, $options:'i'}}
        ]
    })
    .skip(page*per_page)
    .limit(per_page)
    return res.render('view_slider',{
        slidersData:slidersData,
        search :search,
        totalPage : totalPage
    })
}

const deactive=async(req,res)=>{
    let deactiveData=await slider.findByIdAndUpdate(req.params.id ,{status:false})
    if(deactiveData){
        req.flash('success',"slider Deactivated Successfully");
        return res.redirect('back')
    }

 }

 const active=async(req,res)=>{
    let deactiveData=await slider.findByIdAndUpdate(req.params.id ,{status:true})
    if(deactiveData){
        req.flash('success',"slider activated Successfully");
        return res.redirect('back')
    }

 }

module.exports={
    add_slider , sliderInsertData , view_slider ,deactive ,active
}