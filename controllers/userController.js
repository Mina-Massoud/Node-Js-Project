import User from "../models/User.js";
import { AppError } from "../utils/classError.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, age, phone, address, role } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError("Email already registered", 400);

    const existingPhone = await User.findOne({ phone });
    if (existingPhone)
      throw new AppError("Phone number already registered", 400);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      age,
      phone,
      address,
      role,
    });

    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new AppError("Email and password are required", 400);

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new AppError("Invalid email or password", 401);

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new AppError("Invalid email or password", 401);

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      results: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
