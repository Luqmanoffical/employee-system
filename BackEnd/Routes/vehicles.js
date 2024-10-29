const express= require('express')
const router = express.Router()

const {postdata,getdata ,getcusterexcel,updatedata,deletedata} =require('../Controller/vehiclesController') ;

//Get Request All and By ID

router.route('/post/E-vehicles').post(postdata)
router.route('/getexcel/:id').get(getcusterexcel)
router.route('/get/E-vehicles').get(getdata)
router.route('/delete/:id').delete(deletedata)
router.route('/update/:id').put(updatedata)



module.exports= router;