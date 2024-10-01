import { ObjectId } from 'mongodb';
import HttpError from '../../services/httpErrorService.js';
import Cart from '../../models/cart-model.js';
import Tax from '../../models/tax-model.js';
import Coupon from '../../models/coupon-model.js';
import CartItem from '../../models/cart-item-model.js';

/**
 * Adds a product to the cart.
 *
 * @param {Object} req - The request object containing the product, session ID, user ID, and quantity.
 * @returns {Object} An object with the status and message indicating the result of the operation.
 */
const addToCart = async req => {
    const { product, sessionId, userId, quantity } = req;
    const productID = new ObjectId(product._id);

    // Check if the product is already in the cart
    const cart = await Cart.findOne({
        sessionId
    });

    if (cart) {
        // Check if the product is already in the cart
        const productInCart = await CartItem.findOne({
            cartId: cart._id,
            productId: productID
        });

        if (productInCart) {
            const updatedQuantity = Math.max(
                productInCart.quantity + quantity,
                0
            );

            // Update the quantity in the cart item
            await CartItem.findOneAndUpdate(
                { cartId: cart._id, productId: productID },
                {
                    $set: {
                        quantity: updatedQuantity,
                        totalPrice: updatedQuantity * productInCart.unitPrice
                    }
                }
            );
        } else {
            // Insert cart item
            const cartItemData = {
                cartId: cart._id,
                productId: productID,
                quantity,
                unitPrice: product.price,
                totalPrice: product.price * quantity
            };

            const cartItem = new CartItem(cartItemData);
            await cartItem.save();
        }

        // Calculate the subtotal of the cart
        await calculateSubtotal(cart._id);
    } else {
        // Get all the taxes
        const taxes = await Tax.find({});

        let totalTax = 0;

        if (taxes) {
            // Loop through the taxes and calculate the total tax amount
            taxes.forEach(tax => {
                totalTax += (product.price * tax.rate) / 100;
            });
        }

        const cartData = {
            sessionId,
            userId,
            subTotal: product.price,
            total: product.price + totalTax,
            tax: totalTax
        };

        // Create a new cart
        const newCart = new Cart(cartData);
        await newCart.save();

        // Insert cart item
        const cartItemData = {
            cartId: newCart._id,
            productId: productID,
            quantity,
            unitPrice: product.price,
            totalPrice: product.price * quantity
        };

        const cartItem = new CartItem(cartItemData);
        await cartItem.save();
        // Calculate the subtotal of the cart
        await calculateSubtotal(newCart._id);
    }

    return {
        status: 'success',
        message: 'Product added to cart'
    };
};

/**
 * Removes a product from the cart based on the sessionId and productId.
 *
 * @param {string} sessionId - The session ID of the cart.
 * @param {string} productId - The ID of the product to be removed.
 * @returns {Promise<Object>} - A promise that resolves to an object with status and message properties.
 */
const removeFromCart = async (sessionId, productId) => {
    productId = new ObjectId(productId);

    // First, find the cart based on the sessionId
    const cart = await Cart.findOne({ sessionId });

    if (cart) {
        // If the cart is found, use the cart's _id to update the cart_items table
        const currentTime = new Date();
        await CartItem.updateMany(
            { cartId: cart._id, productId },
            { $set: { deletedAt: currentTime } }
        );

        // Check how many items are left in the cart
        const cartItems = await CartItem.find({
            cartId: cart._id,
            $or: [
                { deletedAt: null }, // Check if deletedAt is null
                { deletedAt: { $exists: false } } // Check if deletedAt field does not exist
            ]
        });

        if (cartItems.length === 0) {
            // If there are no items left in the cart, delete the cart
            await Cart.findOneAndDelete({ _id: cart._id });
        } else {
            // Calculate the subtotal of the cart
            await calculateSubtotal(cart._id);
        }
    }

    return {
        status: 'success',
        message: 'Product removed from cart'
    };
};

