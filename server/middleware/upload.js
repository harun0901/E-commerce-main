const multer = require('multer');
const dir = './public/images/uploads';
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({

  // image/png,image/jpg,image/jpeg
  destination: (req, file, callback) => {
    console.log(__dirname)
    callback(null, path.join(__dirname, '../uploads/'));

    // console.log(file.mimetype);
    // if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    // callback(null, dir);
    // } else {
    // callback({
    // error:"error"
    // });
    // }
  },
  filename: (req, file, callback) => {
    const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-');
    callback(null, uuidv4() + '-' + fileName);
  }

});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10485760
  },
  fileFilter: function (req, file, callback) {
    console.log(file, 'file si the', req.body);
    
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      callback(null, true);
    } else {
      callback(null, false)
    }
  },
});

module.exports = upload