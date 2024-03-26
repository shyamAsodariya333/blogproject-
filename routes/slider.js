const express=require('express');

const sliderClt=require('../controllers/sliderctl')

const slide= require('../models/slider-model');

const routes=express.Router();


routes.get('/add_slider' ,sliderClt.add_slider)

routes.post('/sliderInsertData',slide.sliderimage,sliderClt.sliderInsertData);

routes.get('/view_slider',sliderClt.view_slider)

routes.get('/deactive/:id',sliderClt.deactive);

routes.get('/active/:id',sliderClt.active);

module.exports= routes