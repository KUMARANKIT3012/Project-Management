import express from "express";
import { inngest } from "../inngest/client.js"; // this already exists in your project

const router = express.Router();

router.post("/invite", async (req, res) => {
  try {
    const { email, role, workspaceId } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("📨 Invite request received:", email);

    // 🔥 Trigger Inngest event (this runs your email function)
    await inngest.send({
      name: "app/task.assigned",
      data: {
        taskId: workspaceId || "manual-invite",
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        invitedEmail: email,
        role,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Invite error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
