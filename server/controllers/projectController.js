import prisma from "../configs/prisma.js";

// Create project 
export const createProject = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const { workspaceId, description, name, status, start_date, end_date, 
        team_members, team_lead, progress, priority } = req.body;

        // check if user has admin role for workspace
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {members: {include: {user: true}}}
        })

        if(!workspace){
            return res.status(404).json({message : "workspace not found"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
    }
}

// Update project 
export const updateProject = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
    }
}

// Add Member to project 
export const addMember = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.code || error.message})
    }
}
