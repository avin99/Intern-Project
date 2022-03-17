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
const {gettrips,settrip,updatetrip,deletetrip,startTrip,endTrip,uploads,podStatus} = require('../controllers/tripController')

const { protect,isExecutive } = require('../middleware/authMiddleware')

router.route('/').get(protect,gettrips).post(protect,settrip)
router.route('/:id').delete(protect,deletetrip).put(protect,updatetrip)

router.post('/start',protect, startTrip)
router.post('/end',protect,upload.single("image"), endTrip)
router.get('/uploads',isExecutive,uploads)
router.put('/uploads/podStatus/:id',podStatus)

module.exports = router