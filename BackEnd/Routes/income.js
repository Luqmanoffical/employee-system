const express= require('express')
const router = express.Router()

const {postdata,getdata,getcusterexcel, deletedata,updatedata } =require('../Controller/incomeController') ;

//Get Request All and By ID

router.route('/post/E-income').post(postdata)
router.route('/getexcel/:id').get(getcusterexcel)
router.route('/get/E-income').get(getdata)
router.route('/delete/:id').delete(deletedata)
router.route('/update/:id').put(updatedata)



module.exports= router;