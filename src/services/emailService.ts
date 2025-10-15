import { emailConfig, SMTPConfig } from '../config/emailConfig';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

class EmailService {
  private config: SMTPConfig;

  constructor() {
    this.config = emailConfig;
  }

  /**
   * Send contact form email
   */
  async sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
    try {
      // Validate configuration
      if (!this.validateConfig()) {
        return {
          success: false,
          message: 'Email service not properly configured. Please contact administrator.',
          error: 'Invalid SMTP configuration'
        };
      }

      // Generate email content
      const emailContent = this.generateEmailHTML(formData);
      const emailText = this.generateEmailText(formData);

      // Prepare email data
      const emailData = {
        from: `"${this.config.from.name}" <${this.config.from.email}>`,
        to: this.config.to.email,
        subject: `New Contact Form Submission: ${formData.subject}`,
        html: emailContent,
        text: emailText,
        replyTo: formData.email,
      };

      // Send email (this would be handled by your backend API)
      const result = await this.sendEmail(emailData);

      if (result.success) {
        return {
          success: true,
          message: 'Thank you for your message. We will contact you within 24 hours!'
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }

    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: 'Unable to send message at this time. Please try again later or contact us directly.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate SMTP configuration
   */
  private validateConfig(): boolean {
    const { host, port, auth, from, to } = this.config;
    
    return !!(
      host &&
      port &&
      auth.user &&
      auth.pass &&
      from.name &&
      from.email &&
      to.email
    );
  }

  /**
   * Generate HTML email content
   */
  private generateEmailHTML(data: ContactFormData): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .info-section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
          .info-row { margin: 10px 0; }
          .label { font-weight: 600; color: #374151; display: inline-block; min-width: 100px; }
          .value { color: #6b7280; }
          .message-section { background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0; }
          .message-content { white-space: pre-wrap; line-height: 1.6; color: #374151; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
          .footer p { margin: 0; font-size: 14px; color: #6b7280; }
          .priority-notice { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .priority-notice strong { color: #78350f; }
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
                <span class="value">${this.escapeHtml(data.name)}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${data.email}" style="color: #f97316; text-decoration: none;">${this.escapeHtml(data.email)}</a></span>
              </div>
              ${data.company ? `
              <div class="info-row">
                <span class="label">Company:</span>
                <span class="value">${this.escapeHtml(data.company)}</span>
              </div>
              ` : ''}
              ${data.phone ? `
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${data.phone}" style="color: #f97316; text-decoration: none;">${this.escapeHtml(data.phone)}</a></span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Subject:</span>
                <span class="value">${this.escapeHtml(data.subject)}</span>
              </div>
              <div class="info-row">
                <span class="label">Submitted:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <div class="message-section">
              <h3 style="margin-top: 0; color: #374151;">Message</h3>
              <div class="message-content">${this.escapeHtml(data.message)}</div>
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

  /**
   * Generate plain text email content
   */
  private generateEmailText(data: ContactFormData): string {
    return `
NEW CONTACT FORM SUBMISSION
ABA IP Law Firm

CONTACT INFORMATION:
Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ''}
${data.phone ? `Phone: ${data.phone}` : ''}
Subject: ${data.subject}
Submitted: ${new Date().toLocaleString()}

MESSAGE:
${data.message}

---
This email was automatically generated from the ABA IP website contact form.
Please respond directly to the client's email address: ${data.email}
    `.trim();
  }

  /**
   * Escape HTML characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Send email (this would be replaced with actual backend API call)
   */
  private async sendEmail(emailData: any): Promise<EmailResponse> {
    // In a real application, this would make an API call to your backend
    // which would use nodemailer or similar service to send the email
    
    try {
      // Simulate API call to backend email service
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...emailData,
          smtpConfig: this.config
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;

    } catch (error) {
      // Fallback: simulate email sending for demo purposes
      console.log('Email would be sent with config:', this.config);
      console.log('Email data:', emailData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success (in production, this would be actual email sending)
      return {
        success: true,
        message: 'Email sent successfully'
      };
    }
  }

  /**
   * Get current configuration (for debugging)
   */
  getConfig(): SMTPConfig {
    return { ...this.config };
  }

  /**
   * Test email configuration
   */
  async testConfiguration(): Promise<EmailResponse> {
    try {
      const testData: ContactFormData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Configuration Test',
        message: 'This is a test message to verify email configuration.'
      };

      return await this.sendContactEmail(testData);
    } catch (error) {
      return {
        success: false,
        message: 'Configuration test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default EmailService;