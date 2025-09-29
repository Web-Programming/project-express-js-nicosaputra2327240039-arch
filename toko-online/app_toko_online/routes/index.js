var express = require('express');
var router = express.Router();
var mainController = require('../controllers/main');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'toko online sederhana', products:products });
// });

// router.get('/search', function(req, res, next) {
//   let q = req.query.q || '';
//   let filteredProducts;

//   if (q.trim() === '') {
//     filteredProducts = products;
//   } else {
//     filteredProducts = products.filter(p =>
//       p.name.toLowerCase().includes(q.toLowerCase())
//     );
//   }

//   res.render('index', { 
//     title: 'Hasil Pencarian', 
//     products: filteredProducts,
//     query: q 
//   });
// });

router.get("/", mainController.index);
module.exports = router;
