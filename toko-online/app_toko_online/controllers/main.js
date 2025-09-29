var products = require('../../data/products.json');

const index = (req, res) =>{
    res.render('index',{
        title: 'Toko online Nico',
        products:products
    });
};

module.exports={index};