/**
 * Decrements the quantity of a product in the cart.
 * @param {string} sessionId - The session ID of the cart.
 * @param {object} req - The request object containing the product ID.
 * @returns {object} - The status and message indicating the success of the operation.
 */
const decrementQuantity = async (sessionId, req) => {
    let { productId } = req;
    productId = new ObjectId(productId);

    // First, find the cart based on the sessionId
    const cart = await Cart.findOne({ sessionId });

    if (cart) {
        // Find the cart item based on the cart ID and product ID
        const cartItem = await CartItem.findOne({
            cartId: cart._id,
            productId
        });

        if (cartItem) {
            // Check if the cartItem.quantity is 1
            if (cartItem.quantity === 1) {
                // If the quantity is 1, remove the product from the cart
                await CartItem.findOneAndUpdate(
                    { cartId: cart._id, productId },
                    { $set: { deletedAt: new Date() } }
                );
            } else {
                // Calculate the updated quantity (decrement by 1)
                const updatedQuantity = Math.max(cartItem.quantity - 1, 0); // Ensure quantity doesn't go below zero

                // Update the quantity in the cart item
                await CartItem.findOneAndUpdate(
                    { cartId: cart._id, productId },
                    {
                        $set: {
                            quantity: updatedQuantity,
                            totalPrice: updatedQuantity * cartItem.unitPrice
                        }
                    }
                );
            }
        }

        // Calculate the subtotal of the cart
        await calculateSubtotal(cart._id);
    }

    return {
        status: 'success',
        message: 'Product quantity decremented'
    };
};

/**
 * Calculates the subtotal of a cart and updates the cart's subTotal field.
 * Also triggers the calculation of total taxes for the cart.
 *
 * @param {string} cartID - The ID of the cart.
 * @throws {HttpError} If an error occurs during the calculation.
 * @returns {Promise<void>} A promise that resolves once the calculation is complete.
 */
