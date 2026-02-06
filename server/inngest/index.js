// lib/inngest/functions.js
import { Inngest } from "inngest";
import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma (prevents connection exhaustion in serverless)
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Create Inngest client
export const inngest = new Inngest({ 
  id: "project-management",
  eventKey: process.env.INNGEST_EVENT_KEY // Add this if you have one
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

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation
];