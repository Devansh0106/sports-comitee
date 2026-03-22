import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  users, teams, teamMembers, events, eventRegistrations, matches, results, announcements,
  type User, type InsertUser,
  type Team, type InsertTeam,
  type TeamMember, type InsertTeamMember,
  type Event, type InsertEvent,
  type EventRegistration, type InsertEventRegistration,
  type Match, type InsertMatch,
  type Result, type InsertResult,
  type Announcement, type InsertAnnouncement,
} from "../shared/schema";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(data: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeamById(id: string): Promise<Team | undefined>;
  getTeamsBySport(sport: string): Promise<Team[]>;
  createTeam(data: InsertTeam): Promise<Team>;
  updateTeam(id: string, data: Partial<InsertTeam>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;

  // Team Members
  getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]>;
  addTeamMember(data: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: string, userId: string): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(data: InsertEvent): Promise<Event>;
  updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Event Registrations
  getEventRegistrations(eventId: string): Promise<(EventRegistration & { team: Team })[]>;
  registerTeamForEvent(data: InsertEventRegistration): Promise<EventRegistration>;
  approveRegistration(id: string): Promise<EventRegistration | undefined>;
  removeRegistration(eventId: string, teamId: string): Promise<boolean>;

  // Matches
  getMatchesByEvent(eventId: string): Promise<Match[]>;
  createMatch(data: InsertMatch): Promise<Match>;
  updateMatch(id: string, data: Partial<InsertMatch>): Promise<Match | undefined>;
  deleteMatch(id: string): Promise<boolean>;

  // Results
  getResultsByEvent(eventId: string): Promise<(Result & { team: Team })[]>;
  createResult(data: InsertResult): Promise<Result>;
  updateResult(id: string, data: Partial<InsertResult>): Promise<Result | undefined>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementById(id: string): Promise<Announcement | undefined>;
  createAnnouncement(data: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ── Users ──────────────────────────────────────────────────────────────────
  async getUsers() {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(data: InsertUser) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>) {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: string) {
    const res = await db.delete(users).where(eq(users.id, id)).returning();
    return res.length > 0;
  }

  // ── Teams ──────────────────────────────────────────────────────────────────
  async getTeams() {
    return db.select().from(teams).orderBy(teams.name);
  }

  async getTeamById(id: string) {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async getTeamsBySport(sport: string) {
    return db.select().from(teams).where(eq(teams.sport, sport as any));
  }

  async createTeam(data: InsertTeam) {
    const [team] = await db.insert(teams).values(data).returning();
    return team;
  }

  async updateTeam(id: string, data: Partial<InsertTeam>) {
    const [team] = await db.update(teams).set(data).where(eq(teams.id, id)).returning();
    return team;
  }

  async deleteTeam(id: string) {
    const res = await db.delete(teams).where(eq(teams.id, id)).returning();
    return res.length > 0;
  }

  // ── Team Members ───────────────────────────────────────────────────────────
  async getTeamMembers(teamId: string) {
    const rows = await db
      .select()
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, teamId));
    return rows.map(r => ({ ...r.team_members, user: r.users }));
  }

  async addTeamMember(data: InsertTeamMember) {
    const [member] = await db.insert(teamMembers).values(data).returning();
    return member;
  }

  async removeTeamMember(teamId: string, userId: string) {
    const res = await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)))
      .returning();
    return res.length > 0;
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  async getEvents() {
    return db.select().from(events).orderBy(desc(events.startDate));
  }

  async getEventById(id: string) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getUpcomingEvents() {
    return db.select().from(events).where(eq(events.status, "upcoming")).orderBy(events.startDate);
  }

  async createEvent(data: InsertEvent) {
    const [event] = await db.insert(events).values(data).returning();
    return event;
  }

  async updateEvent(id: string, data: Partial<InsertEvent>) {
    const [event] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return event;
  }

  async deleteEvent(id: string) {
    const res = await db.delete(events).where(eq(events.id, id)).returning();
    return res.length > 0;
  }

  // ── Event Registrations ────────────────────────────────────────────────────
  async getEventRegistrations(eventId: string) {
    const rows = await db
      .select()
      .from(eventRegistrations)
      .innerJoin(teams, eq(eventRegistrations.teamId, teams.id))
      .where(eq(eventRegistrations.eventId, eventId));
    return rows.map(r => ({ ...r.event_registrations, team: r.teams }));
  }

  async registerTeamForEvent(data: InsertEventRegistration) {
    const [reg] = await db.insert(eventRegistrations).values(data).returning();
    return reg;
  }

  async approveRegistration(id: string) {
    const [reg] = await db
      .update(eventRegistrations)
      .set({ isApproved: true })
      .where(eq(eventRegistrations.id, id))
      .returning();
    return reg;
  }

  async removeRegistration(eventId: string, teamId: string) {
    const res = await db
      .delete(eventRegistrations)
      .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.teamId, teamId)))
      .returning();
    return res.length > 0;
  }

  // ── Matches ────────────────────────────────────────────────────────────────
  async getMatchesByEvent(eventId: string) {
    return db.select().from(matches).where(eq(matches.eventId, eventId)).orderBy(matches.scheduledAt);
  }

  async createMatch(data: InsertMatch) {
    const [match] = await db.insert(matches).values(data).returning();
    return match;
  }

  async updateMatch(id: string, data: Partial<InsertMatch>) {
    const [match] = await db.update(matches).set(data).where(eq(matches.id, id)).returning();
    return match;
  }

  async deleteMatch(id: string) {
    const res = await db.delete(matches).where(eq(matches.id, id)).returning();
    return res.length > 0;
  }

  // ── Results ────────────────────────────────────────────────────────────────
  async getResultsByEvent(eventId: string) {
    const rows = await db
      .select()
      .from(results)
      .innerJoin(teams, eq(results.teamId, teams.id))
      .where(eq(results.eventId, eventId))
      .orderBy(results.position);
    return rows.map(r => ({ ...r.results, team: r.teams }));
  }

  async createResult(data: InsertResult) {
    const [result] = await db.insert(results).values(data).returning();
    return result;
  }

  async updateResult(id: string, data: Partial<InsertResult>) {
    const [result] = await db.update(results).set(data).where(eq(results.id, id)).returning();
    return result;
  }

  // ── Announcements ──────────────────────────────────────────────────────────
  async getAnnouncements() {
    return db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async getAnnouncementById(id: string) {
    const [ann] = await db.select().from(announcements).where(eq(announcements.id, id));
    return ann;
  }

  async createAnnouncement(data: InsertAnnouncement) {
    const [ann] = await db.insert(announcements).values(data).returning();
    return ann;
  }

  async updateAnnouncement(id: string, data: Partial<InsertAnnouncement>) {
    const [ann] = await db.update(announcements).set(data).where(eq(announcements.id, id)).returning();
    return ann;
  }

  async deleteAnnouncement(id: string) {
    const res = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    return res.length > 0;
  }
}

export const storage = new DatabaseStorage();
