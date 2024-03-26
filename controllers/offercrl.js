const offerModel=require('../models/offer_model');

const add_offer = (req,res)=>{
    return res.render('add_offer')
}

const offerInsertData=async(req,res)=>{
    try{
        req.body.status = true;
        await offerModel.create(req.body);
        req.flash('success',"add offer data success");
        return res.redirect("back");
    }catch{
        req.flash('error',"add offer data not insert!!");
        return res.redirect("back");
    }
}

const view_offer =async(req,res)=>{
    var search="";
    if(req.query.search){
        search=req.query.search;
    }

    var page=0;
    var per_page=2;
    if(req.query.page){
        page=req.query.page
    }

    let allData=await offerModel.find({
        $or:[
            {icon: {$regex:search, $options:'i'}},
            {title: {$regex:search, $options:'i'}}
        ]
    }).countDocuments();
    let totalPage =Math.ceil(allData/per_page);

    const  offerData =await offerModel.find({
        $or:[
            {icon: {$regex:search, $options:'i'}},
            {title: {$regex:search, $options:'i'}}
        ]
    })
    
    .skip(page*per_page)
    .limit(per_page)
    return res.render('view_offer',{
        offerData:offerData,
        search : search,
        totalPage : totalPage,
        currentPage :page
    })
}

const deactive=async(req,res)=>{
    let deactiveData=await offerModel.findByIdAndUpdate(req.params.id ,{status:false})
    if(deactiveData){
        req.flash('success',"slider Deactivated Successfully");
        return res.redirect('back')
    }

 }

 const active=async(req,res)=>{
    let deactiveData=await offerModel.findByIdAndUpdate(req.params.id ,{status:true})
    if(deactiveData){
        req.flash('success',"slider activated Successfully");
        return res.redirect('back')
    }

 }

module.exports={
   add_offer ,offerInsertData ,view_offer ,active ,deactive
}