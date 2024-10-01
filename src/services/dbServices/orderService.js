import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Order from '../../models/order-model.js';
import Cart from '../../models/cart-model.js';
import email from '../../utils/emailTemplates.js';
import { ObjectId } from 'mongodb';
import OrderItem from '../../models/order-item-model.js';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves orders based on the provided request parameters.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the retrieved orders.
 * @throws {HttpError} - If an error occurs while retrieving the orders.
 */
const get = async req => {
    let orders;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const status = req.query.status || DEFAULTS.STATUS;
        const startDate = req.query.start || '';
        const endDate = req.query.end || '';
        const sort = req.query.sort === 'asc' ? 1 : -1;
        const regex = /\b[dD](e(l(et?)?)?|l(et?)?|l)\b/i;

        const filter = {
            $or: [
                { 'user.name': { $regex: searchText, $options: 'i' } },
                {
                    $and: [
                        { status: { $regex: searchText, $options: 'i' } },
                        { deletedAt: { $eq: null } }
                    ]
                },
                { orderNumber: { $regex: searchText, $options: 'i' } }
            ]
        };

        if (status !== DEFAULTS.STATUS) {
            filter.status = status;
            filter.deletedAt = null;
        }

        // SearchText deleted data
        if (regex.test(searchText)) {
            filter.$or.push({ deletedAt: { $ne: null } });
        }

        // apply filter for price field only if searchText string is a number
        const priceRegex = /^\d+$/;

        if (priceRegex.test(searchText)) {
            filter.$or.push({ discount: { $eq: parseInt(searchText) } });
        }

        if (startDate && endDate) {
        // Convert startDate and endDate to Date objects
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Extract date part (year-month-day) from startDate and endDate
            const startYearMonthDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endYearMonthDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

            // Adjust end date to include the entire day
            endYearMonthDay.setDate(endYearMonthDay.getDate() + 1);

            // Filter createdAt field based on the date part
            filter.createdAt = {
                $gte: startYearMonthDay,
                $lt: endYearMonthDay
            };
        }

        const getBaseAggregation = () => {
            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user' // Unwind the 'category' array
                },
                {
                    $lookup: {
                        from: 'shippingAddresses',
                        localField: 'addressId',
                        foreignField: '_id',
                        as: 'address'
                    }
                },
                {
                    $unwind: '$address' // Unwind the 'subcategory' array
                },
                {
                    $match: filter
                }
            ];

            return Order.aggregate(pipeline);
        };

        orders = await getBaseAggregation()
            .sort({ orderNumber: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await Order.countDocuments(filter);

        return {
            status: 'success',
            total,
            page,
            limit,
            orders
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Finds a order by its ID.
 * @param {string} orderId - The ID of the order to find.
 * @returns {Promise<Object>} - A promise that resolves to the found order object.
 * @throws {HttpError} - If the order ID is invalid or the order is not found.
 */
const find = async orderId => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new HttpError('Invalid Order ID format', 400);
        }

        orderId = mongoose.Types.ObjectId(orderId);
        // const order = await Order.findById(orderId);

        let order = await Order.aggregate([
            {
                $match: { _id: orderId }
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
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'shippingAddresses',
                    localField: 'shippingAddressId',
                    foreignField: '_id',
                    as: 'address'
                }
            },
            {
                $unwind: '$address'
            },
            {
                $lookup: {
                    from: 'orderItems',
                    localField: '_id',
                    foreignField: 'orderId',
                    as: 'orderItems'
                }
            },
            {
                $unwind: '$orderItems'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.productId',
                    foreignField: '_id',
                    as: 'orderItems.product'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    orderNumber: { $first: '$orderNumber' },
                    user: { $first: '$user' },
                    address: { $first: '$address' },
                    orderItems: { $push: '$orderItems' },
                    status: { $first: '$status' },
                    createdAt: { $first: '$createdAt' },
                    deliveryInstruction: { $first: '$deliveryInstruction' },
                    total: { $first: '$total' },
                    subTotal: { $first: '$subTotal' },
                    tax: { $first: '$tax' },
                    orderDate: { $first: '$createdAt' },
                    discount: { $first: '$discount' }
                }
            },
            {
                $limit: 1
            }
        ])
            .exec();

        order = order[0];

        if (!order) {
            throw new HttpError('Order not found', 404);
        }

        return order;
    } catch (err) {
        // If the error is already an HttpError, throw it as-is
        if (err instanceof HttpError) {
            throw err;
        }
        // Otherwise, wrap it in a generic HttpError
        throw new HttpError(err.message, 500);
    }
};

/**
 * Updates a order with the given data.
 * @param {string} orderId - The ID of the order to update.
 * @param {object} data - The data to update the order with.
 * @param {string} data.code - The new code for the order.
 * @param {string} data.type - The new type for the order.
 * @param {number} data.discount - The new discount for the order.
 * @param {Date} data.fromDate - The new start date for the order.
 * @param {Date} data.toDate - The new end date for the order.
 * @param {string} data.status - The new status for the order.
 * @returns {Promise<object>} The updated order.
 */
