const express=require('express');

const routes=express.Router();

const userPanel =require('../controllers/user-panelctl')

const comment_model =require('../models/Comment_model')

routes.get('/',userPanel.home);

routes.get('/blog_single/:id',userPanel.blog_single);

routes.post('/userComment',comment_model.uploadimage,userPanel.userComment)

routes.get('/about',userPanel.about)

routes.get('/contact',userPanel.contact)

routes.get('/work_columns',userPanel.work_columns)




module.exports= routes