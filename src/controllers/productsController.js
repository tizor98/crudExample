const { json } = require('express');
const fs = require('fs');
const path = require('path');

// Guardando la ubicación de los datos
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

// const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Controladores
const controller = {
	// Root - Show all products
	products: (req, res) => {
		res.render("products", {products: products});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
      // Se filtra el producto por el id
      const product = products.find( element => element.id == req.params.id);
		res.render("detail", { product:product });
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
      // Se agrega el nuevo producto al array
      products.push( {
         id: products.length + 1,
         name: req.body.name,
         price: parseInt(req.body.price),
         discount: parseInt(req.body.discount),
         category: req.body.category,
         description: req.body.description,
         image: req.file.filename, // Contiene el nombre dado por librería Multer al archivo que subió el cliente
      });

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
      // Filtra producto a editar
      let product = products.find( element => element.id == req.body.id);
      
      // Elimina imagen anterior del producto
      fs.unlinkSync(path.join(__dirname, "../../public/images/products", product.image));
      
      // Asigna nuevos valores a cada atributo
      // Asignandolos de esta forma se actualiza automaticamente en array products
      product.id = parseInt(req.body.id);
      product.name = req.body.name;
      product.price = parseInt(req.body.price);
      product.discount = parseInt(req.body.discount);
      product.category = req.body.category;
      product.description = req.body.description;
      product.image = req.file.filename;
      
      // Rescribe el archivo .json
      fs.writeFileSync(productsFilePath, JSON.stringify(products));
      
      res.render("products", {products: products});
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
      // Elimina imagen actual del producto a borrar
      const imageProduct = products.find( element => element.id == req.params.id).image;
      fs.unlinkSync(path.join(__dirname, "../../public/images/products", imageProduct));
		
      // Filtra lista de productos sin producto a borrar, para sobreescribir en .json
      products = products.filter( element => element.id != req.params.id);
      fs.writeFileSync(productsFilePath, JSON.stringify(products));
      
      // Redirije a página principal de productos
      res.redirect("/products");
	}
};

module.exports = controller;