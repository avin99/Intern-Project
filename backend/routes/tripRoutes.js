//bringing express so that we can use it in this file
const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
//this specifies a folder where multer will try to store all incoming files 
const upload = multer({storage:storage , fileFilter:fileFilter})
//receiving functions from controllers
const {gettrips,settrip,updatetrip,deletetrip,startTrip,endTrip,uploads,podStatus,ledgers,getMsg,paymentReq,payments} = require('../controllers/tripController')

const { protect,isExecutive, isAdmin } = require('../middleware/authMiddleware')

router.route('/').get(protect,gettrips).post(isAdmin,settrip)
router.route('/:id').delete(isAdmin,deletetrip).put(isAdmin,updatetrip)
router.get('/message',protect,getMsg)
router.post('/start/:id',protect, startTrip)
router.post('/end/:id',protect,upload.single("image"), endTrip)
router.get('/uploads',isExecutive,uploads)
router.put('/uploads/podStatus/:id',podStatus)
router.get('/uploads/paymentReq',isExecutive,paymentReq)
router.get('/uploads/payments',payments)

module.exports = router