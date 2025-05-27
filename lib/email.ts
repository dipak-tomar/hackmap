import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Email templates
const emailTemplates = {
  teamInvite: (data: {
    teamName: string
    hackathonTitle: string
    inviteCode: string
    inviteUrl: string
    inviterName: string
  }) => ({
    subject: `🚀 You're invited to join team "${data.teamName}"!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">You're Invited to Join a Team!</h1>
        
        <p>Hi there!</p>
        
        <p><strong>${data.inviterName}</strong> has invited you to join their team <strong>"${data.teamName}"</strong> for the hackathon <strong>${data.hackathonTitle}</strong>.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Team Details:</h3>
          <p><strong>Team:</strong> ${data.teamName}</p>
          <p><strong>Hackathon:</strong> ${data.hackathonTitle}</p>
          <p><strong>Invite Code:</strong> <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${data.inviteCode}</code></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.inviteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Team</a>
        </div>
        
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${data.inviteUrl}</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This invitation was sent through HackMap. If you didn't expect this email, you can safely ignore it.
        </p>
      </div>
    `,
  }),

  joinRequest: (data: {
    teamName: string
    hackathonTitle: string
    requesterName: string
    requesterEmail: string
    teamLeaderName: string
    dashboardUrl: string
  }) => ({
    subject: `📝 New join request for team "${data.teamName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Team Join Request</h1>
        
        <p>Hi ${data.teamLeaderName},</p>
        
        <p><strong>${data.requesterName}</strong> (${data.requesterEmail}) wants to join your team <strong>"${data.teamName}"</strong> for ${data.hackathonTitle}.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Request Details:</h3>
          <p><strong>Requester:</strong> ${data.requesterName}</p>
          <p><strong>Email:</strong> ${data.requesterEmail}</p>
          <p><strong>Team:</strong> ${data.teamName}</p>
          <p><strong>Hackathon:</strong> ${data.hackathonTitle}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
        </div>
        
        <p>You can review and respond to this request in your dashboard.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This notification was sent from HackMap. You're receiving this because you're the leader of the team.
        </p>
      </div>
    `,
  }),

  deadlineReminder: (data: {
    userName: string
    hackathonTitle: string
    deadlineType: string
    deadline: string
    daysLeft: number
    actionUrl: string
  }) => ({
    subject: `⏰ Reminder: ${data.deadlineType} deadline approaching for ${data.hackathonTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">⏰ Deadline Reminder</h1>
        
        <p>Hi ${data.userName},</p>
        
        <p>This is a friendly reminder that the <strong>${data.deadlineType}</strong> deadline for <strong>${data.hackathonTitle}</strong> is approaching.</p>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626;">⚠️ Deadline Alert</h3>
          <p><strong>Hackathon:</strong> ${data.hackathonTitle}</p>
          <p><strong>Deadline:</strong> ${data.deadline}</p>
          <p><strong>Time Left:</strong> ${data.daysLeft} day${data.daysLeft !== 1 ? 's' : ''}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.actionUrl}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Take Action</a>
        </div>
        
        <p>Don't miss out! Make sure to complete your ${data.deadlineType.toLowerCase()} before the deadline.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This reminder was sent from HackMap. You can manage your notification preferences in your dashboard.
        </p>
      </div>
    `,
  }),

  teamUpdate: (data: {
    teamName: string
    hackathonTitle: string
    updateType: string
    message: string
    memberName: string
    dashboardUrl: string
  }) => ({
    subject: `🔔 Team update: ${data.updateType} - ${data.teamName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Team Update</h1>
        
        <p>Hi there!</p>
        
        <p>There's been an update to your team <strong>"${data.teamName}"</strong> for ${data.hackathonTitle}.</p>
        
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0369a1;">📢 ${data.updateType}</h3>
          <p>${data.message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Team</a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          This update was sent from HackMap. You're receiving this because you're a member of the team.
        </p>
      </div>
    `,
  }),
}

