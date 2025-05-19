import Message from '../models/Message.js';
//import nodemailer from 'nodemailer';
//import process from 'process'
// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Validate subject length
    if (!subject || subject.length < 3) {
      return res.status(400).json({ message: 'Subject must be at least 3 characters long' });
    }
    
    if (subject.length > 50) {
      return res.status(400).json({ message: 'Subject cannot exceed 50 characters' });
    }
    
    // Validate message length
    if (!message || message.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters long' });
    }
    
    if (message.length > 500) {
      return res.status(400).json({ message: 'Message cannot exceed 500 characters' });
    }
    
    //  // Validate email format
    //  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //  if (!emailRegex.test(email)) {
    //    return res.status(400).json({ message: 'Invalid email format' });
    //  }

    const newMessage = await Message.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });
    
    // // Send email to shop owner - only attempt if credentials exist
    // const emailUser = process.env.EMAIL_USER;
    // const emailPassword = process.env.EMAIL_PASSWORD;
    
    // if (emailUser && emailPassword) {
    //   try {
    //     // Create transporter
    //     const transporter = nodemailer.createTransport({
    //       host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    //       port: process.env.EMAIL_PORT || 587,
    //       secure: process.env.EMAIL_SECURE === 'true',
    //       auth: {
    //         user: emailUser,
    //         pass: emailPassword
    //       }
    //     });
        
    //     await transporter.sendMail({
    //       from: `"Blooming Delights Website" <${emailUser}>`,
    //       to: "hello@bloomingdelights.com",
    //       subject: `New Contact Form Message: ${subject}`,
    //       text: `
    //         Name: ${name}
    //         Email: ${email}
    //         Phone: ${phone || 'Not provided'}
            
    //         Message:
    //         ${message}
    //       `,
    //       html: `
    //         <h3>New Message from Contact Form</h3>
    //         <p><strong>Name:</strong> ${name}</p>
    //         <p><strong>Email:</strong> ${email}</p>
    //         <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    //         <p><strong>Subject:</strong> ${subject}</p>
    //         <hr>
    //         <p><strong>Message:</strong></p>
    //         <p>${message.replace(/\n/g, '<br>')}</p>
    //       `
    //     });
    //     console.log('Email notification sent successfully');
    //   } catch (emailError) {
    //     console.error('Error sending email:', emailError);
    //     // Continue even if email fails
    //   }
    // } else {
    //   console.log('Email notifications are disabled. Set EMAIL_USER and EMAIL_PASSWORD environment variables to enable.');
    // }
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all messages (for admin)
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get unread message count (for admin dashboard)
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({
      where: { isRead: false }
    });
    
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findByPk(id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.isRead = true;
    await message.save();
    
    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const message = await Message.findByPk(id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await message.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 