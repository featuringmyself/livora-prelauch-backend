import express from "express";
import Lead from "../models/lead.model.js";
import sgMail from '@sendgrid/mail';

const createLead = async (req, res) => {
    try {
        console.log("Received request to create lead:", req.body);
        const { email } = req.body;  // Fixed: removed the extra !

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        const leadExists = await Lead.findOne({ email });
        if (leadExists) {
            return res.status(409).json({  // Changed to 409 for conflict
                message: "Lead already exists"
            });
        }

        const lead = await Lead.create({ email });
        console.log("Lead successfully created in database:", lead);

        // Send welcome email using SendGrid
        if (!process.env.SENDGRID_API_KEY) {
            console.error("SENDGRID_API_KEY is not set in environment variables! Email will not be sent.");
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL, // Verified sender
            subject: '🎉 You are in! Welcome to the Livora Community',
            text: 'Thank you for joining our waitlist. We are excited to have you on board!',
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Livora - Early Access Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 48px 40px 32px; background-color: #f8fafc; border-bottom: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <h1 style="margin: 0 0 8px; font-size: 32px; font-weight: 700; color: #1f2937; letter-spacing: -0.025em;">Welcome to Livora</h1>
                                        <p style="margin: 0; font-size: 18px; color: #6b7280; font-weight: 400;">Your early access is confirmed</p>
                                    </td>
                                    <td width="80" align="right">
                                        <div style="width: 60px; height: 60px; background-color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <div style="width: 20px; height: 20px; background-color: #ffffff; border-radius: 50%;"></div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px;">
                            
                            <p style="margin: 0 0 24px; font-size: 18px; color: #1f2937; font-weight: 500;">Hi there,</p>
                            
                            <p style="margin: 0 0 32px; font-size: 16px; color: #374151; line-height: 1.6;">
                                Thank you for joining our early access program. You're now part of a select group who will be first to experience India's most advanced AI-powered nutrition platform by <strong style="color: #10b981;">Livora</strong>.
                            </p>
                            
                            <!-- What's Next Section -->
                            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; margin: 32px 0;">
                                <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 600; color: #1f2937;">What happens next</h2>
                                
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 0 0 20px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="24" style="vertical-align: top; padding-top: 2px;">
                                                        <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%;"></div>
                                                    </td>
                                                    <td style="padding-left: 16px;">
                                                        <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Launch notification</h3>
                                                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Be the first to know when we officially launch</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 0 0 20px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="24" style="vertical-align: top; padding-top: 2px;">
                                                        <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%;"></div>
                                                    </td>
                                                    <td style="padding-left: 16px;">
                                                        <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Product insights</h3>
                                                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Exclusive previews of our AI-curated meal plans and smart nutrition features</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td style="padding: 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="24" style="vertical-align: top; padding-top: 2px;">
                                                        <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%;"></div>
                                                    </td>
                                                    <td style="padding-left: 16px;">
                                                        <h3 style="margin: 0 0 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Priority access</h3>
                                                        <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">Special pricing and immediate enrollment when we open to the public</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Social Follow -->
                            <div style="background-color: #1f2937; border-radius: 8px; padding: 24px; text-align: center;">
                                <p style="margin: 0 0 16px; font-size: 16px; color: #d1d5db; font-weight: 500;">Stay connected</p>
                                <p style="margin: 0 0 20px; font-size: 14px; color: #9ca3af; line-height: 1.5;">Follow our journey and get nutrition insights on Instagram</p>
                                <a href="https://instagram.com/livoralife_com" style="display: inline-block; background-color: #ffffff; color: #1f2937; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 6px; border: 1px solid #e5e7eb;">
                                    Follow @livoralife_com
                                </a>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                                We're building the future of personalized nutrition.<br>
                                Thank you for being part of our early community.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
            `,
        };
        console.log("Preparing to send email:", msg);
        try {
            const sg = await sgMail.send(msg);
            console.log("Email sent successfully:", sg)
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            if (emailError.response) {
              console.error(emailError.response.body)
            }
            // Optionally, you can still return success for lead creation
        }

        res.status(201).json({
            message: "Lead created successfully",
            data: lead
        });
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export { createLead };