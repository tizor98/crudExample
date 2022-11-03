const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
      const visited = products.filter( item => item.category == "visited" );
      const inSale = products.filter( item => item.category == "in-sale" );

		res.render("index", {visited: visited, inSale: inSale});
	},
};

module.exports = controller;
