import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserLoginInput, UserRegistrationInput, UserRole, CompanyType } from '../interfaces/user.interface';
import Joi from 'joi';
import pool from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';

// Validation schema for user registration
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  company_name: Joi.string().required(),
  role: Joi.string().valid('company', 'transporter', 'admin').required(),
  contact_person: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  company_type: Joi.string().valid('manufacturer', 'recycler', 'processor', 'distributor').when('role', {
    is: 'company',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  industry_sector: Joi.string().optional()
});

// Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', req.body);

    // 1. Validate request body
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password, company_name, role } = req.body;

    // 2. Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, company_name, role, active) VALUES ($1, $2, $3, $4, true) RETURNING *',
      [email, hashedPassword, company_name, role]
    );

    const newUser = result.rows[0];

    // 5. Generate token
    const token = generateToken({
      id: newUser.user_id,
      email: newUser.email,
      role: newUser.role
    });

    console.log('Registration successful:', newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.user_id,
        email: newUser.email,
        role: newUser.role,
        company_name: newUser.company_name
      },
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

/**
 * Login user and return JWT token
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Placeholder for login logic
    const { email, password } = req.body;

    // Mock successful login using the generateToken utility
    const token = generateToken({ id: 'mock-id', email });

    res.status(200).json({
      success: true,
      token,
      user: { id: 'mock-id', email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
}; 