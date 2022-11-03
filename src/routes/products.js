// ************ Require's ************
const express = require('express');
const router = express.Router();
const path = require("path");

// Ejecutando lo necesario para subir archivos con Multer
const multer = require("multer");

const storage = multer.diskStorage( { // En qué carpeta se guardarán los archivos y cómo se nombrarán
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../public/images/products"));
   },
   filename: (req, file, cb) => {
      const newFileName = Date.now() + "_img_" + path.extname(file.originalname);
      cb(null, newFileName);
   }
})

const upload = multer({storage: storage}) // establece la configuración para guardar archivos, se usa en los get

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.products); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/', upload.single("productImage"), productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/edit/:id', productsController.edit); 
router.put('/', upload.single("productImage"), productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;
