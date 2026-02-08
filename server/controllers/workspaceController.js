import prisma from '../prismaClient.js';

export const getUserWorkspaces = async (req, res) => {
  try {
    const { userId } = await req.auth();
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: { some: { userId: userId } }
      },
      include: {
        members: { include: { user: true } },
        projects: {
          include: {
            tasks: { 
              include: { 
                assignee: true, 
                comments: { include: { user: true } } 
              } 
            },
            members: { include: { user: true } }
          }
        }, 
        owner: true
      }
    });
    
    res.json({ workspaces });
  }
  catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}


// Add member to workspace
export const addMember = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { email, role, workspaceId } = req.body;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate required fields
    if (!workspaceId || !role || !email) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Validate role
    if (!["ADMIN", "MEMBER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch workspace
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true }
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if requester has admin role
    const isAdmin = workspace.members.find(
      (member) => member.userId === userId && member.role === "ADMIN"
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "You do not have admin privileges" });
    }

    // 🔴 CRITICAL FIX: Check if the USER BEING ADDED is already a member
    // Changed from: member.userId === userId (checks the admin)
    // To: member.userId === user.id (checks the user being added)
    const existingMember = workspace.members.find(
      (member) => member.userId === user.id
    );

    if (existingMember) {
      return res.status(400).json({ message: "User is already a member of this workspace" });
    }

    // Create member (removed 'message' field - add back if it exists in your schema)
    const member = await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId,
        role
      }
    });

    res.json({ member, message: "Member added successfully" });

  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}