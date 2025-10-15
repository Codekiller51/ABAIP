// Email Configuration
// Configure your SMTP settings here

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
  to: {
    email: string;
  };
}

// SMTP Configuration - Update these values with your email provider settings
export const emailConfig: SMTPConfig = {
  // SMTP Server Settings
  host: 'mail.abaip.co.tz',           // Your SMTP host (e.g., smtp.gmail.com, smtp.outlook.com)
  port: 465,                        // SMTP port (587 for TLS, 465 for SSL, 25 for non-secure)
  secure: true,                    // true for 465 (SSL), false for other ports (TLS)
  
  // Authentication
  auth: {
    user: 'admin@abaip.co.tz',   // Your email address
    pass: 'TANZANIA@2024',      // Your email password or app-specific password
  },
  
  // Email Headers
  from: {
    name: 'Contact Form - ABA IP Consultancy',        // Sender name
    email: 'admin@abaip.co.tz',    // Sender email (can be different from auth.user)
  },
  
  // Recipient
  to: {
    // email: 'info@abaip.co.tz',  
    email: 'andymalando@gmail.com',     // Where contact form emails will be sent
  },
};

// Popular SMTP Provider Configurations (for reference)
export const providerConfigs = {
  gmail: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    // Note: Use app-specific password with 2FA enabled
  },
  
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
  },
  
  yahoo: {
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
  },
  
  zoho: {
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
  },
  
  // Custom SMTP server
  custom: {
    host: 'mail.abaip.co.tz',
    port: 465,
    secure: true,
  },
};