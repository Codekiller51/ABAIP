# ABA IP Law Firm Website

A modern, responsive website for ABA IP Law Firm built with React, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with beautiful layouts across all devices
- **Modern UI/UX**: Clean, professional design with smooth animations and micro-interactions
- **Contact Form**: Integrated email functionality with SMTP configuration
- **Multi-page Navigation**: Home, About, Services, Team, Resources, and Contact pages
- **Image Galleries**: Professional photography with optimized overlays
- **Interactive Elements**: Hover effects, transitions, and engaging user interactions

## Email Configuration

The contact form is configured to send emails through SMTP. To set up email functionality:

### 1. Configure SMTP Settings

Edit the file `src/config/emailConfig.ts` and update the following settings:

```typescript
export const emailConfig: SMTPConfig = {
  // SMTP Server Settings
  host: 'smtp.gmail.com',           // Your SMTP host
  port: 587,                        // SMTP port (587 for TLS, 465 for SSL)
  secure: false,                    // true for 465 (SSL), false for other ports
  
  // Authentication
  auth: {
    user: 'your-email@gmail.com',   // Your email address
    pass: 'your-app-password',      // Your email password or app-specific password
  },
  
  // Email Headers
  from: {
    name: 'ABA IP Law Firm',        // Sender name
    email: 'noreply@aba-ip.com',    // Sender email
  },
  
  // Recipient
  to: {
    email: 'info@aba-ip.com',       // Where contact form emails will be sent
  },
};
```

### 2. Popular SMTP Providers

#### Gmail
- Host: `smtp.gmail.com`
- Port: `587` (TLS) or `465` (SSL)
- Enable 2-factor authentication and use an app-specific password

#### Outlook/Hotmail
- Host: `smtp-mail.outlook.com`
- Port: `587`
- Use your regular email credentials

#### Yahoo
- Host: `smtp.mail.yahoo.com`
- Port: `587`
- May require app-specific password

#### Custom SMTP
- Use your hosting provider's SMTP settings
- Contact your hosting provider for specific configuration

### 3. Backend Implementation

For production use, you'll need to implement a backend API endpoint at `/api/send-email` that:

1. Receives the email data and SMTP configuration
2. Uses a library like `nodemailer` to send the email
3. Returns success/error status

Example backend implementation (Node.js/Express):

```javascript
const nodemailer = require('nodemailer');

app.post('/api/send-email', async (req, res) => {
  const { smtpConfig, ...emailData } = req.body;
  
  const transporter = nodemailer.createTransporter({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: smtpConfig.auth
  });
  
  try {
    await transporter.sendMail(emailData);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});
```

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── config/             # Configuration files
├── services/           # Business logic and API services
├── utils/              # Utility functions
└── styles/             # CSS and styling files
```

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Vite**: Fast build tool and development server

## License

© 2025 ABA IP Law Firm. All rights reserved.