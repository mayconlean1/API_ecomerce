const multer = require ('multer')
const path = require ('path')
const storage = multer.diskStorage({
    destination: function (req, file, callback){
        const dirPath = __dirname.replace(/\\src\\utils/gi , '')
        
        callback(null /*error*/ , path.join(dirPath, './imagens' ))
    },
    filename: function(req, file, callback){
        callback(
            null /*error*/,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
            // new Date().toISOString() + file.originalname
        )
    }
})

const fileFilter = function (req, file, callback){
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callback(null, true)  
    }
    else{
        callback(null, false)
    } 

}

const upload = multer({ 
    storage: storage,
    limits:{
        fileSize: 1024* 1024* 5
    },
    fileFilter : fileFilter 
})

// const upload = multer ({dest:'uploads/'})

module.exports = upload
