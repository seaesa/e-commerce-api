import orderService from './../services/dbServices/orderService.js';
import fs from 'fs';
import sendMail from './../services/mailerService.js';
import path from 'path';
import { format } from 'date-fns';

/**
 * Sends an invoice email for the given order ID.
 *
 * @param {string} orderId - The ID of the order.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */
const sendInvoiceEmail = async (orderId, downloadOrderInvoice) => {
    let order;
    let orderItems = '';
    let orderPlacedEmailContent = '';

    try {
        order = await orderService.find(orderId);
    } catch (error) {
        console.error('Error finding order:', error);
    }

    if (!downloadOrderInvoice) {
        let emailPath = new URL(
            '../../src/email-templates/order-placed.html',
            import.meta.url
        );
        emailPath = path.resolve(emailPath.pathname);

        orderPlacedEmailContent = fs.readFileSync(emailPath, 'utf-8');
        orderPlacedEmailContent = orderPlacedEmailContent.replace(
            '{{orderId}}',
            order._id
        );
    }

    order.orderItems.forEach(item => {
        orderItems += `<tr>
        <td>${item.product[0]._id}</td>
        <td>${item.product[0].name}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>${item.quantity * item.price}</td>
    </tr>`;
    });

    let invoicePath = new URL(
        '../../src/email-templates/invoice.html',
        import.meta.url
    );
    invoicePath = path.resolve(invoicePath.pathname);
    let invoiceEmailContent = fs.readFileSync(invoicePath, 'utf-8');
    const date = new Date(order.createdAt);
    const orderDate = format(date, 'eee MMM dd yyyy', { timeZone: 'UTC' });

    invoiceEmailContent = invoiceEmailContent
        .replace('{{orderId}}', `#ORD${order.orderNumber}`)
        .replace('{{orderDate}}', orderDate)
        .replace('{{customerName}}', order.user.name)
        .replace(
            '{{deliveryAddress}}',
            `${order.address.houseNumber} ${order.address.landmark} ${order.address.address} ${order.address.city} ${order.address.state} ${order.address.country} ${order.address.zip}`
        )
        .replace('{{deliveryContact}}', order.address.phone)
        .replace('{{orderItems}}', orderItems)
        .replace('{{orderSubTotal}}', order.subTotal)
        .replace('{{orderTax}}', order.tax)
        .replace('{{orderTotal}}', order.total);

    if (!downloadOrderInvoice) {
        // Send email to the admin
        const mailOptions = {
            from: 'career@example.com',
            to: [order.user.email],
            subject: 'Order placed successfully',
            message: orderPlacedEmailContent,
            attachments: [
                { filename: 'invoice.pdf', html: invoiceEmailContent }
            ]
        };

        try {
            await sendMail(mailOptions);
        } catch (error) {
            console.log('Error sending email:', error);
        }
    } else {
        return invoiceEmailContent;
    }
};

/**
 * Sends a test email to the specified email address.
 *
 * @param {string} ToEmailId - The email address to send the test email to.
 * @returns {Promise} A promise that resolves with the response from sending the email.
 */
const sendTestEmail = async ToEmailId => {
    // Send email to the admin
    const mailOptions = {
        from: 'career@example.com',
        to: [ToEmailId],
        subject: 'Test Email',
        message: 'This is a test email'
    };

    try {
        const response = await sendMail(mailOptions);
        return response;
    } catch (error) {
        console.log('Error sending email:', error);
    }
};

export default {
    sendInvoiceEmail,
    sendTestEmail
};
