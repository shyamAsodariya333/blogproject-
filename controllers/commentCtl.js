const comment_model =require('../models/Comment_model')

const view_comment = async(req,res)=>{
    var search="";
    if(req.query.search){
        search=req.query.search;
    }
    
    var page=0;
    var per_page=2;
    if(req.query.page){
        page=req.query.page
    }

    let allData=await comment_model.find({
        $or:[
            {name: {$regex:search, $options:'i'}},
            {email: {$regex:search, $options:'i'}}
        ]
    }).countDocuments();
    let totalPage =Math.ceil(allData/per_page);

    var viewData =await comment_model.find({
        $or:[
            {name: {$regex:search, $options:'i'}},
            {email: {$regex:search, $options:'i'}}
        ]
    })
    .skip(page*per_page)
    .limit(per_page).populate('postId').exec();

    console.log(viewData)

    return res.render("view_comment",{
        viewData:viewData,
        search : search,
        totalPage : totalPage,
        currentPage :page
    });
}

module.exports = {view_comment}