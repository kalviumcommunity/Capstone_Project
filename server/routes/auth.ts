import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory user storage (replace with database later)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  moodHistory: Array<{
    mood: string;
    intensity: number;
    time: string;
    notes?: string;
  }>;
  conversationHistory: Array<{
    id: string;
    type: "user" | "bot";
    text: string;
    time: string;
    category?: string;
  }>;
}

const users: Map<string, User> = new Map();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Helper function to find user by email
const findUserByEmail = (email: string): User | undefined => {
  for (const user of users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};

// Signup endpoint
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = Date.now().toString();
    const newUser: User = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      moodHistory: [],
      conversationHistory: [],
    };

    users.set(userId, newUser);

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login endpoint
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user profile endpoint
export const handleGetProfile: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId; // Set by auth middleware
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        moodHistory: user.moodHistory,
        conversationHistory: user.conversationHistory,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Track mood endpoint
export const handleTrackMood: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId;
    const { mood, intensity, notes } = req.body;

    if (!mood || intensity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Mood and intensity are required",
      });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const moodEntry = {
      mood,
      intensity,
      time: new Date().toISOString(),
      notes,
    };

    user.moodHistory.push(moodEntry);

    res.json({
      success: true,
      message: "Mood tracked successfully",
      moodEntry,
    });
  } catch (error) {
    console.error("Track mood error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Save conversation endpoint
export const handleSaveConversation: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId;
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "Messages array is required",
      });
    }

    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Replace conversation history with new messages
    user.conversationHistory = messages;

    res.json({
      success: true,
      message: "Conversation saved successfully",
    });
  } catch (error) {
    console.error("Save conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Export users map for middleware
export { users };