const calculateSubtotal = async cartID => {
    try {
        const getBaseAggregation = () => {
            return Cart.aggregate([
                {
                    $match: { _id: cartID }
                },
                {
                    $lookup: {
                        from: 'cartItems',
                        localField: '_id',
                        foreignField: 'cartId',
                        as: 'cartItems'
                    }
                }
            ]);
        };

        const cart = await getBaseAggregation().exec();

        let subTotal = 0;

        cart[0].cartItems.forEach(item => {
            subTotal += item.unitPrice * item.quantity;
        });

        // Update the cart's subTotal
        await Cart.findOneAndUpdate({ _id: cartID }, { $set: { subTotal } });
        await calculateTotalTaxes(cartID, subTotal);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Calculates the total taxes for a given cart and updates the cart's tax value.
 * @param {string} cartID - The ID of the cart.
 * @param {number} subTotal - The subtotal of the cart.
 * @throws {HttpError} If an error occurs while calculating the total taxes.
 */
const calculateTotalTaxes = async (cartID, subTotal) => {
    try {
        const totalTaxes = await fetchTotalTaxes();

        console.error('totalTaxes', totalTaxes);

        let tax = 0;

        if (totalTaxes !== 0) {
            tax = subTotal * totalTaxes / 100;

            console.error('tax', tax);

            // Update the cart's total tax
            await Cart.findOneAndUpdate({ _id: cartID }, { $set: { tax } });
        }

        await calculateDiscount(cartID, subTotal, tax);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Calculates the discount for a given cart based on the applied coupon.
 *
 * @param {string} cartID - The ID of the cart.
 * @param {number} subTotal - The subtotal of the cart.
 * @param {number} tax - The tax amount for the cart.
 * @returns {Promise<void>} - A promise that resolves when the discount calculation is complete.
 * @throws {HttpError} - If there is an error during the discount calculation.
 */
const calculateDiscount = async (cartID, subTotal, tax) => {
    try {
        // Check if coupon has applied to the cart
        const cart = await Cart.findOne({
            _id: cartID
        });

        let discount = 0;

        if (cart && cart.couponId) {
            // If coupon has been applied, calculate the discount
            const coupon = await Coupon.findOne({
                _id: cart.couponId
            });

            if (coupon) {
                if (coupon.type === 'percentage') {
                    discount = subTotal * coupon.amount / 100;
                } else {
                    discount = coupon.amount;
                }

                // Update the cart's discount
                await Cart.findOneAndUpdate(
                    {
                        _id: cartID
                    },
                    {
                        $set: { discount }
                    }
                );
            }
        }
        await calculateTotal(cartID, subTotal, tax, discount);
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Calculates the total amount for a cart and updates the cart's total.
 *
 * @param {string} cartID - The ID of the cart.
 * @param {number} subTotal - The subtotal amount of the cart.
 * @param {number} tax - The tax amount to be applied.
 * @param {number} discount - The discount amount to be applied.
 * @throws {HttpError} If there is an error updating the cart's total.
 */
const calculateTotal = async (cartID, subTotal, tax, discount) => {
    try {
        const total = subTotal + tax - discount;

        // Update the cart's total
        await Cart.findOneAndUpdate({ _id: cartID }, { $set: { total } });
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Finds a cart based on the specified type and value.
 * @param {string} type - The type of search criteria ('sessionID', 'orderID', or any other field name).
 * @param {string} value - The value to search for.
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message, and retrieved cart.
 * @throws {HttpError} If an error occurs during the database operation.
 */
const findCart = async (type, value) => {
    let cart;

    let filterType = {};

    if (type === 'sessionID') {
        filterType = { sessionId: value };
    } else if (type === 'orderID') {
        filterType = { orderID: value };
    } else {
        filterType = { _id: value };
    }

    try {
        const getBaseAggregation = () => {
            return Cart.aggregate([
                {
                    $match: filterType
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'cartItems',
                        localField: '_id',
                        foreignField: 'cartId',
                        as: 'cartItems'
                    }
                },
                {
                    $unwind: '$cartItems' // Unwind the 'subcategory' array
                },
                {
                    $lookup: {
                        from: 'coupons',
                        localField: 'couponId',
                        foreignField: '_id',
                        as: 'coupon'
                    }
                }
            ]);
        };

        cart = await getBaseAggregation().exec();

        return {
            status: 'success',
            message: 'Cart retrieved successfully',
            cart
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Fetches the total taxes by calculating the sum of all tax rates.
 * @returns {number} The total tax amount.
 * @throws {HttpError} If there is an error while fetching the taxes.
 */
const fetchTotalTaxes = async () => {
    try {
        const taxes = await Tax.find({});
        let totalTax = 0;

        if (taxes) {
            // Loop through the taxes and calculate the total tax amount
            taxes.forEach(tax => {
                totalTax += parseFloat(tax.rate, 2);
            });
        }

        return totalTax;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Saves the checkout data for a cart.
 *
 * @param {Object} req - The request object containing the checkout data.
 * @param {string} req.sessionId - The session ID of the cart.
 * @param {string} req.userId - The ID of the user associated with the cart.
 * @param {string} req.shippingAddressId - The ID of the shipping address for the cart.
 * @param {string} req.deliveryInstruction - The delivery instruction for the cart.
 * @returns {Object} - The response object containing the status, message, and updated cart.
 * @throws {HttpError} - If the cart is not found.
 */
const saveCheckoutData = async req => {
    const { sessionId, userId, shippingAddressId, deliveryInstruction } = req.body;

    // Get cart by sessionId
    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
        throw new HttpError('Cart not found', 404);
    }

    // Update the cart with the checkout data
    await Cart.findOneAndUpdate(
        { sessionId },
        {
            $set: {
                shippingAddressId,
                deliveryInstruction,
                userId
            }
        }
    );

    const newCart = await findCart('sessionID', sessionId);

    return {
        status: 'success',
        message: 'Checkout data saved successfully',
        cart: newCart.cart
    };
};

export default {
    addToCart,
    removeFromCart,
    decrementQuantity,
    findCart,
    calculateSubtotal,
    calculateTotalTaxes,
    calculateTotal,
    calculateDiscount,
    saveCheckoutData
};
