/**
 * Netlify Function: submission-created
 * Triggered automatically when a Netlify Form is submitted.
 */

const axios = require('axios'); // We can use axios if we add it, or use fetch

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const { payload } = body;

    // Only process the 'orders' form
    if (payload.form_name !== 'orders') {
        return { statusCode: 200 };
    }

    const { name, email, whatsapp, fulfillment, payment, address, 'cart-contents': cartContents, 'total-amount': totalAmount } = payload.data;

    // RESEND_API_KEY should be set in Netlify Environment Variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return { statusCode: 500, body: 'Missing API Key' };
    }

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
            .header { background-color: #006644; color: #ffffff; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; }
            .header p { margin: 10px 0 0; color: #FFD700; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; font-size: 12px; }
            .content { padding: 30px; }
            .order-summary { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .row:last-child { border-bottom: none; }
            .total-row { display: flex; justify-content: space-between; margin-top: 15px; font-weight: bold; color: #006644; font-size: 18px; }
            .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #777; }
            .button { display: inline-block; padding: 12px 24px; background-color: #006644; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Charming Choices</h1>
                <p>Order Receipt</p>
            </div>
            <div class="content">
                <h2>Hi ${name},</h2>
                <p>Thank you for your order! We've received your request and are currently processing it. Here is a summary of what you've ordered:</p>
                
                <div class="order-summary">
                    <div class="row"><strong>Items:</strong> <span>${cartContents}</span></div>
                    <div class="row"><strong>Fulfillment:</strong> <span>${fulfillment}</span></div>
                    <div class="row"><strong>Payment Choice:</strong> <span>${payment}</span></div>
                    ${address ? `<div class="row"><strong>Address:</strong> <span>${address}</span></div>` : ''}
                    <div class="total-row"><strong>Total Amount:</strong> <span>$${totalAmount}</span></div>
                </div>

                <h3>What happens next?</h3>
                <p>We will contact you shortly on WhatsApp (<strong>${whatsapp}</strong>) to confirm your order and coordinate the delivery/pickup.</p>
                
                ${payment === 'Bank Transfer' ? `
                <div style="background: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px;"><strong>Bank Transfer Note:</strong> Please use your name as the reference and send the screenshot of your receipt to us on WhatsApp once payment is made.</p>
                </div>
                ` : ''}

                <a href="https://charmingchoices.netlify.app" class="button">Visit Our Store</a>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Charming Choices | Chaguanas, Trinidad</p>
                <p>Contact: caribbeancodestudios@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Charming Choices <onboarding@resend.dev>', // You can customize this if you have a custom domain
                to: [email || 'caribbeancodestudios@gmail.com'], // Fallback if no email provided
                subject: `Order Confirmation - ${name}`,
                html: emailHtml
            })
        });

        const data = await response.json();
        console.log('Email sent successfully:', data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully', data })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email' })
        };
    }
};
