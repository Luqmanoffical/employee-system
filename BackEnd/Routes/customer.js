const express= require('express')
const router = express.Router()

const {postdata,getdata , getcusterexcel,deletedata, updatedata ,chartdata} =require('../Controller/customerController') ;

//Get Request All and By ID

router.route('/post/E-customer').post(postdata)
router.route('/getexcelcustomer/:id').get(getcusterexcel)
router.route('/delete/:id').delete(deletedata)
router.route('/update/:id').put(updatedata)
router.route('/get/E-customer').get(getdata)
router.route('/chartdata').get(chartdata)



module.exports= router;