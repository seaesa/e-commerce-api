import HttpError from '../../services/httpErrorService.js';
import ShippingAddress from '../../models/shipping-address-model.js';
import { ObjectId } from 'mongodb';

/**
 * Finds shipping addresses by user ID.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of shipping addresses.
 * @throws {HttpError} - If there is an error while finding the shipping addresses.
 */
const findByUserId = async (userId) => {
    try {
        const shippingAddresses = await ShippingAddress.find({
            userId: new ObjectId(userId),
            $or: [
                { deletedAt: null }, // Check if deletedAt is null
                { deletedAt: { $exists: false } } // Check if deletedAt field doesn't exist
            ]
        }).exec();

        return shippingAddresses;
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Stores a new shipping address in the database.
 *
 * @param {Object} data - The data for the new shipping address.
 * @param {string} data.userId - The ID of the user associated with the shipping address.
 * @param {string} data.name - The name associated with the shipping address.
 * @param {string} data.email - The email associated with the shipping address.
 * @param {string} data.phone - The phone number associated with the shipping address.
 * @param {string} data.address - The address associated with the shipping address.
 * @param {string} data.landmark - The landmark associated with the shipping address.
 * @param {string} data.houseNumber - The house number associated with the shipping address.
 * @param {string} data.city - The city associated with the shipping address.
 * @param {string} data.state - The state associated with the shipping address.
 * @param {string} data.zip - The ZIP code associated with the shipping address.
 * @param {number|string} data.isDefaultAddress - The flag indicating whether the shipping address is the default address (1 for true, 0 for false).
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the newly created shipping address.
 * @throws {HttpError} If there is an error while storing the shipping address.
 */
const store = async (data) => {
    const { userId, name, email, phone, address, landmark, houseNumber, city, state, zip, isDefaultAddress } = data;
    const newUserId = new ObjectId(userId);

    if (isDefaultAddress === 1 || isDefaultAddress === '1') {
        try {
            await ShippingAddress.updateMany({
                userId: newUserId
            }, {
                isDefaultAddress: 0
            });
        } catch (err) {
            throw new HttpError(err, 500);
        }
    }

    const newShippingAddress = new ShippingAddress({ userId: newUserId, name, email, phone, address, landmark, houseNumber, city, state, zip, isDefaultAddress, country: 'india', createdAt: Date.now() });

    try {
        await newShippingAddress.save();
        return { subCategory: newShippingAddress };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Finds a shipping address by its ID.
 *
 * @param {string} id - The ID of the shipping address to find.
 * @returns {Promise<{ shippingAddress: Object }>} - A promise that resolves to an object containing the found shipping address.
 * @throws {HttpError} - If an error occurs while finding the shipping address.
 */
const findById = async (id) => {
    try {
        const shippingAddress = await ShippingAddress.findById(id);
        return { shippingAddress };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Updates a shipping address in the database.
 * @param {string} shippingAddressId - The ID of the shipping address to update.
 * @param {object} data - The updated data for the shipping address.
 * @param {string} data.userId - The ID of the user associated with the shipping address.
 * @param {string} data.name - The name associated with the shipping address.
 * @param {string} data.email - The email associated with the shipping address.
 * @param {string} data.phone - The phone number associated with the shipping address.
 * @param {string} data.address - The address associated with the shipping address.
 * @param {string} data.landmark - The landmark associated with the shipping address.
 * @param {string} data.houseNumber - The house number associated with the shipping address.
 * @param {string} data.city - The city associated with the shipping address.
 * @param {string} data.state - The state associated with the shipping address.
 * @param {string} data.zip - The ZIP code associated with the shipping address.
 * @param {number|string} data.isDefaultAddress - The flag indicating whether the shipping address is the default address (1 for true, 0 for false).
 * @returns {Promise<object>} A promise that resolves to an object containing the updated shipping address.
 * @throws {HttpError} If there is an error while updating the shipping address.
 */
const update = async (shippingAddressId, data) => {
    const { userId, name, email, phone, address, landmark, houseNumber, city, state, zip, isDefaultAddress } = data;
    const newUserId = new ObjectId(userId);

    let shippingAddress;

    try {
        shippingAddress = await ShippingAddress.findById(shippingAddressId);
    } catch (err) {
        throw new HttpError(err, 500);
    }

    if (isDefaultAddress === 1 || isDefaultAddress === '1') {
        try {
            await ShippingAddress.updateMany({
                userId: newUserId
            }, {
                isDefaultAddress: 0
            });
        } catch (err) {
            throw new HttpError(err, 500);
        }
    }

    shippingAddress.userId = newUserId;
    shippingAddress.name = name;
    shippingAddress.email = email;
    shippingAddress.phone = phone;
    shippingAddress.address = address;
    shippingAddress.landmark = landmark;
    shippingAddress.houseNumber = houseNumber;
    shippingAddress.city = city;
    shippingAddress.state = state;
    shippingAddress.zip = zip;
    shippingAddress.isDefaultAddress = isDefaultAddress;
    shippingAddress.updatedAt = Date.now();

    try {
        await shippingAddress.save();
        return { shippingAddress };
    } catch (err) {
        throw new HttpError(err, 500);
    }
};

/**
 * Deletes a shipping address by setting the `deletedAt` property to the current date and time.
 * @param {string} shippingAddressId - The ID of the shipping address to be deleted.
 * @returns {boolean} - Returns `true` if the shipping address is successfully deleted.
 * @throws {HttpError} - Throws an error if there is an issue with deleting the shipping address.
 */
const destroy = async (shippingAddressId) => {
    shippingAddressId = new ObjectId(shippingAddressId);

    // Soft delete
    try {
        const data = await ShippingAddress.findById(shippingAddressId);
        data.deletedAt = Date.now();
        await data.save();

        return true;
    } catch (err) {
        throw new HttpError(err.message, 500);
    }
};

export default { store, findById, findByUserId, update, destroy };