const update = async (orderId, data) => {
    const { companyId, code, type, discount, discountType, fromDate, toDate, status } = data;

    // eslint-disable-next-line prefer-const
    let order = await find(orderId);
    order.code = code;
    order.type = type;
    order.discount = discount;
    order.fromDate = fromDate;
    order.toDate = toDate;
    order.status = status;
    order.discountType = discountType;
    order.companyId = companyId;
    order.updatedAt = Date.now();

    try {
        await order.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return order;
};

/**
 * Deletes a order by setting its deletedAt property to the current date and time.
 * @param {string} orderId - The ID of the order to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the order is successfully deleted.
 * @throws {HttpError} - If an error occurs while deleting the order.
 */
const destroy = async orderId => {
    orderId = new ObjectId(orderId);

    try {
        // Soft delete
        const order = await Order.findById(orderId);
        order.deletedAt = Date.now();
        await order.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of orders for a given company.
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} The number of orders.
 * @throws {HttpError} If an error occurs while counting the orders.
 */
const count = async (companyId) => {
    try {
        const order = await Order.countDocuments({ companyId });

        return order;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Performs bulk actions on orders.
 * @param {Object} data - The data containing the action and order IDs.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.orderIds - The IDs of the orders to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated order object(s).
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (data) => {
    const { action, orderIds } = data;
    try {
        let order;

        switch (action) {
        case 'delete':
            order = await Order.updateMany(
                { _id: { $in: orderIds } },
                { deletedAt: Date.now() }
            );
            break;
        case 'Ordered':
            order = await Order.updateMany(
                { _id: { $in: orderIds } },
                { status: 'ordered' }
            );
            break;
        case 'Cancelled':
            order = await Order.updateMany(
                { _id: { $in: orderIds } },
                { status: 'cancelled' }
            );
            break;
        case 'Delivered':
            order = await Order.updateMany(
                { _id: { $in: orderIds } },
                { status: 'delivered' }
            );
            break;
        case 'restore':
            order = await Order.updateMany(
                { _id: { $in: orderIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return order;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Generates a new order ID.
 * @returns {Promise<number>} The generated order ID.
 * @throws {HttpError} If there is an error while generating the order ID.
 */
const generateOrderId = async () => {
    try {
        const order = await Order.find().sort({ createdAt: -1 }).skip(1).limit(1);
        let orderId = 0;

        if (order.length > 0) {
            console.log('If');
            console.log(order[0]);
            console.log(order[0].orderNumber);
            orderId = parseInt(order[0].orderNumber) + 1;
        } else {
            console.log('Else');
            orderId = 1;
        }

        // Add leading zeros to the order IDs to make them 6 digits long. Make sure the order ID is unique and if orderId is 100 then it will be 00100
        return orderId.toString().padStart(6, '0');
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Place an order.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object containing the status, message, and order data.
 * @throws {HttpError} - If there is an error while saving the order.
 */
const store = async (req, res, next) => {
    const sessionId = req.params.sessionId;

    // find the cart and cart items by sessionId
    let cart;

    try {
        cart = await Cart.aggregate([
            {
                $match: { sessionId }
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
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    if (!cart) {
        return next(new HttpError('Cart not found', 404));
    }

    cart = cart[0];

    // Create order
    const orderData = {
        userId: cart.userId,
        shippingAddressId: cart.shippingAddressId,
        subTotal: cart.subTotal,
        discount: cart.discount,
        total: cart.total,
        tax: cart.tax,
        deliveryFee: cart.deliveryFee,
        deliveryInstruction: cart.deliveryInstruction,
        paymentMethod: cart.paymentMethod,
        status: 'Ordered',
        createdAt: Date.now()
    };

    let order = new Order(orderData);

    try {
        order = await order.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    // Generate order number and update orderData
    try {
        const orderId = await generateOrderId();

        await Order.updateOne(
            { _id: order._id },
            { $set: { orderNumber: orderId } }
        );
    } catch (error) {
        // Handle the error
        throw new HttpError('Error generating order number', 500);
    }

    // Insert orderId into cart
    await Cart.updateOne(
        { _id: cart._id },
        { $set: { orderId: order._id } }
    );

    // Create order items for all orders
    const orderItems = [];

    // Cory cart items to order items
    cart.cartItems.forEach(async item => {
        const orderItem = {
            orderId: order._id,
            productId: item.productId,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice
        };

        orderItems.push(orderItem);
    });

    try {
        await OrderItem.insertMany(orderItems);
    } catch (error) {
        // Handle the error
        throw new HttpError('Error inserting order items', 500);
    }

    // Send invoices to the user via email
    await email.sendInvoiceEmail(order._id);

    return {
        status: 'success',
        message: 'Order placed successfully',
        data: {
            order
        }
    };
};

const download = async (req, res, next) => {
    try {
        const orderInvoice = await email.sendInvoiceEmail(req.params.orderId, true);
        return {
            status: 'success',
            message: 'Order Invoice Downloaded successfully',
            data: {
                orderInvoice
            }
        };
    } catch (err) {
        const error = new HttpError(err, 500);
        return next(error);
    }
};

export default { get, find, update, destroy, bulkAction, count, store, download };
