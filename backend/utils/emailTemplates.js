export const generateOrderDeliveredEmail = (order) => {
  const itemsList = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Order Delivered Successfully!</h2>
      <p>Dear ${order.user.name},</p>
      <p>Your order has been delivered successfully. Here are the details of your purchase:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
            <td style="padding: 10px;">$${order.itemsPrice}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
            <td style="padding: 10px;">$${order.shippingPrice}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
            <td style="padding: 10px;">$${order.taxPrice}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 10px;"><strong>$${order.totalPrice}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div style="margin-top: 20px;">
        <h3>Shipping Address:</h3>
        <p>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}
        </p>
      </div>

      <p style="margin-top: 20px;">Thank you for shopping with us!</p>
      
      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
        <p>This is an automated email, please do not reply.</p>
      </div>
    </div>
  `;
};
