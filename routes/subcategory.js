const express=require('express');

const routes=express.Router();

const subcategoryCtl=require('../controllers/subcategoryCtl')

const subcategory_model=require('../models/subcategory_model')

routes.get('/add_subcategory',subcategoryCtl.add_subcategory);

routes.post('/subcategoryInsertData',subcategory_model.subimage,subcategoryCtl.subcategoryInsertData)

routes.get('/view_subcategory',subcategoryCtl.view_subcategory)

routes.get('/deactive/:id',subcategoryCtl.deactive)

routes.get('/active/:id',subcategoryCtl.active)


module.exports= routes