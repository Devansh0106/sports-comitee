import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const sportEnum = pgEnum("sport", [
  "cricket", "football", "basketball", "volleyball", "badminton",
  "tennis", "athletics", "swimming", "chess", "table_tennis", "other"
]);

export const eventStatusEnum = pgEnum("event_status", [
  "upcoming", "ongoing", "completed", "cancelled"
]);

export const tournamentFormatEnum = pgEnum("tournament_format", [
  "knockout", "round_robin", "league", "mixed"
]);

export const announcementPriorityEnum = pgEnum("announcement_priority", [
  "low", "medium", "high", "urgent"
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  rollNumber: text("roll_number").notNull().unique(),
  department: text("department").notNull(),
  year: integer("year").notNull(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sport: sportEnum("sport").notNull(),
  captainId: varchar("captain_id").references(() => users.id),
  coachName: text("coach_name"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").references(() => teams.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: text("role").default("player"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sport: sportEnum("sport").notNull(),
  description: text("description"),
  venue: text("venue").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  status: eventStatusEnum("status").default("upcoming"),
  format: tournamentFormatEnum("format").default("knockout"),
  maxTeams: integer("max_teams"),
  organizerId: varchar("organizer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  teamId: varchar("team_id").references(() => teams.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  isApproved: boolean("is_approved").default(false),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  team1Id: varchar("team1_id").references(() => teams.id).notNull(),
  team2Id: varchar("team2_id").references(() => teams.id).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  venue: text("venue"),
  round: text("round"),
  team1Score: integer("team1_score"),
  team2Score: integer("team2_score"),
  winnerId: varchar("winner_id").references(() => teams.id),
  isCompleted: boolean("is_completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const results = pgTable("results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").references(() => events.id).notNull(),
  teamId: varchar("team_id").references(() => teams.id).notNull(),
  position: integer("position").notNull(),
  points: integer("points").default(0),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  draws: integer("draws").default(0),
  goalsFor: integer("goals_for").default(0),
  goalsAgainst: integer("goals_against").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: announcementPriorityEnum("priority").default("medium"),
  sport: sportEnum("sport"),
  eventId: varchar("event_id").references(() => events.id),
  authorId: varchar("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, joinedAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({ id: true, registeredAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true });
export const insertResultSchema = createInsertSchema(results).omit({ id: true, createdAt: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
