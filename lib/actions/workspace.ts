'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendWorkspaceEmail } from '@/lib/email';

// ============================================
// Email Actions
// ============================================

export interface SendEmailInput {
  toEmail: string;
  toName?: string;
  subject: string;
  body: string;
  companyId?: number;
  templateId?: string;
}

export async function sendWorkspaceEmailAction(input: SendEmailInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Create email record first (as draft/pending)
    const email = await prisma.workspaceEmail.create({
      data: {
        userId: session.user.id,
        toEmail: input.toEmail,
        toName: input.toName,
        subject: input.subject,
        body: input.body,
        companyId: input.companyId,
        templateId: input.templateId,
        status: 'draft',
      },
    });

    // Send the email via email service
    const result = await sendWorkspaceEmail({
      to: input.toEmail,
      subject: input.subject,
      body: input.body,
    });

    // Update email record with result
    await prisma.workspaceEmail.update({
      where: { id: email.id },
      data: {
        status: result.success ? 'sent' : 'failed',
        sentAt: result.success ? new Date() : null,
        messageId: result.messageId,
        failureReason: result.error,
        provider: process.env.RESEND_API_KEY ? 'resend' : 'nodemailer',
      },
    });

    revalidatePath('/workspace/emails');
    revalidatePath('/workspace');

    if (!result.success) {
      return { success: false, error: result.error || 'Failed to send email' };
    }

    return { success: true, emailId: email.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function getWorkspaceEmailsAction(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const emails = await prisma.workspaceEmail.findMany({
      where: {
        userId: session.user.id,
        ...(params?.status && { status: params.status }),
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit || 50,
      skip: params?.offset || 0,
    });

    return emails;
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    return [];
  }
}

// ============================================
// Email Template Actions
// ============================================

export async function getEmailTemplatesAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const templates = await prisma.emailTemplate.findMany({
      where: {
        OR: [
          { isSystem: true },
          { userId: session.user.id },
        ],
      },
      orderBy: { name: 'asc' },
    });

    return templates;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return [];
  }
}

export interface CreateTemplateInput {
  name: string;
  subject: string;
  body: string;
  type: string;
}

export async function createEmailTemplateAction(input: CreateTemplateInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const template = await prisma.emailTemplate.create({
      data: {
        name: input.name,
        subject: input.subject,
        body: input.body,
        type: input.type,
        userId: session.user.id,
        isSystem: false,
      },
    });

    revalidatePath('/workspace/emails');

    return { success: true, templateId: template.id };
  } catch (error) {
    console.error('Failed to create template:', error);
    return { success: false, error: 'Failed to create template' };
  }
}

export async function deleteEmailTemplateAction(templateId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Only delete user's own templates, not system templates
    await prisma.emailTemplate.deleteMany({
      where: {
        id: templateId,
        userId: session.user.id,
        isSystem: false,
      },
    });

    revalidatePath('/workspace/emails');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete template:', error);
    return { success: false, error: 'Failed to delete template' };
  }
}

// ============================================
// Call Actions
// ============================================

export interface InitiateCallInput {
  toNumber: string;
  toName?: string;
  companyId?: number;
}

export async function initiateCallAction(input: InitiateCallInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Get user's VoIP settings
    const voipSettings = await prisma.voipSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!voipSettings?.twilioPhoneNumber) {
      return { success: false, error: 'VoIP not configured. Please set up your Twilio phone number.' };
    }

    // Create call record
    const call = await prisma.workspaceCall.create({
      data: {
        userId: session.user.id,
        toNumber: input.toNumber,
        toName: input.toName,
        companyId: input.companyId,
        fromNumber: voipSettings.twilioPhoneNumber,
        status: 'initiated',
        direction: 'outbound',
        startedAt: new Date(),
      },
    });

    // TODO: Integrate with Twilio to actually make the call
    // const twilioCall = await twilioService.makeCall({
    //   to: input.toNumber,
    //   from: voipSettings.twilioPhoneNumber,
    //   callbackUrl: process.env.TWILIO_CALLBACK_URL,
    // });
    //
    // Update call record with twilioCallSid
    // await prisma.workspaceCall.update({
    //   where: { id: call.id },
    //   data: { twilioCallSid: twilioCall.sid }
    // });

    revalidatePath('/workspace/calls');
    revalidatePath('/workspace');

    return { success: true, callId: call.id };
  } catch (error) {
    console.error('Failed to initiate call:', error);
    return { success: false, error: 'Failed to initiate call' };
  }
}

