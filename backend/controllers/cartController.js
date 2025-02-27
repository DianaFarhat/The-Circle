const Cart= require("../models/cartModel");
const User= require("../models/userModel");
const Product= require("../models/productModel");



exports.addToCart= async (req, res) => {
    try{
        //1. Check if the cart owner still exists
        const cartOwner= await User.findOne({_id: req.user._id}); 
        if (!cartOwner){
            return res.status(404).json({message: "The cart must have an owner"});
        }

        //2. Check if the cart already exists
        const cart= await Cart.findOne({cartOwner: cartOwner._id});

        //3. Check if the products are in the database
        const product= await Product.findOne({_id: req.body.product});
        if(!product){
            return res.status(404).json({mesage: "Product not found"});
        }
        let productPrice= product.productPrice;
        let productQuantity= req.body.productQuantity;
        product.productQuantity= product.productQuantity - productQuantity;

        await product.save();

        if(!cart){
            const newCart= await Cart.create({
                cartOwner: cartOwner._id,
                products: [req.body.product],
                totalPrice: price,
            });

            return res.status(200).json(newCart);
        }
        cart.products.push(req.body.product);
        cart.totalPrice= cart.totalPrice + price;

        await cart.save();

        return res.status(200).json({cart});

        if(productQuantity < product.productQuantity){
            return res.status(409).json({message: "Sorry, we don't have the required quantity"});
        }

        let price= productPrice*productQuantity;

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

