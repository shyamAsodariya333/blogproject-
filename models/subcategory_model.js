const mongoose = require('mongoose');
const multer = require('multer');

const path = require('path');

const subcategorypath = "/uploads/subcategory";

const subcategorySchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required:true
    },
    catId:{
        type : mongoose.Schema.Types.ObjectId,
        ref :"category"
    },
    subcategoryimage:{
        type:String,
        required:true
    },
    status:{
        type : Boolean ,
        required:true
    },
    create_date:{
        type:String,
        required:true
    }

   
})

const storagedata = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', subcategorypath))
    },

    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

subcategorySchema.statics.subimage = multer({ storage: storagedata }).single('subcategoryimage')

subcategorySchema.statics.subimgpath = subcategorypath;


const subcategory=mongoose.model('subcategory',subcategorySchema)

module.exports=subcategory;