export async function getWorkspaceCallsAction(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const calls = await prisma.workspaceCall.findMany({
      where: {
        userId: session.user.id,
        ...(params?.status && { status: params.status }),
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit || 50,
      skip: params?.offset || 0,
    });

    return calls;
  } catch (error) {
    console.error('Failed to fetch calls:', error);
    return [];
  }
}

export async function updateCallNotesAction(callId: string, notes: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.workspaceCall.updateMany({
      where: {
        id: callId,
        userId: session.user.id,
      },
      data: { notes },
    });

    revalidatePath('/workspace/calls');

    return { success: true };
  } catch (error) {
    console.error('Failed to update call notes:', error);
    return { success: false, error: 'Failed to update notes' };
  }
}

// ============================================
// VoIP Settings Actions
// ============================================

export async function getVoipSettingsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const settings = await prisma.voipSettings.findUnique({
      where: { userId: session.user.id },
    });

    return settings;
  } catch (error) {
    console.error('Failed to fetch VoIP settings:', error);
    return null;
  }
}

export async function updateVoipSettingsAction(data: {
  callRecording?: boolean;
  voicemailEnabled?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.voipSettings.upsert({
      where: { userId: session.user.id },
      update: data,
      create: {
        userId: session.user.id,
        ...data,
      },
    });

    revalidatePath('/workspace/settings');

    return { success: true };
  } catch (error) {
    console.error('Failed to update VoIP settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

// ============================================
// Activity & Stats Actions
// ============================================

export async function getWorkspaceStatsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const now = new Date();

    // Start of today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of month
    const startOfMonth = new Date(now);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      emailsToday,
      emailsThisWeek,
      emailsThisMonth,
      callsToday,
      callsThisWeek,
      callsThisMonth,
      savedCompanies,
      totalCallDuration,
      recentEmails,
      recentCalls,
    ] = await Promise.all([
      prisma.workspaceEmail.count({
        where: { userId: session.user.id, createdAt: { gte: startOfToday } },
      }),
      prisma.workspaceEmail.count({
        where: { userId: session.user.id, createdAt: { gte: startOfWeek } },
      }),
      prisma.workspaceEmail.count({
        where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
      }),
      prisma.workspaceCall.count({
        where: { userId: session.user.id, createdAt: { gte: startOfToday } },
      }),
      prisma.workspaceCall.count({
        where: { userId: session.user.id, createdAt: { gte: startOfWeek } },
      }),
      prisma.workspaceCall.count({
        where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
      }),
      prisma.savedCompany.count({
        where: { userId: session.user.id },
      }),
      prisma.workspaceCall.aggregate({
        where: { userId: session.user.id },
        _sum: { duration: true },
      }),
      // Get most contacted via email (top 5)
      prisma.workspaceEmail.groupBy({
        by: ['toEmail', 'toName'],
        where: { userId: session.user.id },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      // Get most called (top 5)
      prisma.workspaceCall.groupBy({
        by: ['toNumber', 'toName'],
        where: { userId: session.user.id },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      emails: {
        today: emailsToday,
        thisWeek: emailsThisWeek,
        thisMonth: emailsThisMonth,
      },
      calls: {
        today: callsToday,
        thisWeek: callsThisWeek,
        thisMonth: callsThisMonth,
      },
      savedCompanies,
      totalCallDuration: totalCallDuration._sum.duration || 0,
      topEmailContacts: recentEmails.map(e => ({
        email: e.toEmail,
        name: e.toName,
        count: e._count.id,
      })),
      topCallContacts: recentCalls.map(c => ({
        number: c.toNumber,
        name: c.toName,
        count: c._count.id,
      })),
    };
  } catch (error) {
    console.error('Failed to fetch workspace stats:', error);
    return null;
  }
}

export async function getWorkspaceActivityAction(params?: {
  type?: 'email' | 'call' | 'all';
  limit?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  try {
    const limit = params?.limit || 20;
    const type = params?.type || 'all';

    const [emails, calls] = await Promise.all([
      type === 'call' ? [] : prisma.workspaceEmail.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          toEmail: true,
          toName: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
      type === 'email' ? [] : prisma.workspaceCall.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          toNumber: true,
          toName: true,
          status: true,
          duration: true,
          createdAt: true,
        },
      }),
    ]);

    // Combine and sort by date
    const activities = [
      ...emails.map(e => ({ ...e, type: 'email' as const })),
      ...calls.map(c => ({ ...c, type: 'call' as const })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
     .slice(0, limit);

    return activities;
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    return [];
  }
}
