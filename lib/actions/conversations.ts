'use server';

import { prisma } from '../db';
import { auth } from '../auth';
import { revalidatePath } from 'next/cache';

// ============================================
// Types
// ============================================

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ConversationItem {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
}

export interface ConversationWithMessages {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: ConversationMessage[];
}

// ============================================
// Conversation CRUD Functions
// ============================================

/**
 * Get all conversations for the current user
 */
export async function getConversationsAction(limit: number = 50): Promise<ConversationItem[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  try {
    // Check if the Conversation model exists in Prisma client (migration might not be run yet)
    if (!prisma.conversation) {
      return [];
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true },
        },
        _count: {
          select: { messages: true },
        },
      },
    });

    return conversations.map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      messageCount: c._count.messages,
      lastMessage: c.messages[0]?.content?.substring(0, 100),
    }));
  } catch (error) {
    // Handle case where Conversation table doesn't exist yet (migration not run)
    console.error('Failed to fetch conversations:', error);
    return [];
  }
}

/**
 * Get a single conversation with all messages
 */
export async function getConversationAction(
  conversationId: string
): Promise<ConversationWithMessages | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    // Check if the Conversation model exists in Prisma client
    if (!prisma.conversation) {
      return null;
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      return null;
    }

    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    return null;
  }
}

/**
 * Create a new conversation
 */
export async function createConversationAction(
  firstMessage?: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Generate title from first message (first 50 chars)
    const title = firstMessage
      ? firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '')
      : null;

    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        title,
      },
    });

    revalidatePath('/knowledge');

    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error('Create conversation error:', error);
    return { success: false, error: 'Failed to create conversation' };
  }
}

/**
 * Add a message to a conversation
 */
export async function addMessageAction(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if the Conversation model exists in Prisma client
    if (!prisma.conversation) {
      return { success: false, error: 'Database not ready' };
    }

    // Verify conversation ownership
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      return { success: false, error: 'Conversation not found' };
    }

    // Create message and update conversation timestamp
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          role,
          content,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    // Update title if this is the first user message and no title exists
    if (role === 'user' && !conversation.title) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        },
      });
    }

    return { success: true, messageId: message.id };
  } catch (error) {
    console.error('Add message error:', error);
    return { success: false, error: 'Failed to add message' };
  }
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversationAction(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      return { success: false, error: 'Not authorized' };
    }

    // Delete conversation (messages cascade)
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    revalidatePath('/knowledge');

    return { success: true };
  } catch (error) {
    console.error('Delete conversation error:', error);
    return { success: false, error: 'Failed to delete conversation' };
  }
}

/**
 * Update conversation title
 */
export async function updateConversationTitleAction(
  conversationId: string,
  title: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== session.user.id) {
      return { success: false, error: 'Not authorized' };
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });

    revalidatePath('/knowledge');

    return { success: true };
  } catch (error) {
    console.error('Update conversation title error:', error);
    return { success: false, error: 'Failed to update title' };
  }
}

/**
 * Clear all conversations for the current user
 */
export async function clearAllConversationsAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    await prisma.conversation.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath('/knowledge');

    return { success: true };
  } catch (error) {
    console.error('Clear conversations error:', error);
    return { success: false, error: 'Failed to clear conversations' };
  }
}

/**
 * Create conversation and add first message pair in one action
 * Used when starting a new chat
 */
export async function startConversationAction(
  userMessage: string,
  assistantMessage: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if the Conversation model exists in Prisma client
    if (!prisma.conversation) {
      return { success: false, error: 'Database not ready - please run prisma migrate' };
    }

    // Create conversation with messages in a transaction
    const conversation = await prisma.conversation.create({
      data: {
        userId: session.user.id,
        title: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
        messages: {
          create: [
            { role: 'user', content: userMessage },
            { role: 'assistant', content: assistantMessage },
          ],
        },
      },
    });

    revalidatePath('/knowledge');

    return { success: true, conversationId: conversation.id };
  } catch (error) {
    console.error('Start conversation error:', error);
    return { success: false, error: 'Failed to start conversation' };
  }
}
