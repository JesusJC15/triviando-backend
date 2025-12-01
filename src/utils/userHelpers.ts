import User from "../models/user.model";
import logger from "./logger";

/**
 * Resolves a user's display name.
 * Returns the provided name if it's valid, otherwise fetches the name from the database.
 * Falls back to "Anonymous" if no name can be determined.
 * 
 * @param userId - The user's ID
 * @param currentName - Optional current name (e.g., from token payload)
 * @returns The resolved user name
 */
export async function resolveUserName(userId: string, currentName?: string): Promise<string> {
  if (currentName && String(currentName).trim()) {
    return currentName;
  }
  try {
    const user = await User.findById(userId).select("name").lean();
    return user?.name || "Anonymous";
  } catch (error: any) {
    // Keep legacy console signature used in tests: (message, Error)
    logger.error('[resolveUserName] Error fetching user:', error);
    return "Anonymous";
  }
}
