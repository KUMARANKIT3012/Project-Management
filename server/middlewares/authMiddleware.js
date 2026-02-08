export const protect = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID found" });
    }

    // Optionally attach userId to req for use in controllers
    req.userId = userId;

    next(); // No return needed here
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: "Unauthorized - Authentication failed" });
  }
};