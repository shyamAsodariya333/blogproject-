const photosModel=require('../models/photos_model');

const add_photos = (req,res)=>{
    return res.render('add_photos')
}

const photosInsertData= async(req,res)=>{
   
    console.log(req.body)
    console.log(req.file);

    var img = "";
    if (req.file) {
        img = photosModel.photospath + "/" + req.file.filename;
    }
    
    req.body.photosimage = img;
 
    await photosModel.create(req.body);
    req.flash('success',"add slider data success");
    return res.redirect("back");
   
    
}

const view_photos= async(req,res)=>{
    var search="";
    if(req.query.search){
        search=req.query.search;
    }
    const  photosData =await photosModel.find({
        $or:[
            {title: {$regex:search, $options:'i'}}
        ]
    });
    return res.render('view_photos',{
        photosData:photosData,
        search : search
    })
}

module.exports={
    add_photos , photosInsertData ,view_photos
}