const others= require('../models/others_model');


const path = require('path');

const add_others = (req,res)=>{
    return res.render('others')
}

const othersInsertData= async(req,res) =>{
    try {
        req.body.status = true;
        await others.create(req.body);
    
        return res.redirect('back') 
        
    } catch (error) {
        console.log(error)
        return res.redirect('back') 
    }

}

const view_others=async (req,res)=> {
    var search="";
    if(req.query.search){
        search=req.query.search;
    }
    var othersData=await others.find({
        $or:[
            {name: {$regex:search, $options:'i'}},
            {city: {$regex:search, $options:'i'}}
        ]
    });
    return res.render('others-view',{
        othersData : othersData,
        search :search
    })

}

const deactive=async(req,res)=>{
    let deactiveData=await others.findByIdAndUpdate(req.params.id ,{status:false})
    if(deactiveData){
        req.flash('success',"slider Deactivated Successfully");
        return res.redirect('back')
    }

 }

 const active=async(req,res)=>{
    let deactiveData=await others.findByIdAndUpdate(req.params.id ,{status:true})
    if(deactiveData){
        req.flash('success',"slider activated Successfully");
        return res.redirect('back')
    }

 }

module.exports={
    add_others , othersInsertData ,view_others ,deactive ,active
}