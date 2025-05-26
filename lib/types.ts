export interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  bio: string | null
  skills: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Hackathon {
  id: string
  title: string
  description: string
  theme: string
  startDate: Date
  endDate: Date
  registrationDeadline: Date
  maxTeamSize: number
  prizes: string[]
  tags: string[]
  organizerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  description: string
  hackathonId: string
  leaderId: string
  inviteCode: string
  createdAt: Date
  updatedAt: Date
  members: TeamMember[]
  hackathon: Hackathon
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: "LEADER" | "MEMBER"
  joinedAt: Date
  user: User
}

export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  teamId: string
  createdAt: Date
  updatedAt: Date
  team: Team
}

export interface Notification {
  id: string
  userId: string
  type: "TEAM_INVITE" | "JOIN_REQUEST" | "DEADLINE_REMINDER"
  title: string
  message: string
  read: boolean
  createdAt: Date
}
