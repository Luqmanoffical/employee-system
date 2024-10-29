const express= require('express')
const router = express.Router()


const {postdata,getdata,getcusterexcel,deletedata,updatedata} =require('../Controller/employeeSalaryController') ;

//Get Request All and By ID

router.route('/post/Esalary').post(postdata)
router.route('/getexcel/:id').get(getcusterexcel)
router.route('/get/Esalary').get(getdata)
router.route('/delete/:id').delete(deletedata)
router.route('/update/:id').put(updatedata)



module.exports= router;