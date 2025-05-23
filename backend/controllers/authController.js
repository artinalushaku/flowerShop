import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

// Helper function to count admins
const countAdmins = async () => {
  return await User.count({ where: { role: 'admin' } });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, username, password, role } = req.body;

    // Validate name lengths
    if (!firstName || firstName.length < 4) {
      return res.status(400).json({
        message: 'First name must be at least 4 characters long'
      });
    }

    if (!lastName || lastName.length < 4) {
      return res.status(400).json({
        message: 'Last name must be at least 4 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    // Check admin count if registering as admin
    if (role === 'admin') {
      const adminCount = await countAdmins();
      if (adminCount >= 10) {
        return res.status(400).json({
          message: 'Maximum number of administrators (10) has been reached'
        });
      }
    }

    // krijoje nje user te ri me role (defaults to 'user' if not provided)
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      username,
      password,
      role: role || 'user'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'flowershop-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'flowershop-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

// me i marr krejt userat (prej adminit )
export const getAllUsers = async (req, res) => {
  try {
    // kontrolloje se a eshte useri admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'username', 'role', 'createdAt']
    });

    res.json(users); //nese osht admin kthej userat 
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// merr userin prej Id (prej adminit)
export const getUserById = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'username', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user - admin only
export const updateUser = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { firstName, lastName, email, phoneNumber, username, role } = req.body;
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if changing role from admin to non-admin
    if (user.role === 'admin' && role !== 'admin') {
      // Count admins to ensure we're not removing the last admin
      const adminCount = await countAdmins();
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot remove the last administrator. At least one administrator must remain in the system.'
        });
      }
    }

    // Check if changing role from non-admin to admin
    if (user.role !== 'admin' && role === 'admin') {
      // Count admins to ensure we're not exceeding the limit
      const adminCount = await countAdmins();
      if (adminCount >= 10) {
        return res.status(400).json({ 
          message: 'Maximum number of administrators (10) has been reached'
        });
      }
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.username = username;
    user.role = role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user - admin only
export const deleteUser = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Check if trying to delete an admin
    if (user.role === 'admin') {
      // Count admins to ensure we're not removing the last admin
      const adminCount = await countAdmins();
      if (adminCount <= 1) {
        return res.status(400).json({ 
          message: 'Cannot delete the last administrator. At least one administrator must remain in the system.'
        });
      }
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Update own profile - for authenticated users to update their own profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, phoneNumber } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};