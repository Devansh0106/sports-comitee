import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertTeamSchema,
  insertTeamMemberSchema,
  insertEventSchema,
  insertEventRegistrationSchema,
  insertMatchSchema,
  insertResultSchema,
  insertAnnouncementSchema,
} from "../shared/schema";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // ── Users ────────────────────────────────────────────────────────────────
  app.get("/api/users", async (_req, res) => {
    try {
      const data = await storage.getUsers();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const user = await storage.createUser(parsed.data);
      res.status(201).json(user);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const ok = await storage.deleteUser(req.params.id);
      if (!ok) return res.status(404).json({ message: "User not found" });
      res.json({ message: "Deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ── Teams ────────────────────────────────────────────────────────────────
  app.get("/api/teams", async (_req, res) => {
    try {
      res.json(await storage.getTeams());
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeamById(req.params.id);
      if (!team) return res.status(404).json({ message: "Team not found" });
      res.json(team);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/teams/:id/members", async (req, res) => {
    try {
      res.json(await storage.getTeamMembers(req.params.id));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const parsed = insertTeamSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const team = await storage.createTeam(parsed.data);
      res.status(201).json(team);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.updateTeam(req.params.id, req.body);
      if (!team) return res.status(404).json({ message: "Team not found" });
      res.json(team);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    try {
      const ok = await storage.deleteTeam(req.params.id);
      if (!ok) return res.status(404).json({ message: "Team not found" });
      res.json({ message: "Deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/teams/:id/members", async (req, res) => {
    try {
      const parsed = insertTeamMemberSchema.safeParse({ ...req.body, teamId: req.params.id });
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const member = await storage.addTeamMember(parsed.data);
      res.status(201).json(member);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/teams/:teamId/members/:userId", async (req, res) => {
    try {
      const ok = await storage.removeTeamMember(req.params.teamId, req.params.userId);
      if (!ok) return res.status(404).json({ message: "Member not found" });
      res.json({ message: "Removed successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ── Events ───────────────────────────────────────────────────────────────
  app.get("/api/events", async (_req, res) => {
    try {
      res.json(await storage.getEvents());
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/events/upcoming", async (_req, res) => {
    try {
      res.json(await storage.getUpcomingEvents());
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/events/:id/registrations", async (req, res) => {
    try {
      res.json(await storage.getEventRegistrations(req.params.id));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/events/:id/matches", async (req, res) => {
    try {
      res.json(await storage.getMatchesByEvent(req.params.id));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const parsed = insertEventSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const event = await storage.createEvent(parsed.data);
      res.status(201).json(event);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(req.params.id, req.body);
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const ok = await storage.deleteEvent(req.params.id);
      if (!ok) return res.status(404).json({ message: "Event not found" });
      res.json({ message: "Deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ── Event Registrations ───────────────────────────────────────────────────
  app.post("/api/registrations", async (req, res) => {
    try {
      const parsed = insertEventRegistrationSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const reg = await storage.registerTeamForEvent(parsed.data);
      res.status(201).json(reg);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/registrations/:id/approve", async (req, res) => {
    try {
      const reg = await storage.approveRegistration(req.params.id);
      if (!reg) return res.status(404).json({ message: "Registration not found" });
      res.json(reg);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/registrations/:eventId/:teamId", async (req, res) => {
    try {
      const ok = await storage.removeRegistration(req.params.eventId, req.params.teamId);
      if (!ok) return res.status(404).json({ message: "Registration not found" });
      res.json({ message: "Removed successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ── Matches ───────────────────────────────────────────────────────────────
  app.post("/api/matches", async (req, res) => {
    try {
      const parsed = insertMatchSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const match = await storage.createMatch(parsed.data);
      res.status(201).json(match);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.updateMatch(req.params.id, req.body);
      if (!match) return res.status(404).json({ message: "Match not found" });
      res.json(match);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/matches/:id", async (req, res) => {
    try {
      const ok = await storage.deleteMatch(req.params.id);
      if (!ok) return res.status(404).json({ message: "Match not found" });
      res.json({ message: "Deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ── Results ───────────────────────────────────────────────────────────────
  app.get("/api/results/event/:eventId", async (req, res) => {
    try {
      res.json(await storage.getResultsByEvent(req.params.eventId));
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/results", async (req, res) => {
    try {
      const parsed = insertResultSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const result = await storage.createResult(parsed.data);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/results/:id", async (req, res) => {
    try {
      const result = await storage.updateResult(req.params.id, req.body);
      if (!result) return res.status(404).json({ message: "Result not found" });
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // ── Announcements ─────────────────────────────────────────────────────────
  app.get("/api/announcements", async (_req, res) => {
    try {
      res.json(await storage.getAnnouncements());
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get("/api/announcements/:id", async (req, res) => {
    try {
      const ann = await storage.getAnnouncementById(req.params.id);
      if (!ann) return res.status(404).json({ message: "Announcement not found" });
      res.json(ann);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const parsed = insertAnnouncementSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
      const ann = await storage.createAnnouncement(parsed.data);
      res.status(201).json(ann);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.put("/api/announcements/:id", async (req, res) => {
    try {
      const ann = await storage.updateAnnouncement(req.params.id, req.body);
      if (!ann) return res.status(404).json({ message: "Announcement not found" });
      res.json(ann);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      const ok = await storage.deleteAnnouncement(req.params.id);
      if (!ok) return res.status(404).json({ message: "Announcement not found" });
      res.json({ message: "Deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  return httpServer;
}
