const category_model= require('../models/category_model')

const subcategory_model =require('../models/subcategory_model')

const moment=require('moment')

module.exports.add_subcategory=async(req,res)=>{
    const categoryData=await category_model.find()
    return res.render("add_subcategory",{
        categoryData
    })
}

module.exports.subcategoryInsertData=async (req,res)=>{
    try{
        console.log(req.file);
        var img = "";
        if (req.file) {
            img = subcategory_model.subimgpath + "/" + req.file.filename;
        }
        
        req.body.create_date = moment().format('LLL');
        req.body.subcategoryimage = img;
        req.body.status = true;
        
        console.log(req.body);
        
        await subcategory_model.create(req.body);
        req.flash('success',"add data success");
        return res.redirect("back");
    }catch(err){
    console.log(err)
    return res.redirect('back')
    }
  
    
}

module.exports.view_subcategory = async(req,res)=> {
    var search="";
    if(req.query.search){
        search=req.query.search;
    }
    var page=0;
    var per_page=4;
    if(req.query.page){
        page=req.query.page
    }

    let allData=await subcategory_model.find({}).countDocuments();
    let totalPage =Math.ceil(allData/per_page);

    const  SubCatData =await subcategory_model.find({
        $or:[
            {title: {$regex:search, $options:'i'}}
        ]
    })
    .skip(page*per_page)
    .limit(per_page).populate('catId').exec();

    return res.render('view_subcategory',{
        SubCatData:SubCatData,
        search :search,
        totalPage : totalPage
    })
}


module.exports.deactive=async(req,res)=>{
    let deactiveData=await subcategory_model.findByIdAndUpdate(req.params.id ,{status:false})
    if(deactiveData){
        req.flash('success',"slider Deactivated Successfully");
        return res.redirect('back')
    }

 }

module.exports.active=async(req,res)=>{
    let deactiveData=await subcategory_model.findByIdAndUpdate(req.params.id ,{status:true})
    if(deactiveData){
        req.flash('success',"slider activated Successfully");
        return res.redirect('back')
    }

 }
