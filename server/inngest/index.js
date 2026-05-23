import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

// Create Inngest client
export const inngest = new Inngest({
  id: "project-management",
  eventKey: process.env.INNGEST_EVENT_KEY
});

// Inngest Function to save user data to database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }]
  },
  async ({ event, step }) => {
    return await step.run("create-user", async () => {
      try {
        const { data } = event;

        if (!data?.id) {
          throw new Error("User ID is missing from webhook data");
        }

        const email = data.email_addresses?.[0]?.email_address;

        if (!email) {
          throw new Error("Email address is missing from webhook data");
        }

        console.log("Creating user with ID:", data.id);

        const user = await prisma.user.create({
          data: {
            id: data.id,
            email: email,
            name:
              `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
              null,
            image: data.image_url || null,
          },
        });

        console.log("✅ User created successfully:", user.id);

        return {
          success: true,
          userId: user.id,
        };
      } catch (error) {
        console.error("❌ Error creating user:", error);
        throw error;
      }
    });
  }
);

// Update user
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }]
  },
  async ({ event, step }) => {
    return await step.run("update-user", async () => {
      try {
        const { data } = event;

        if (!data?.id) {
          throw new Error("User ID is missing from webhook data");
        }

        console.log("Updating user with ID:", data.id);

        const updateData = {};

        if (data.email_addresses?.[0]?.email_address) {
          updateData.email = data.email_addresses[0].email_address;
        }

        const fullName =
          `${data.first_name || ""} ${data.last_name || ""}`.trim();

        if (fullName) {
          updateData.name = fullName;
        }

        if (data.image_url) {
          updateData.image = data.image_url;
        }

        const user = await prisma.user.update({
          where: { id: data.id },
          data: updateData,
        });

        console.log("✅ User updated successfully:", user.id);

        return {
          success: true,
          userId: user.id,
        };
      } catch (error) {
        console.error("❌ Error updating user:", error);
        throw error;
      }
    });
  }
);

// Delete user
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }]
  },
  async ({ event, step }) => {
    return await step.run("delete-user", async () => {
      try {
        const { data } = event;

        if (!data?.id) {
          throw new Error("User ID is missing from webhook data");
        }

        console.log("Deleting user with ID:", data.id);

        await prisma.user.delete({
          where: { id: data.id },
        });

        console.log("✅ User deleted successfully");

        return {
          success: true,
          deletedId: data.id,
        };
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        throw error;
      }
    });
  }
);

// Create workspace
const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.created" }]
  },
  async ({ event, step }) => {
    return await step.run("create-workspace", async () => {
      try {
        const { data } = event;

        if (!data?.id) {
          throw new Error("Workspace ID is missing");
        }

        if (!data?.created_by) {
          throw new Error("Creator ID missing");
        }

        if (!data?.name) {
          throw new Error("Workspace name missing");
        }

        console.log("Creating workspace:", data.id);

        const workspace = await prisma.workspace.create({
          data: {
            id: data.id,
            name: data.name,
            slug: data.slug,
            ownerId: data.created_by,
            image_url: data.image_url,
          },
        });

        await prisma.workspaceMember.create({
          data: {
            userId: data.created_by,
            workspaceId: data.id,
            role: "ADMIN",
          },
        });

        console.log("✅ Workspace created");

        return {
          success: true,
          workspaceId: workspace.id,
        };
      } catch (error) {
        console.error("❌ Error creating workspace:", error);
        throw error;
      }
    });
  }
);

// Update workspace
const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.updated" }]
  },
  async ({ event, step }) => {
    return await step.run("update-workspace", async () => {
      try {
        const { data } = event;

        if (!data?.id) {
          throw new Error("Workspace ID missing");
        }

        const updateData = {};

        if (data.name) updateData.name = data.name;

        if (data.slug) updateData.slug = data.slug;

        if (data.image_url !== undefined) {
          updateData.image_url = data.image_url;
        }

        const workspace = await prisma.workspace.update({
          where: { id: data.id },
          data: updateData,
        });

        console.log("✅ Workspace updated");

        return {
          success: true,
          workspaceId: workspace.id,
        };
      } catch (error) {
        console.error("❌ Error updating workspace:", error);
        throw error;
      }
    });
  }
);

// Delete workspace
const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-with-clerk",
    triggers: [{ event: "clerk/organization.deleted" }]
  },
  async ({ event, step }) => {
    return await step.run("delete-workspace", async () => {
      try {
        const { data } = event;

        if (!data?.id) {
          throw new Error("Workspace ID missing");
        }

        await prisma.workspace.delete({
          where: { id: data.id },
        });

        console.log("✅ Workspace deleted");

        return {
          success: true,
          deletedId: data.id,
        };
      } catch (error) {
        console.error("❌ Error deleting workspace:", error);
        throw error;
      }
    });
  }
);

// Create workspace member
const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [
      { event: "clerk/organizationInvitation.accepted" }
    ]
  },
  async ({ event, step }) => {
    return await step.run("create-workspace-member", async () => {
      try {
        const { data } = event;

        if (!data?.user_id) {
          throw new Error("User ID missing");
        }

        if (!data?.organization_id) {
          throw new Error("Organization ID missing");
        }

        if (!data?.role_name) {
          throw new Error("Role missing");
        }

        const member = await prisma.workspaceMember.create({
          data: {
            userId: data.user_id,
            workspaceId: data.organization_id,
            role: String(data.role_name).toUpperCase(),
          },
        });

        console.log("✅ Workspace member created");

        return {
          success: true,
          memberId: member.id,
        };
      } catch (error) {
        console.error("❌ Error creating member:", error);
        throw error;
      }
    });
  }
);

// Send assignment email
const sendTaskAssignmentEmail = inngest.createFunction(
  {
    id: "send-task-assignment-mail",
    triggers: [{ event: "app/task.assigned" }]
  },
  async ({ event, step }) => {
    return await step.run("send-assignment-email", async () => {
      try {
        const { taskId, origin } = event.data;

        if (!taskId) {
          return {
            success: false,
            error: "Task ID missing",
          };
        }

        const task = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            assignee: true,
            project: true,
          },
        });

        if (!task || !task.assignee || !task.project) {
          return {
            success: false,
            error: "Invalid task data",
          };
        }

        await sendEmail({
          to: task.assignee.email,
          subject: `New Task Assignment in ${task.project.name}`,
          body: `
            <h2>Hello ${task.assignee.name || "there"} 👋</h2>
            <p>You have been assigned a new task:</p>
            <h3>${task.title}</h3>
            <p>${task.description || "No description"}</p>
            <a href="${origin || "#"}">View Task</a>
          `,
        });

        console.log("✅ Assignment email sent");

        return {
          success: true,
          taskId: task.id,
        };
      } catch (error) {
        console.error("❌ Email function error:", error);

        return {
          success: false,
          error: error.message,
        };
      }
    });
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
  sendTaskAssignmentEmail,
];