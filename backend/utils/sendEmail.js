import nodemailer from 'nodemailer';

// Create transporter with explicit configuration
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '9022b0df3e43f9',
    pass: 'd45fe2e6fb49a6'
  },
  debug: true, // Enable debug output
  logger: true // Log information about the transport
});

const sendEmail = async (options) => {
  try {
    console.log('Attempting to send email with options:', {
      to: options.email,
      subject: options.subject
    });

    const mailOptions = {
      from: 'CAMSHOP <noreply@camshop.com>',
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Log more details about the error
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw error;
  }
};

const sendOrderConfirmationEmail = async (order) => {
  try {
    if (!order.user || !order.user.email) {
      console.error('Order user or email missing:', order);
      return false;
    }

    console.log('Preparing order confirmation email for:', order.user.email);

    // Calculate order total
    const orderTotal = order.orderItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );

    // Create HTML content for the email
    const emailContent = `
      <h2>Order Confirmation - CAMSHOP</h2>
      <p>Thank you for your order!</p>
      
      <h3>Order Details:</h3>
      <p>Order ID: ${order._id}</p>
      <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
      
      <h3>Items Ordered:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #dee2e6;">Product</th>
            <th style="padding: 10px; border: 1px solid #dee2e6;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #dee2e6;">Price</th>
            <th style="padding: 10px; border: 1px solid #dee2e6;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.orderItems
            .map(
              (item) => `
            <tr>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">${item.qty}</td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">$${item.price.toFixed(2)}</td>
              <td style="padding: 10px; border: 1px solid #dee2e6;">$${(item.price * item.qty).toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      
      <h3>Order Summary:</h3>
      <p>Subtotal: $${orderTotal.toFixed(2)}</p>
      <p>Shipping: $${order.shippingPrice.toFixed(2)}</p>
      <p>Tax: $${order.taxPrice.toFixed(2)}</p>
      <p><strong>Total: $${order.totalPrice.toFixed(2)}</strong></p>
      
      <h3>Shipping Address:</h3>
      <p>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>
      
      <p>Thank you for shopping with CAMSHOP!</p>
    `;

    return await sendEmail({
      email: order.user.email,
      subject: `Order Confirmation - CAMSHOP #${order._id}`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

const sendOrderCancellationEmail = async (order) => {
  try {
    if (!order.user || !order.user.email) {
      console.error('Order user or email missing:', order);
      return false;
    }

    console.log('Preparing order cancellation email for:', order.user.email);

    const emailContent = `
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: #40513B;">Order Cancellation Confirmation</h2>
        <p>Your order has been cancelled as requested. Here are the details of the cancelled order:</p>
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Quantity</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) => `
              <tr>
                <td style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${
                  item.name
                }</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${
                  item.qty
                }</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">$${
                  item.price
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total:</strong></td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;"><strong>$${
                order.totalPrice
              }</strong></td>
            </tr>
          </tfoot>
        </table>
        ${
          order.isPaid
            ? `<div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                <h3 style="margin-top: 0;">Refund Information:</h3>
                <p>Since your order was already paid, a refund will be processed according to our refund policy. 
                The refund should be reflected in your account within 5-10 business days.</p>
              </div>`
            : ""
        }
        <hr style="border: none; border-bottom: 1px solid #ddd;">
        <p>If you have any questions about your cancellation or refund, please don't hesitate to contact our customer service.</p>
      </div>
    `;

    return await sendEmail({
      email: order.user.email,
      subject: `Order Cancelled - CAMSHOP #${order._id}`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Error sending order cancellation email:', error);
    return false;
  }
};

export { sendEmail, sendOrderConfirmationEmail, sendOrderCancellationEmail };
