import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";

// Create Inngest client
export const inngest = new Inngest({ 
  id: "project-management",
  eventKey: process.env.INNGEST_EVENT_KEY
});

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event, step }) => {
    return await step.run('create-user', async () => {
      try {
        const { data } = event;
        
        // Validate required data exists
        if (!data?.id) {
          throw new Error('User ID is missing from webhook data');
        }

        const email = data.email_addresses?.[0]?.email_address;
        
        if (!email) {
          throw new Error('Email address is missing from webhook data');
        }

        console.log('Creating user with ID:', data.id);

        const user = await prisma.user.create({
          data: {
            id: data.id,
            email: email,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
            image: data.image_url || null,
          }
        });

        console.log('✅ User created successfully:', user.id);
        return { success: true, userId: user.id };
        
      } catch (error) {
        console.error('❌ Error creating user:', error);
        // Re-throw to let Inngest handle retry logic
        throw error;
      }
    });
  }
);

// Inngest Function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event, step }) => {
    return await step.run('update-user', async () => {
      try {
        const { data } = event;
        
        if (!data?.id) {
          throw new Error('User ID is missing from webhook data');
        }

        console.log('Updating user with ID:', data.id);

        const updateData = {};
        
        // Only update fields that are present
        if (data.email_addresses?.[0]?.email_address) {
          updateData.email = data.email_addresses[0].email_address;
        }
        
        const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim();
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

        console.log('✅ User updated successfully:', user.id);
        return { success: true, userId: user.id };
        
      } catch (error) {
        console.error('❌ Error updating user:', error);
        throw error;
      }
    });
  }
);

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event, step }) => {
    return await step.run('delete-user', async () => {
      try {
        const { data } = event;
        
        if (!data?.id) {
          throw new Error('User ID is missing from webhook data');
        }

        console.log('Deleting user with ID:', data.id);

        await prisma.user.delete({
          where: { id: data.id },
        });

        console.log('✅ User deleted successfully');
        return { success: true, deletedId: data.id };
        
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        throw error;
      }
    });
  }
);

// Inngest Function to save workspace data to a database
const syncWorkspaceCreation = inngest.createFunction(
  { id: 'sync-workspace-from-clerk' },
  { event: 'clerk/organization.created' },
  async ({ event, step }) => {
    return await step.run('create-workspace', async () => {
      try {
        const { data } = event;
        
        // Validate required data exists
        if (!data?.id) {
          throw new Error('Workspace ID is missing from webhook data');
        }
        
        if (!data?.created_by) {
          throw new Error('Creator ID is missing from webhook data');
        }
        
        if (!data?.name) {
          throw new Error('Workspace name is missing from webhook data');
        }

        console.log('Creating workspace with ID:', data.id);

        const workspace = await prisma.workspace.create({
          data: {
            id: data.id,
            name: data.name,
            slug: data.slug,
            ownerId: data.created_by,
            image_url: data.image_url,
          }
        });

        // Add creator as ADMIN member
        await prisma.workspaceMember.create({
          data: {
            userId: data.created_by,
            workspaceId: data.id,
            role: "ADMIN"
          }
        });

        console.log('✅ Workspace created successfully:', workspace.id);
        return { success: true, workspaceId: workspace.id };
        
      } catch (error) {
        console.error('❌ Error creating workspace:', error);
        throw error;
      }
    });
  }
);

// Inngest Function to update workspace data in database
const syncWorkspaceUpdation = inngest.createFunction(
  { id: 'update-workspace-from-clerk' },
  { event: 'clerk/organization.updated' },
  async ({ event, step }) => {
    return await step.run('update-workspace', async () => {
      try {
        const { data } = event;
        
        if (!data?.id) {
          throw new Error('Workspace ID is missing from webhook data');
        }

        console.log('Updating workspace with ID:', data.id);

        const updateData = {};
        
        // Only update fields that are present
        if (data.name) {
          updateData.name = data.name;
        }
        
        if (data.slug) {
          updateData.slug = data.slug;
        }
        
        if (data.image_url !== undefined) {
          updateData.image_url = data.image_url;
        }

        const workspace = await prisma.workspace.update({
          where: { id: data.id },
          data: updateData,
        });

        console.log('✅ Workspace updated successfully:', workspace.id);
        return { success: true, workspaceId: workspace.id };
        
      } catch (error) {
        console.error('❌ Error updating workspace:', error);
        throw error;
      }
    });
  }
);

