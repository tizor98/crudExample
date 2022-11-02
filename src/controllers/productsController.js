const fs = require('fs');
const path = require('path');

// Ejecutando lo necesario para subir archivos con Multer
const multer = require("multer");

const storage = multer.diskStorage( { // En qué carpeta se guardarán los archivos y cómo se nombrarán
   destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images"));
   },
   filename: (req, file, cb) => {
      const newFileName = Date.now() + "_img_" + path.extname(file.originalname);
      cb(null, newFileName);
   }
})

const upload = multer({storage: storage}) // establece la configuración para guardar archivos, se usa en los get

// Guardando la ubicación de los datos
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Controladores
const controller = {
	// Root - Show all products
	products: (req, res) => {
		res.render("products", {products: products});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
      const product = products.find( element => element.id == req.params.id);
		res.render("detail", { product:product });
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		products.push(req.body);
      fs.writeFileSync(productsFilePath, JSON.stringify(products));
      res.render("products", {products: products});
	},

	// Update - Form to edit
	edit: (req, res) => {
      const product = products.find( element => element.id == req.params.id);
		res.render("product-edit-form", {product: product});

	},
	// Update - Method to update
	update: (req, res) => {
      products.find( element => element.id == req.params.id) = req.body;
      fs.writeFileSync(productsFilePath, JSON.stringify(products));
      res.render("products", {products: products});
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products = products.filter( element => element.id != req.params.id);
      fs.writeFileSync(productsFilePath, JSON.stringify(products));
      res.render("products", {products: products});
	}
};

module.exports = controller;