import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, company, phone, subject, message, smtpConfig } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400).json({ 
        success: false, 
        message: 'Required fields missing: name, email, subject, and message are required' 
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
      return;
    }

    // Validate SMTP configuration
    if (!smtpConfig || !smtpConfig.host || !smtpConfig.auth) {
      res.status(500).json({ 
        success: false, 
        message: 'SMTP configuration is incomplete' 
      });
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure, // true for 465, false for other ports
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
      // Additional options for better compatibility
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });

    // Verify connection configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      res.status(500).json({ 
        success: false, 
        message: 'SMTP configuration verification failed. Please check your email settings.' 
      });
      return;
    }

    // Generate email content
    const emailHTML = generateEmailHTML({ name, email, company, phone, subject, message });
    const emailText = generateEmailText({ name, email, company, phone, subject, message });

    // Email options
    const mailOptions = {
      from: `"${smtpConfig.from.name}" <${smtpConfig.from.email}>`,
      to: smtpConfig.to.email,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: emailText,
      html: emailHTML,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message. We will contact you within 24 hours!',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Unable to send message at this time. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your email credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Unable to connect to email server. Please check your SMTP settings.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Email server connection timed out. Please try again.';
    }

    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Generate HTML email content
function generateEmailHTML(data) {
  const { name, email, company, phone, subject, message } = data;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #f97316, #ea580c); 
          color: white; 
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
          font-weight: 600; 
        }
        .header p { 
          margin: 10px 0 0 0; 
          opacity: 0.9; 
        }
        .content { 
          padding: 30px; 
        }
        .info-section { 
          background: #f8fafc; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          border-left: 4px solid #f97316; 
        }
        .info-row { 
          margin: 10px 0; 
          display: flex;
          align-items: center;
        }
        .label { 
          font-weight: 600; 
          color: #374151; 
          min-width: 100px; 
          margin-right: 10px;
        }
        .value { 
          color: #6b7280; 
          flex: 1;
        }
        .message-section { 
          background: #ffffff; 
          padding: 20px; 
          border: 1px solid #e5e7eb; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .message-content { 
          white-space: pre-wrap; 
          line-height: 1.6; 
          color: #374151; 
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #f97316;
        }
        .footer { 
          background: #f3f4f6; 
          padding: 20px; 
          text-align: center; 
          font-size: 14px;
          color: #6b7280;
        }
        .priority-notice { 
          background: #fef3c7; 
          border: 1px solid #f59e0b; 
          color: #92400e; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .priority-notice strong { 
          color: #78350f; 
        }
        a {
          color: #f97316;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>ABA IP Law Firm - Client Inquiry</p>
        </div>
        
        <div class="content">
          <div class="info-section">
            <h3 style="margin-top: 0; color: #f97316;">Contact Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${escapeHtml(name)}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${email}">${escapeHtml(email)}</a></span>
            </div>
            ${company ? `
            <div class="info-row">
              <span class="label">Company:</span>
              <span class="value">${escapeHtml(company)}</span>
            </div>
            ` : ''}
            ${phone ? `
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value"><a href="tel:${phone}">${escapeHtml(phone)}</a></span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">Subject:</span>
              <span class="value">${escapeHtml(subject)}</span>
            </div>
            <div class="info-row">
              <span class="label">Submitted:</span>
              <span class="value">${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div class="message-section">
            <h3 style="margin-top: 0; color: #374151;">Message</h3>
            <div class="message-content">${escapeHtml(message)}</div>
          </div>
          
          <div class="priority-notice">
            <strong>Action Required:</strong> Please respond to this inquiry within 24 hours to maintain our high client service standards.
          </div>
        </div>
        
        <div class="footer">
          <p>This email was automatically generated from the ABA IP website contact form.</p>
          <p>Please do not reply to this email. Respond directly to the client's email address above.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Generate plain text email content
function generateEmailText(data) {
  const { name, email, company, phone, subject, message } = data;
  
  return `
NEW CONTACT FORM SUBMISSION
ABA IP Law Firm

CONTACT INFORMATION:
Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}
Submitted: ${new Date().toLocaleString()}

MESSAGE:
${message}

---
This email was automatically generated from the ABA IP website contact form.
Please respond directly to the client's email address: ${email}
  `.trim();
}

// Escape HTML characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}