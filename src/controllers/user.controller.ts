import { Request, Response } from "express";
import User from "../models/user.model";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("_id name email createdAt").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error: any) {
    console.error("[getUserProfile] Error:", error);
    return res.status(500).json({
      message: "Error obteniendo perfil de usuario",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, email } = req.body;
    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("_id name email createdAt").lean();
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error: any) {
    console.error("[updateUserProfile] Error:", error);
    return res.status(500).json({
      message: "Error actualizando perfil de usuario",
      error: error.message,
    });
  }
};