// Helper function to check user email preferences
async function checkEmailPreferences(email: string, notificationType: string) {
  try {
    // TODO: Implement email preferences checking when database schema is updated
    // For now, always return true to allow emails
    return true
  } catch (error) {
    console.error('Error checking email preferences:', error)
    return true // Default to true on error
  }
}

// Email sending functions
export async function sendTeamInviteEmail(
  recipientEmail: string,
  data: {
    teamName: string
    hackathonTitle: string
    inviteCode: string
    inviterName: string
  }
) {
  try {
    // Check user preferences
    const canSendEmail = await checkEmailPreferences(recipientEmail, 'teamInvites')
    if (!canSendEmail) {
      console.log(`Team invite email skipped for ${recipientEmail} due to user preferences`)
      return { success: true, skipped: true }
    }

    const inviteUrl = `${process.env.NEXTAUTH_URL}/teams/join?code=${data.inviteCode}`
    const template = emailTemplates.teamInvite({ ...data, inviteUrl })

    await transporter.sendMail({
      from: `"HackMap" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    })

    console.log(`Team invite email sent to ${recipientEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending team invite email:', error)
    return { success: false, error }
  }
}

export async function sendJoinRequestEmail(
  teamLeaderEmail: string,
  data: {
    teamName: string
    hackathonTitle: string
    requesterName: string
    requesterEmail: string
    teamLeaderName: string
  }
) {
  try {
    // Check user preferences
    const canSendEmail = await checkEmailPreferences(teamLeaderEmail, 'joinRequests')
    if (!canSendEmail) {
      console.log(`Join request email skipped for ${teamLeaderEmail} due to user preferences`)
      return { success: true, skipped: true }
    }

    const dashboardUrl = `${process.env.NEXTAUTH_URL}/dashboard`
    const template = emailTemplates.joinRequest({ ...data, dashboardUrl })

    await transporter.sendMail({
      from: `"HackMap" <${process.env.SMTP_USER}>`,
      to: teamLeaderEmail,
      subject: template.subject,
      html: template.html,
    })

    console.log(`Join request email sent to ${teamLeaderEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending join request email:', error)
    return { success: false, error }
  }
}

export async function sendDeadlineReminderEmail(
  recipientEmail: string,
  data: {
    userName: string
    hackathonTitle: string
    deadlineType: string
    deadline: string
    daysLeft: number
    hackathonId: string
  }
) {
  try {
    // Check user preferences
    const canSendEmail = await checkEmailPreferences(recipientEmail, 'deadlineReminders')
    if (!canSendEmail) {
      console.log(`Deadline reminder email skipped for ${recipientEmail} due to user preferences`)
      return { success: true, skipped: true }
    }

    const actionUrl = `${process.env.NEXTAUTH_URL}/hackathons/${data.hackathonId}`
    const template = emailTemplates.deadlineReminder({ ...data, actionUrl })

    await transporter.sendMail({
      from: `"HackMap" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    })

    console.log(`Deadline reminder email sent to ${recipientEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending deadline reminder email:', error)
    return { success: false, error }
  }
}

export async function sendTeamUpdateEmail(
  recipientEmail: string,
  data: {
    teamName: string
    hackathonTitle: string
    updateType: string
    message: string
    memberName: string
    teamId: string
  }
) {
  try {
    const dashboardUrl = `${process.env.NEXTAUTH_URL}/teams/${data.teamId}`
    const template = emailTemplates.teamUpdate({ ...data, dashboardUrl })

    await transporter.sendMail({
      from: `"HackMap" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
    })

    console.log(`Team update email sent to ${recipientEmail}`)
    return { success: true }
  } catch (error) {
    console.error('Error sending team update email:', error)
    return { success: false, error }
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    await transporter.verify()
    console.log('Email configuration is valid')
    return { success: true }
  } catch (error) {
    console.error('Email configuration error:', error)
    return { success: false, error }
  }
} 