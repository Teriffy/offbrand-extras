import { Resend } from "resend";
import { Order, OrderItem } from "@/types/order";

let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface OrderConfirmationData {
  order: Order;
  items: OrderItem[];
}

export async function sendOrderConfirmation(
  data: OrderConfirmationData
) {
  const { order, items } = data;

  if (!order.guest_email) {
    console.warn(`No email for order ${order.id}, skipping confirmation email`);
    return;
  }

  const total = (order.total_cents / 100).toFixed(2);
  const itemsHtml = items
    .map(
      (item) =>
        `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        ${item.product_name}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        €${(item.product_price_cents / 100).toFixed(2)}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        €${(item.subtotal_cents / 100).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f3f4f6; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
    .header h1 { margin: 0 0 10px 0; color: #1f2937; }
    .header p { margin: 0; color: #6b7280; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; }
    .total-row { background: #f3f4f6; font-weight: bold; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Thank you for your order, ${order.guest_name}!</p>
    </div>

    <p>We've received your payment. Here's a summary of your order:</p>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr class="total-row">
          <td colspan="3" style="padding: 12px;">Total</td>
          <td style="padding: 12px; text-align: right;">€${total}</td>
        </tr>
      </tbody>
    </table>

    <p><strong>Reservation Code:</strong> ${order.reservation_code}</p>

    <div class="footer">
      <p>Prague For You<br>
      Prague, Czech Republic<br>
      <a href="mailto:info@pragueforyou.cz">info@pragueforyou.cz</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const client = getResendClient();
    const result = await client.emails.send({
      from: "noreply@pragueforyou.cz",
      to: order.guest_email,
      subject: `Order Confirmation - Reservation ${order.reservation_code}`,
      html,
    });

    console.log(`Order confirmation email sent`);
    return result;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // Don't throw - this should not fail the webhook
    return null;
  }
}
