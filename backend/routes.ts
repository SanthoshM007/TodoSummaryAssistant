import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTodoSchema, updateTodoSchema } from "@shared/schema";
import { generateTodoSummary } from "./lib/gemini";
import { sendSlackMessage } from "./lib/slack";

export async function registerRoutes(app: Express): Promise<Server> {
  // Todo CRUD endpoints
  app.get("/api/todos", async (req, res) => {
    try {
      const todos = await storage.getTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  app.post("/api/todos", async (req, res) => {
    try {
      const validatedData = insertTodoSchema.parse(req.body);
      const todo = await storage.createTodo(validatedData);
      res.status(201).json(todo);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Invalid todo data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create todo" });
      }
    }
  });

  app.put("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateTodoSchema.parse(req.body);
      const todo = await storage.updateTodo(id, validatedData);
      
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      res.json(todo);
    } catch (error) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Invalid todo data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update todo" });
      }
    }
  });

  app.delete("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTodo(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Todo not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete todo" });
    }
  });

  // AI Summary endpoint
  app.post("/api/todos/summarize", async (req, res) => {
    try {
      const todos = await storage.getTodos();
      const pendingTodos = todos.filter(todo => !todo.completed);
      
      if (pendingTodos.length === 0) {
        return res.json({ summary: "No pending todos to summarize." });
      }

      const summary = await generateTodoSummary(pendingTodos);
      res.json({ summary });
    } catch (error) {
      console.error("Failed to generate summary:", error);
      res.status(500).json({ message: "Failed to generate AI summary. Please check your Gemini API key and try again." });
    }
  });

  // Slack integration endpoint
  app.post("/api/slack/send-summary", async (req, res) => {
    try {
      const { summary } = req.body;
      
      if (!summary) {
        return res.status(400).json({ message: "Summary is required" });
      }

      await sendSlackMessage({
        channel: process.env.SLACK_CHANNEL_ID || "#general",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*📋 Todo Summary Assistant*"
            }
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: summary
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `Generated on ${new Date().toLocaleString()}`
              }
            ]
          }
        ]
      });

      res.json({ message: "Summary sent to Slack successfully" });
    } catch (error) {
      console.error("Failed to send to Slack:", error);
      res.status(500).json({ message: "Failed to send summary to Slack. Please check your Slack configuration and try again." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
