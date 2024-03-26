const express=require('express');

const routes=express.Router();

const commentCtl= require('../controllers/commentCtl')

routes.get('/view_comment',commentCtl.view_comment)

module.exports= routes