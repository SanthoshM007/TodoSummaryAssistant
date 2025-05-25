import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Todo } from "@shared/schema";

export async function generateTodoSummary(todos: Todo[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is required to generate summaries. Please add your GEMINI_API_KEY to the environment variables.");
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const todoText = todos.map(todo => {
      const dueInfo = todo.dueDate ? ` (Due: ${new Date(todo.dueDate).toLocaleDateString()})` : '';
      return `- [${todo.priority.toUpperCase()}] ${todo.title}${dueInfo}${todo.description ? `: ${todo.description}` : ''}`;
    }).join('\n');

    const prompt = `Please analyze the following pending todo items and provide a concise, actionable summary. Focus on priorities, deadlines, and recommendations for task completion order:

${todoText}

Provide a well-structured summary that includes:
1. High priority items that need immediate attention
2. Medium priority tasks for this week
3. Low priority items that can be done when time permits
4. Overall recommendations for task prioritization

Keep the summary professional and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Unable to generate summary.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI summary");
  }
}
