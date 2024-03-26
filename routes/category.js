const express=require('express');

const routes=express.Router();

const categoryCtl=require('../controllers/categoryCtl');

routes.get('/add_category',categoryCtl.add_category);

routes.post('/categoryInsertData',categoryCtl.categoryInsertData);

routes.get('/view_category',categoryCtl.view_category)

routes.get('/deactive/:id',categoryCtl.deactive)

routes.get('/active/:id',categoryCtl.active)

module.exports= routes