// Common styles that match MUI dark theme
const styles = {
  container: `
    background-color: #0E0E0E;
    color: #ffffff;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    padding: 90px 16px;
    max-width: 1200px;
    margin: 0 auto;
  `,
  card: `
    background-color: #1A1A1A;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
  `,
  heading: `
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #ffffff;
  `,
  subHeading: `
    font-size: 20px;
    margin-bottom: 8px;
    color: #ffffff;
  `,
  text: `
    color: #ffffff;
    margin-bottom: 8px;
  `,
  highlight: `
    color: #EC407A;
    font-weight: 500;
  `,
  button: `
    background-color: #EC407A;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
    margin-top: 16px;
    font-weight: 500;
  `,
  table: `
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  `,
  th: `
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #333;
    color: #ffffff;
  `,
  td: `
    padding: 12px;
    border-bottom: 1px solid #333;
    color: #ffffff;
  `,
  message: {
    success: `
      background-color: rgba(46, 125, 50, 0.1);
      color: #66bb6a;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    `,
    error: `
      background-color: rgba(211, 47, 47, 0.1);
      color: #f44336;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    `,
  },
};

export const generateOrderConfirmationEmail = (order) => {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <h2 style="${styles.heading}">Order Confirmation</h2>
        <p style="${styles.text}">Thank you for your order! We're happy to let you know that we've received your order.</p>
        
        <h3 style="${styles.subHeading}">Order Details</h3>
        <table style="${styles.table}">
          <thead>
            <tr>
              <th style="${styles.th}">Product</th>
              <th style="${styles.th}">Quantity</th>
              <th style="${styles.th}">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) => `
              <tr>
                <td style="${styles.td}">
                  <div style="display: flex; align-items: center;">
                    <img src="${item.image}" alt="${
                  item.name
                }" style="width: 64px; height: 64px; object-fit: cover; margin-right: 16px;">
                    <span>${item.name}</span>
                  </div>
                </td>
                <td style="${styles.td}">${item.qty}</td>
                <td style="${styles.td}">$${item.price.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Items Price:</strong></td>
              <td style="${styles.td}">$${order.itemsPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Shipping:</strong></td>
              <td style="${styles.td}">$${order.shippingPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Tax:</strong></td>
              <td style="${styles.td}">$${order.taxPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Total:</strong></td>
              <td style="${styles.td}"><strong>$${order.totalPrice}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="${styles.card}">
          <h3 style="${styles.subHeading}">Shipping Address</h3>
          <p style="${styles.text}">
            <strong style="${styles.highlight}">Address:</strong> ${
    order.shippingAddress.address
  }<br>
            <strong style="${styles.highlight}">City:</strong> ${
    order.shippingAddress.city
  }<br>
            <strong style="${styles.highlight}">Postal Code:</strong> ${
    order.shippingAddress.postalCode
  }<br>
            <strong style="${styles.highlight}">Country:</strong> ${
    order.shippingAddress.country
  }
          </p>
        </div>

        <div style="${styles.message.success}">
          We'll send you another email when your order ships.
        </div>
      </div>
    </div>
  `;
};

export const generateOrderCancellationEmail = (order) => {
  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <h2 style="${styles.heading}">Order Cancellation Confirmation</h2>
        <p style="${styles.text}">Your order has been cancelled as requested. Here are the details of the cancelled order:</p>
        
        <h3 style="${styles.subHeading}">Order Details</h3>
        <table style="${styles.table}">
          <thead>
            <tr>
              <th style="${styles.th}">Product</th>
              <th style="${styles.th}">Quantity</th>
              <th style="${styles.th}">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) => `
              <tr>
                <td style="${styles.td}">
                  <div style="display: flex; align-items: center;">
                    <img src="${item.image}" alt="${
                  item.name
                }" style="width: 64px; height: 64px; object-fit: cover; margin-right: 16px;">
                    <span>${item.name}</span>
                  </div>
                </td>
                <td style="${styles.td}">${item.qty}</td>
                <td style="${styles.td}">$${item.price.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Items Price:</strong></td>
              <td style="${styles.td}">$${order.itemsPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Shipping:</strong></td>
              <td style="${styles.td}">$${order.shippingPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Tax:</strong></td>
              <td style="${styles.td}">$${order.taxPrice}</td>
            </tr>
            <tr>
              <td colspan="2" style="${styles.td}"><strong>Total:</strong></td>
              <td style="${styles.td}"><strong>$${order.totalPrice}</strong></td>
            </tr>
          </tfoot>
        </table>

        ${
          order.isPaid
            ? `
          <div style="${styles.card}">
            <h3 style="${styles.subHeading}">Refund Information</h3>
            <p style="${styles.text}">
              Since your order was already paid, a refund will be processed according to our refund policy.
              The refund should be reflected in your account within 5-10 business days.
            </p>
          </div>
        `
            : ""
        }

        <div style="${styles.message.error}">
          Order Status: Cancelled
        </div>

        <p style="${styles.text}">
          If you have any questions about your cancellation or refund, please don't hesitate to contact our customer service.
        </p>
      </div>
    </div>
  `;
};

export const generateOrderDeliveredEmail = (order) => {
  const itemsList = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="${styles.td}">${item.name}</td>
        <td style="${styles.td}">$${item.price}</td>
        <td style="${styles.td}">${item.qty}</td>
        <td style="${styles.td}">$${(item.price * item.qty).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="${styles.container}">
      <div style="${styles.card}">
        <h2 style="${styles.heading}">Order Delivered Successfully!</h2>
        <p style="${styles.text}">Dear ${order.user.name},</p>
        <p style="${styles.text}">Your order has been delivered successfully. Here are the details of your purchase:</p>
        
        <table style="${styles.table}">
          <thead>
            <tr>
              <th style="${styles.th}">Product</th>
              <th style="${styles.th}">Price</th>
              <th style="${styles.th}">Quantity</th>
              <th style="${styles.th}">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="${styles.td}"><strong>Subtotal:</strong></td>
              <td style="${styles.td}">$${order.itemsPrice}</td>
            </tr>
            <tr>
              <td colspan="3" style="${styles.td}"><strong>Shipping:</strong></td>
              <td style="${styles.td}">$${order.shippingPrice}</td>
            </tr>
            <tr>
              <td colspan="3" style="${styles.td}"><strong>Tax:</strong></td>
              <td style="${styles.td}">$${order.taxPrice}</td>
            </tr>
            <tr>
              <td colspan="3" style="${styles.td}"><strong>Total:</strong></td>
              <td style="${styles.td}"><strong>$${order.totalPrice}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div style="${styles.card}">
          <h3 style="${styles.subHeading}">Shipping Address</h3>
          <p style="${styles.text}">
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <p style="${styles.text}">
          Thank you for shopping with us!
        </p>
        
        <div style="${styles.message.success}">
          This is an automated email, please do not reply.
        </div>
      </div>
    </div>
  `;
};
