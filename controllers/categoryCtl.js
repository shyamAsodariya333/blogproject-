const category_model=require('../models/category_model')

module.exports.add_category=(req,res)=>{
    return res.render("add_category")
}

module.exports.categoryInsertData=async(req,res)=>{
    try {
        req.body.status = true;
        await category_model.create(req.body);
        req.flash('success',"Category Data Added Successfully");
        return res.redirect('back') 
        
    } catch (error) {
        console.log(error)
        return res.redirect('back') 
    }
}
module.exports.view_category=async(req,res)=>{
    try{
        var search="";
        if(req.query.search){
            search=req.query.search;
        }
        var page=0;
        var per_page=2;
        if(req.query.page){
            page=req.query.page
        }

        let allData=await category_model.find({}).countDocuments();
        let totalPage =Math.ceil(allData/per_page);

        const  catData =await category_model.find({
            $or:[
                {title: {$regex:search, $options:'i'}}
            ]
        })
        .skip(page*per_page)
        .limit(per_page)
        return res.render('view_category',{
            catData:catData,
            search :search,
            totalPage : totalPage
        })
    } catch (error) {
        console.log(error)
        return res.redirect('back') 
    }
}

module.exports.deactive=async(req,res)=>{
    let deactiveData=await category_model.findByIdAndUpdate(req.params.id ,{status:false})
    if(deactiveData){
        req.flash('success',"slider Deactivated Successfully");
        return res.redirect('back')
    }

 }

module.exports.active=async(req,res)=>{
    let deactiveData=await category_model.findByIdAndUpdate(req.params.id ,{status:true})
    if(deactiveData){
        req.flash('success',"slider activated Successfully");
        return res.redirect('back')
    }

 }