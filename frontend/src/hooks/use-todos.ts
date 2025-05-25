import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Todo, InsertTodo, UpdateTodo } from "@shared/schema";

export function useTodos() {
  const todos = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
  });

  const createTodo = useMutation({
    mutationFn: async (data: InsertTodo) => {
      const response = await apiRequest("POST", "/api/todos", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: UpdateTodo }) => {
      const response = await apiRequest("PUT", `/api/todos/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  return {
    todos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}