// Inngest Function to delete workspace from database
const syncWorkspaceDeletion = inngest.createFunction(
  { id: 'delete-workspace-with-clerk' },
  { event: 'clerk/organization.deleted' },
  async ({ event, step }) => {
    return await step.run('delete-workspace', async () => {
      try {
        const { data } = event;
        
        if (!data?.id) {
          throw new Error('Workspace ID is missing from webhook data');
        }

        console.log('Deleting workspace with ID:', data.id);

        await prisma.workspace.delete({
          where: { id: data.id },
        });

        console.log('✅ Workspace deleted successfully');
        return { success: true, deletedId: data.id };
        
      } catch (error) {
        console.error('❌ Error deleting workspace:', error);
        throw error;
      }
    });
  }
);

// Inngest Function to save workspace member data to a database
const syncWorkspaceMemberCreation = inngest.createFunction(
  { id: 'sync-workspace-member-from-clerk' },
  { event: 'clerk/organizationInvitation.accepted' },
  async ({ event, step }) => {
    return await step.run('create-workspace-member', async () => {
      try {
        const { data } = event;
        
        // Validate required data exists
        if (!data?.user_id) {
          throw new Error('User ID is missing from webhook data');
        }
        
        if (!data?.organization_id) {
          throw new Error('Organization ID is missing from webhook data');
        }
        
        if (!data?.role_name) {
          throw new Error('Role name is missing from webhook data');
        }

        console.log('Creating workspace member:', data.user_id, 'for workspace:', data.organization_id);

        const member = await prisma.workspaceMember.create({
          data: {
            userId: data.user_id,
            workspaceId: data.organization_id,
            role: String(data.role_name).toUpperCase(),
          }
        });

        console.log('✅ Workspace member created successfully');
        return { success: true, memberId: member.id };
        
      } catch (error) {
        console.error('❌ Error creating workspace member:', error);
        throw error;
      }
    });
  }
);


// Inngest function to send email on task creation
const sendTaskAssignmentEmail = inngest.createFunction(
    { id: "send-task-assignment-mail" },
    { event: "app/task.assigned" },
    async ({ event, step }) => {
        return await step.run('send-assignment-email', async () => {
            try {
                const { taskId, origin } = event.data;

                if (!taskId) {
                    console.log('❌ Task ID is missing from event data');
                    return { success: false, error: 'Task ID missing' };
                }

                console.log('📧 Fetching task with ID:', taskId);

                const task = await prisma.task.findUnique({
                    where: { id: taskId },
                    include: { assignee: true, project: true }
                });

                if (!task) {
                    console.log('❌ Task not found');
                    return { success: false, error: 'Task not found' };
                }

                if (!task.assignee) {
                    console.log('⚠️ Task has no assignee, skipping email');
                    return { success: true, skipped: 'No assignee' };
                }

                if (!task.project) {
                    console.log('❌ Task has no project');
                    return { success: false, error: 'No project' };
                }

                console.log('📧 Sending email to:', task.assignee.email);

                await sendEmail({
                    to: task.assignee.email,
                    subject: `New Task Assignment in ${task.project.name}`,
                    body: `<div style="max-width: 600px;">
                        <h2>Hi ${task.assignee.name || 'there'}, 👋</h2>

                        <p style="font-size: 16px;">You've been assigned a new task:</p>
                        <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">
                            ${task.title}
                        </p>

                        <div style="border: 1px solid #ddd; padding: 12px 16px; border-radius: 6px; margin-bottom: 30px;">
                            <p style="margin: 6px 0;"><strong>Description:</strong> ${task.description || 'No description'}</p>
                            <p style="margin: 6px 0;"><strong>Due Date:</strong> ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
                        </div>

                        <a href="${origin || '#'}" style="background-color: #007bff; padding: 12px 24px; border-radius: 5px; color: #fff; font-weight: 600; font-size: 16px; text-decoration: none;">
                            View Task
                        </a>

                        <p style="margin-top: 20px; font-size: 14px; color: #6c757d;">
                            Please make sure to review and complete it before the due date.
                        </p>
                    </div>`
                });

                console.log('✅ Task assignment email sent successfully');
                return { success: true, taskId: task.id };

            } catch (error) {
                console.error('❌ Error in task assignment email function:', error);
                return { success: false, error: error.message };
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
  sendTaskAssignmentEmail
];