import HttpError from '../../services/httpErrorService.js';
import Payment from '../../models/payment-model.js';
const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves payments with additional information.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the status, total count, and payments.
 * @throws {HttpError} - If an error occurs while retrieving the payments.
 */
const get = async (req) => {
    let payments;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const status = req.query.status || DEFAULTS.STATUS;
        const startDate = req.query.start || '';
        const endDate = req.query.end || '';
        const sort = req.query.sort === 'asc' ? 1 : -1;

        const filter = {
            $or: [
                { 'user.name': { $regex: searchText, $options: 'i' } },
                { status: { $regex: searchText, $options: 'i' } },
                { 'order.orderNumber': { $regex: searchText, $options: 'i' } }
            ]
        };

        if (status !== DEFAULTS.STATUS) {
            filter.status = status;
        }

        // apply filter for price field only if searchText string is a number
        const priceRegex = /^\d+$/;

        if (priceRegex.test(searchText)) {
            filter.$or.push({ amount: parseInt(searchText) }); // Changed $eq to $regex
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
                        from: 'orders',
                        localField: 'orderId',
                        foreignField: '_id',
                        as: 'order'
                    }
                },
                {
                    $unwind: '$order'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $match: filter
                }
            ];

            return Payment.aggregate(pipeline);
        };

        payments = await getBaseAggregation()
            .sort({ _id: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        // Get total count of payments
        const total = await Payment.countDocuments(filter);

        // Now, use the total count as needed.

        return {
            status: 'success',
            total,
            page,
            limit,
            payments
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Generates a unique payment ID.
 * @returns {Promise<number>} The generated payment ID.
 * @throws {HttpError} If an error occurs while generating the payment ID.
 */
const generatePaymentId = async () => {
    try {
        const payment = await Payment.find().sort({ createdAt: -1 }).limit(1);
        let paymentId = 1;
        if (payment.length > 0) {
            paymentId = payment[0].paymentId + 1;
        }
        return paymentId;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

// Store payment
const store = async (req) => {
    const { orderId, amount, status, paymentId, paymentMethod } = req.body;

    try {
        const payment = new Payment({
            orderId,
            amount,
            status,
            paymentId,
            paymentMethod
        });
        await payment.save();

        return {
            status: 'success',
            message: 'Payment created successfully',
            payment
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, generatePaymentId, store };
