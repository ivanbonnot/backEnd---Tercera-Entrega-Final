const productModel = require("../models/productModel")
const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")

class ControllerMongoDb {

    //___USER__//

    saveUser = async (userToAdd) => {
        const user = new userModel(userToAdd);
        await user.save();
        console.log("guardado", user)
    };

    getAll = async () => await userModel.find({});

    getUser = async (email) => await userModel.findOne({ email: email });

    updateUser = async (id, userToUpdate) => {
        return await userModel.updateOne(
            { _id: id },
            { $set: { ...userToUpdate } }
        );
    };

    deleteUser = async (id) => await userModel.deleteOne({ _id: id });


    //___PRODUCT___//
   
    saveProduct = async (productToAdd) => {
        const product = new productModel(productToAdd);
        await product.save();
        console.log("guardado", product)
    };

    getProducts = async () => await productModel.find({});

    getProductById = async (id) => await productModel.findOne({ _id: id });

    updateProduct = async (id, productToUpdate) => {
        return await productModel.updateOne(
            { _id: id },
            { $set: { ...productToUpdate } }
        );
    };

    deleteProduct = async (id) => await productModel.deleteOne({ _id: id });


    //___CART___//
    
    saveCart = async (cartToAdd) => {
        const cart = new cartModel(cartToAdd);
        return await cart.save();
    };

    getCarts = async () => await cartModel.find({});

    getCartById = async (id) => await cartModel.findOne({ _id: id });

    deleteCart = async (id) => await cartModel.deleteOne({ _id: id });

    addProductInCart = async (id, id_prod) => {
        const cart = await this.getCartById(id);

        const isInCart = () =>
            cart.productos.find((product) => product.id === id_prod) ? true : false;

        if (!isInCart()) {
            await cartModel.updateOne(
                { _id: id },
                {
                    $set: {
                        productos: [...cart.productos, { id: id_prod }],
                    },
                }
            );
            return;
        }

        const indexProductUpdate = cart.productos.findIndex(
            (product) => product.id === id_prod
        );

        cart.productos[indexProductUpdate].quantity += quantity;

        await cartModel.updateOne(
            { _id: id },
            { $set: { productos: [...cart.productos] } }
        );
    };

    deleteProductInCart = async (id_cart, id_prod) => {
        const cart = await cartModel.findOne({ _id: id_cart });

        const productsUpdate = cart.productos.filter(
            (product) => product.id !== id_prod
        );

        await cartModel.updateOne(
            { _id: id_cart },
            { $set: { productos: [...productsUpdate] } }
        );
    };

}

const dbController = new ControllerMongoDb();

module.exports = dbController;
