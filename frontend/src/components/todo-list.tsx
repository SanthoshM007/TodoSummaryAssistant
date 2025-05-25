import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useTodos } from "@/hooks/use-todos";
import { useToast } from "@/hooks/use-toast";
import EditTodoDialog from "@/components/edit-todo-dialog";
import type { Todo } from "@shared/schema";

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200", 
  low: "bg-gray-100 text-gray-600 border-gray-200"
};

const priorityBadgeColors = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-600"
};

export default function TodoList() {
  const { todos, updateTodo, deleteTodo } = useTodos();
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "high">("all");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredTodos = todos.data?.filter(todo => {
    switch (filter) {
      case "pending":
        return !todo.completed;
      case "completed":
        return todo.completed;
      case "high":
        return todo.priority === "high" && !todo.completed;
      default:
        return true;
    }
  }) || [];

  const pendingCount = todos.data?.filter(todo => !todo.completed).length || 0;
  const completedCount = todos.data?.filter(todo => todo.completed).length || 0;

  const handleToggleComplete = async (todo: Todo) => {
    try {
      await updateTodo.mutateAsync({
        id: todo.id,
        updates: { completed: !todo.completed }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo status.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo.mutateAsync(id);
      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo.",
        variant: "destructive",
      });
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return `Due ${date.toLocaleDateString()}`;
  };

  if (todos.isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            <i className="fas fa-list-ul text-primary mr-2"></i>
            Your Todos
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{pendingCount}</span>
              <span>pending</span>
              <span className="text-gray-300">•</span>
              <span>{completedCount}</span>
              <span>completed</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
          <Button
            size="sm"
            variant={filter === "high" ? "default" : "outline"}
            onClick={() => setFilter("high")}
          >
            High Priority
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-tasks text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first todo item</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTodos.map((todo) => (
              <div 
                key={todo.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  todo.priority === "high" && !todo.completed ? priorityColors.high :
                  todo.completed ? "bg-gray-50 opacity-75" : "border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium text-gray-900 ${todo.completed ? 'line-through' : ''}`}>
                        {todo.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={priorityBadgeColors[todo.priority as keyof typeof priorityBadgeColors]}>
                          {todo.priority === "high" && !todo.completed ? "High" : 
                           todo.priority === "medium" ? "Medium" : 
                           todo.priority === "low" ? "Low" : ""}
                        </Badge>
                        {todo.dueDate && !todo.completed && (
                          <Badge variant="outline" className={
                            new Date(todo.dueDate).getTime() <= new Date().getTime() 
                              ? "bg-red-100 text-red-700" 
                              : "bg-blue-100 text-blue-700"
                          }>
                            <i className="fas fa-clock mr-1"></i>
                            {formatDueDate(todo.dueDate)}
                          </Badge>
                        )}
                        {todo.completed && (
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            <i className="fas fa-check mr-1"></i>
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    {todo.description && (
                      <p className={`mt-1 text-sm text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {todo.completed 
                          ? `Completed ${new Date(todo.updatedAt).toLocaleString()}`
                          : `Created ${new Date(todo.createdAt).toLocaleString()}`
                        }
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-blue-800 p-2 bg-[#1a00f7]"
                          onClick={() => handleEdit(todo)}
                          disabled={updateTodo.isPending}
                          title="Edit"
                        >
                          <i className="fas fa-edit text-base font-bold"></i>Edit Todo</Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-red-800 p-2 bg-[#ff0000]"
                          onClick={() => handleDelete(todo.id)}
                          disabled={deleteTodo.isPending}
                          title="Delete"
                        >
                          <i className="fas fa-trash text-base font-bold"></i>Delete Todo</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <EditTodoDialog 
        todo={editingTodo}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </Card>
  );
}
