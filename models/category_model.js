const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    
    status:{
        type : Boolean ,
        required:true
    }
   
})


const category=mongoose.model('category',categorySchema)

module.exports=category;