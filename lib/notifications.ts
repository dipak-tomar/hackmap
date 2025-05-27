import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        read: false,
      },
    })
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

export async function createTeamInviteNotification(
  userId: string,
  teamName: string,
  hackathonTitle: string,
  inviterName: string
) {
  return createNotification(
    userId,
    "TEAM_INVITE",
    "Team Invitation Received",
    `${inviterName} has invited you to join '${teamName}' team for ${hackathonTitle}`
  )
}

export async function createJoinRequestNotification(
  teamLeaderId: string,
  requesterName: string,
  teamName: string,
  hackathonTitle: string
) {
  return createNotification(
    teamLeaderId,
    "JOIN_REQUEST",
    "New Join Request",
    `${requesterName} wants to join your team '${teamName}' for ${hackathonTitle}`
  )
}

export async function createDeadlineReminderNotification(
  userId: string,
  hackathonTitle: string,
  deadlineType: string,
  daysLeft: number
) {
  return createNotification(
    userId,
    "DEADLINE_REMINDER",
    `${deadlineType} Deadline Approaching`,
    `Only ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left for ${deadlineType.toLowerCase()} in ${hackathonTitle}. Don't miss out!`
  )
}

export async function createTeamUpdateNotification(
  userId: string,
  updateType: string,
  teamName: string,
  message: string
) {
  return createNotification(
    userId,
    "TEAM_UPDATE",
    `Team Update: ${updateType}`,
    `${message} - Team: ${teamName}`
  )
}

export async function createProjectCommentNotification(
  projectOwnerId: string,
  commenterName: string,
  projectTitle: string,
  commentPreview: string
) {
  return createNotification(
    projectOwnerId,
    "PROJECT_COMMENT",
    "New Comment on Your Project",
    `${commenterName} commented on your project '${projectTitle}': ${commentPreview.substring(0, 100)}${commentPreview.length > 100 ? '...' : ''}`
  )
}

export async function createProjectEndorsementNotification(
  projectOwnerId: string,
  endorserName: string,
  projectTitle: string
) {
  return createNotification(
    projectOwnerId,
    "PROJECT_ENDORSEMENT",
    "Project Endorsed",
    `Your project '${projectTitle}' received an endorsement from ${endorserName}`
  )
}

// Helper function to get unread notification count for a user
export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    })
    return count
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    return 0
  }
}

// Helper function to mark notifications as read
export async function markNotificationsAsRead(userId: string, notificationIds?: string[]) {
  try {
    const whereClause: any = { userId }
    
    if (notificationIds) {
      whereClause.id = { in: notificationIds }
    } else {
      whereClause.read = false
    }

    const result = await prisma.notification.updateMany({
      where: whereClause,
      data: { read: true },
    })
    
    return result.count
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return 0
  }
} 