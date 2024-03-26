
const admin=require("../models/admim_model")

const slider_model =require('../models/slider-model');
const offer_model =require('../models/offer_model')


const path = require('path');
const fs=require('fs');
const passport=require("passport");
const nodemailer = require("nodemailer");


const login= async(req,res)=>{
    try{
        const captcha_code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

        let captcha ="";
        
        for(var i=0; i<6; i++){
            captcha+= captcha_code.charAt(Math.round(Math.random()*captcha_code.length))
        }
        
        res.cookie('captcha',captcha)
            return res.render('login',{
                captchaCode:captcha
            }) 
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
}


const AdminLoginData = async(req,res)=>{
    try{
        req.flash('success',"login Successfully");
        console.log(req.body.captcha)
    
        if(req.cookies.captcha==req.body.captcha){
            res.clearCookie('captcha');
            return res.redirect('/admin/dashboard')
        }
        else{
            console.log("invalid captcha");
            return res.redirect("/admin");
        }
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
   
   

}

const dashboard= async(req,res)=>{

try{
    var adminData =await admin.find().countDocuments();

    var sliderData =await slider_model.find().countDocuments();
    var sliderActiveData =await slider_model.find().countDocuments({status : true});
    var sliderDeaactiveData =await slider_model.find().countDocuments({status : false})
 
    var offerData =await offer_model.find().countDocuments();
    var offerActiveData =await offer_model.find().countDocuments({status : true});
    var offerDeaactiveData =await offer_model.find().countDocuments({status : false})
    
 
 
   return res.render('dashboard',{
     adminData : adminData,
     sliderData : sliderData,
     sliderActiveData : sliderActiveData,
     sliderDeaactiveData : sliderDeaactiveData,
 
     offerData,offerActiveData, offerDeaactiveData
   })
}catch(err){
    console.log(err)
    return res.redirect('back')
}
  
}

const addAdmin=async(req,res)=>{
    return res.render('add_admin')
}

const viewAdmin=async(req,res)=>{
    try {
        var search="";
        if(req.query.search){
            search=req.query.search;
        }
        
        var page=0;
        var per_page=2;
        if(req.query.page){
            page=req.query.page
        }
    
        let allData=await admin.find({
            $or:[
                {name: {$regex:search, $options:'i'}},
                {email: {$regex:search, $options:'i'}}
            ]
        }).countDocuments();
        let totalPage =Math.ceil(allData/per_page);
    
        var viewData =await admin.find({
            $or:[
                {name: {$regex:search, $options:'i'}},
                {email: {$regex:search, $options:'i'}}
            ]
        })
        .skip(page*per_page)
        .limit(per_page)
    
        return res.render('view_admin',{
            viewData:viewData,
            search : search,
            totalPage : totalPage,
            currentPage :page,
        })
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }

}

const adminInsertData=async (req,res) =>{
    try{
        console.log(req.file);
        var img = "";
        if (req.file) {
            img = admin.ipath + "/" + req.file.filename;
        }
        
        req.body.image = img;
        req.body.status = true;
        req.body.name=req.body.fname+" "+req.body.lname;
        
        console.log(req.body);
        
        await admin.create(req.body);
        req.flash('success',"add data success");
        return res.redirect("back");
    }catch(err){
    console.log(err)
    return res.redirect('back')
    }
  
    
}

const deleteAdminRecord = async(req,res)=>{
    try{
        const deteleAdmin = await admin.findById(req.params.id);

        if (deteleAdmin) {
            var ipath = path.join(__dirname,'..',deteleAdmin.image)
            await fs.unlinkSync(ipath);
        }
    
        await admin.findByIdAndDelete(req.params.id);
        req.flash('success','delete data successfully');
        req.flash('error','not delete data!!');
        return res.redirect('back');
    }catch(err){
    console.log(err)
    return res.redirect('back')
    }
    
}

const updateAdminRecord=async(req,res)=>{
    try{
        let updatedata = await admin.findById(req.query.id);
        return res.render('update_Admin',{
            admindata : updatedata
         })
    }catch(err){
        console.log(err)
        return res.redirect('back')
        }
    
}

const adminEditData =async(req,res)=>{
    try{
        const editData = await admin.findById(req.body.id);
        if(req.file){
            if (editData) {
                var ipath = path.join(__dirname,'..',editData.image);
                try{
                    await fs.unlinkSync(ipath);

                }
                catch(err){
                    console.log(err);
                }
            }
            
                req.body.image =admin.ipath+"/"+req.file.filename;
            
            }
            else{
                const editData = await admin.findById(req.body.id);
                if(editData){
                    req.body.image = editData.image;
                }
            }
            
            
            req.body.name=req.body.fname+" "+req.body.lname; 
        await admin.findByIdAndUpdate(req.body.id,req.body);
        console.log(req.body.id,req.body)
        console.log(req.body.name);
        req.flash('success','update data successfully')

        return res.redirect("/admin/view_admin")
        }catch(err){
            console.log(err)
            return res.redirect('back')
        }
        
}

const profile= async(req,res)=>{
    
    return res.render('profile')
}

const ChangePassword =async(req,res)=>{
    return res.render('ChangePassword')
}

const AdminChangePassword=async(req,res)=>{
    try{
        var dbpass=req.user.password
        if(dbpass == req.body.current_password){
            if(req.body.current_password != req.body.new_password){
                if(req.body.new_password == req.body.conform_password){
                    await admin.findByIdAndUpdate(req.user._id,{
                        password:req.body.new_password
                    })
                    return res.redirect('/admin/logout');
                }
                else{
                    console.log(" Password no update");
                return res.redirect('/admin');
                }
            
            }
            else{
                console.log("New Password and Confirm Password are same");
                return res.redirect('/admin');
            }
        }
        else{
            console.log("dbpassword and current password not match");
            return res.redirect('/admin');
        }
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
}

const ForgetPassWord =async(req,res)=>{
    return res.render('ForgottenPassword');
}

const ForgottenPasswordForm=async(req,res)=>{
    try{
        const checkEmail=await admin.findOne({email:req.body.email})
    if(checkEmail){
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: "asodariyashyam555@gmail.com",
              pass: "faziibbmovatlyqg",
            },
          });

          const otp=Math.round(Math.random()*1000000)
          res.cookie('otp',otp)
          res.cookie('email',req.body.email)

          const msg=`<h1>shyam Institute</h1><b>OTP : ${otp}</b><br><a href="http://localhost:8010/admin/olginforgottenpass">forgotten password</a>`

          const info = await transporter.sendMail({
            from: 'asodariyashyam555@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "Your OTP is here ✔", // Subject line
            text: "Hello world?", // plain text body
            html: msg, // html body
          });

          return res.redirect("/admin/VerifyOTP")

    }
    else{
        console.log("invalid email")
        return res.redirect('back')
    }
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
   
        
  
}

const  VerifyOtp=(req,res)=>{
    return res.render("VerifyOTP")
}

const verifyOtpForm=async (req,res)=>{
    try{
        if(req.body.otp==req.cookies.otp){
            res.clearCookie('otp')
           return res.redirect('/admin/olginforgottenpass')
    
        }
        else{
            console.log("OTP not verify");
        }
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
   
}

const olginforgottenpass =async (req,res) => { 
    return res.render('olginforgottenpass')
 }

 const loginEditPassword=async(req,res)=>{
    try{
        console.log(req.body);
    console.log(req.cookies.email);

    if(req.body.npass == req.body.cpass){

        var email=req.cookies.email;
        const checkEmail =await admin.findOne({email:email});

        if(checkEmail){
            let changepass=await admin.findByIdAndUpdate(checkEmail.id,{
                password : req.body.npass
            })

            if(changepass){
                res.clearCookie("email")
                return res.redirect('/admin');
            }
            else{
                console.log("password not changed")
                return res.redirect('back');
            }
        }
        else{
            return res.redirect('back');
        }
    }
    else{
        console.log("invalid email")
        return res.redirect('back');
    }
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
    

 }

 const deactive=async(req,res)=>{
    let deactiveData=await admin.findByIdAndUpdate(req.params.id ,{status:false})
    if(deactiveData){
        req.flash('success',"Admin Deactivated Successfully");
        return res.redirect('back')
    }

 }

 const active=async(req,res)=>{
    let deactiveData=await admin.findByIdAndUpdate(req.params.id ,{status:true})
    if(deactiveData){
        req.flash('success',"Admin activated Successfully");
        return res.redirect('back')
    }

 }

 const multipleDelete =async(req,res)=>{
    const multipleData = await admin.deleteMany({ _id: { $in: req.body.adminIds } });
    if(multipleData){
        return res.redirect("back");
    }
    else{
        return res.redirect("back");
    }
 }
module.exports = {
    dashboard , addAdmin , viewAdmin , adminInsertData , 
    deleteAdminRecord ,updateAdminRecord , adminEditData , login  , 
    AdminLoginData ,profile  , ChangePassword , AdminChangePassword ,
    ForgetPassWord , ForgottenPasswordForm ,VerifyOtp , verifyOtpForm ,
    olginforgottenpass ,loginEditPassword ,deactive ,active , multipleDelete
}