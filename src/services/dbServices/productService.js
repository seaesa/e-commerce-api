import HttpError from '../../services/httpErrorService.js';
import mongoose from 'mongoose';
import Product from '../../models/product-model.js';
import { ObjectId } from 'mongodb';

const DEFAULTS = {
    LIMIT: 10,
    STATUS: 'all',
    NAME: 'All'
};

/**
 * Retrieves a list of products based on the provided request parameters.
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the retrieved products.
 * @throws {HttpError} - If an error occurs while retrieving the products.
 */
const get = async req => {
    let products;

    try {
        const page = parseInt(req.query.currentPage, 10) || 1;
        const limit = parseInt(req.query.itemPerPage, 10) || DEFAULTS.LIMIT;
        const searchText = req.query.search || '';
        const status = req.query.status || DEFAULTS.STATUS;
        const startDate = req.query.start || '';
        const endDate = req.query.end || '';
        const sort = req.query.sort === 'asc' ? 1 : -1;
        const regex = /\b[dD](e(l(et?)?)?|l(et?)?|l)\b/i;

        // Define the filter object
        const filter = {
            $or: [
                { name: { $regex: searchText, $options: 'i' } },
                { 'category.name': { $regex: searchText, $options: 'i' } },
                { 'subCategory.name': { $regex: searchText, $options: 'i' } },
                { 'brand.name': { $regex: searchText, $options: 'i' } },
                {
                    $and: [
                        { status: { $regex: searchText, $options: 'i' } },
                        { deletedAt: { $eq: null } }
                    ]
                }
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
            filter.$or.push({ price: { $eq: parseInt(searchText) } });
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
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category' // Unwind the 'category' array
                },
                {
                    $lookup: {
                        from: 'subCategories',
                        localField: 'subCategoryId',
                        foreignField: '_id',
                        as: 'subCategory'
                    }
                },
                {
                    $unwind: {
                        path: '$subCategory',
                        preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brandId',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                {
                    $unwind: {
                        path: '$brand',
                        preserveNullAndEmptyArrays: true // Include documents without matching brand
                    }
                },
                {
                    $match: filter
                }
            ];

            return Product.aggregate(pipeline);
        };

        products = await getBaseAggregation()
            .sort({ name: sort })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await Product.countDocuments(filter);

        return {
            status: 'success',
            total,
            page,
            limit,
            products
        };
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Stores a product in the database.
 *
 * @param {Object} data - The data of the product to be stored.
 * @param {string} data.companyId - The ID of the company.
 * @param {string} data.categoryId - The ID of the category.
 * @param {string} data.subCategoryId - The ID of the sub-category.
 * @param {string} data.brandId - The ID of the brand.
 * @param {string} data.name - The name of the product.
 * @param {string} data.slug - The slug of the product.
 * @param {string} data.shortDescription - The short description of the product.
 * @param {string} data.longDescription - The long description of the product.
 * @param {string} data.featureImage - The URL of the feature image of the product.
 * @param {Array<string>} data.images - The URLs of the images of the product.
 * @param {number} data.price - The price of the product.
 * @param {number} data.discount - The discount amount of the product.
 * @param {string} data.discountType - The type of discount (e.g. 'percentage', 'amount').
 * @param {number} data.totalQuantity - The total quantity of the product.
 * @param {number} data.quantityInStock - The quantity of the product in stock.
 * @param {number} data.displayOrder - The display order of the product.
 * @param {string} data.status - The status of the product.
 * @returns {Promise<Object>} - A promise that resolves to the stored product.
 * @throws {HttpError} - If there is an error while saving the product.
 */
const store = async data => {
    const { companyId, categoryId, subCategoryId, brandId, name, slug, shortDescription, longDescription, featureImage, images, price, discount, discountType, totalQuantity, quantityInStock, displayOrder, status, sku, tags } = data;

    const product = new Product({ companyId, categoryId, subCategoryId, brandId, name, slug, shortDescription, longDescription, featureImage, images, price, discount, discountType, totalQuantity, quantityInStock, displayOrder, status, sku, tags, createdAt: Date.now() });

    try {
        await product.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return product;
};

/**
 * Finds a product by its ID.
 * @param {string} productId - The ID of the product.
 * @returns {Promise<Object>} - The found product.
 * @throws {HttpError} - If the product ID is invalid or the product is not found.
 */
const find = async productId => {
    try {
        productId = mongoose.Types.ObjectId(productId);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new HttpError('Invalid Product ID format', 400);
        }

        const product = await Product.findById(productId);

        if (!product) {
            throw new HttpError('Product not found', 404);
        }

        return product;
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
 * Updates a product in the database.
 *
 * @param {string} productId - The ID of the product to update.
 * @param {object} data - The updated data for the product.
 * @returns {Promise<object>} - The updated product object.
 * @throws {HttpError} - If there is an error while updating the product.
 */
const update = async (productId, data) => {
    const { categoryId, subCategoryId, brandId, name, slug, shortDescription, longDescription, featureImage, images, price, discount, discountType, totalQuantity, quantityInStock, displayOrder, status, sku, tags } = data;

    // eslint-disable-next-line prefer-const
    let product = await find(productId);
    product.categoryId = categoryId || product.categoryId;
    product.subCategoryId = subCategoryId || product.subCategoryId;
    product.brandId = brandId || product.brandId;
    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.shortDescription = shortDescription || product.shortDescription;
    product.longDescription = longDescription || product.longDescription;
    product.featureImage = featureImage || product.featureImage;
    product.images = images || product.images;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.discountType = discountType || product.discountType;
    product.totalQuantity = totalQuantity || product.totalQuantity;
    product.quantityInStock = quantityInStock || product.quantityInStock;
    product.displayOrder = displayOrder || product.displayOrder;
    product.status = status || product.status;
    product.sku = sku || product.sku;
    product.tags = tags || product.tags;
    product.updatedAt = Date.now();

    try {
        await product.save();
    } catch (err) {
        throw new HttpError(err.message, 500);
    }

    return product;
};

/**
 * Soft deletes a product by setting the deletedAt property to the current date and time.
 * @param {string} productId - The ID of the product to be deleted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the product is successfully deleted.
 * @throws {HttpError} - If an error occurs during the deletion process.
 */
const destroy = async (productId) => {
    productId = new ObjectId(productId);

    // Soft delete
    try {
        const product = await Product.findOne({ _id: productId });

        product.deletedAt = Date.now();
        await product.save();
        console.log(productId);

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Counts the number of products for a given company.
 *
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<number>} - The number of products.
 * @throws {HttpError} - If an error occurs while counting the products.
 */
const count = async (companyId) => {
    try {
        const product = await Product.countDocuments({ companyId });

        return product;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Performs bulk actions on products.
 * @param {Object} data - The data containing the action and product IDs.
 * @param {string} data.action - The action to perform (delete, active, inactive, restore).
 * @param {Array<string>} data.productIds - The IDs of the products to perform the action on.
 * @returns {Promise<Object>} - A promise that resolves to the updated product(s).
 * @throws {HttpError} - If an error occurs during the bulk action.
 */
const bulkAction = async (data) => {
    const { action, productIds } = data;

    try {
        let product;

        switch (action) {
        case 'delete':
            product = await Product.updateMany(
                { _id: { $in: productIds } },
                { deletedAt: Date.now() }
            );
            break;
        case 'active':
            product = await Product.updateMany(
                { _id: { $in: productIds } },
                { status: 'active' }
            );
            break;
        case 'inactive':
            product = await Product.updateMany(
                { _id: { $in: productIds } },
                { status: 'inactive' }
            );
            break;
        case 'restore':
            product = await Product.updateMany(
                { _id: { $in: productIds } },
                { deletedAt: null }
            );
            break;
        default:
            throw new HttpError('Invalid action', 400);
        }

        return product;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

// Get products by category slug
const getByProductSlug = async (slug) => {
    // Find a product by its category slug
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category' // Unwind the 'category' array
            },
            {
                $lookup: {
                    from: 'subCategories',
                    localField: 'subCategoryId',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $unwind: {
                    path: '$subCategory',
                    preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandId',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                }
            },
            {
                $match: {
                    slug
                }
            }
        ]);

        return products[0];
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

// Get random 10 products
const getFeaturedProducts = async () => {
    try {
        const products = await Product.find({}).limit(10).exec();
        return products;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Retrieves products by category slug.
 *
 * @param {string} slug - The category slug.
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 * @throws {HttpError} - If there is an error while retrieving the products.
 */
const getProductsByCategorySlug = async (slug) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category' // Unwind the 'category' array
            },
            {
                $lookup: {
                    from: 'subCategories',
                    localField: 'subCategoryId',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $unwind: {
                    path: '$subCategory',
                    preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandId',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                }
            },
            {
                $match: {
                    'category.slug': slug
                }
            }
        ]);

        return products;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

/**
 * Retrieves products along with their category, subcategory, and brand information.
 * @returns {Promise<Array>} An array of products with their associated category, subcategory, and brand information.
 * @throws {HttpError} If there is an error while retrieving the products.
 */
const getProductsAndItsCategory = async () => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category' // Unwind the 'category' array
            },
            {
                $lookup: {
                    from: 'subCategories',
                    localField: 'subCategoryId',
                    foreignField: '_id',
                    as: 'subCategory'
                }
            },
            {
                $unwind: {
                    path: '$subCategory',
                    preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandId',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $unwind: {
                    path: '$brand',
                    preserveNullAndEmptyArrays: true // Include documents without matching subCategory
                }
            }
        ]);

        return products;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { get, store, find, update, destroy, bulkAction, count, getByProductSlug, getFeaturedProducts, getProductsByCategorySlug, getProductsAndItsCategory };
