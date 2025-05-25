import { useState } from "react";
import TodoForm from "@/components/todo-form";
import AiActions from "@/components/ai-actions";
import TodoList from "@/components/todo-list";
import SummaryModal from "@/components/summary-modal";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ListTodo } from "lucide-react";

export default function Home() {
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [currentSummary, setCurrentSummary] = useState("");

  const handleSummaryGenerated = (summary: string) => {
    setCurrentSummary(summary);
    setSummaryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/* Main icon circle */}
                <div className="bg-gradient-to-br from-primary to-purple-600 rounded-xl p-3 shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <div className="relative">
                    <ListTodo className="h-6 w-6 text-white" />
                    <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-transparent bg-clip-text">
                  Todo Summary Assistant
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="h-1 w-1 rounded-full bg-primary"></div>
                  <div className="h-1 w-1 rounded-full bg-purple-600"></div>
                  <div className="h-1 w-1 rounded-full bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TodoForm />
            <AiActions 
              onSummaryGenerated={handleSummaryGenerated}
              hasSummary={!!currentSummary}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <TodoList />
          </div>
        </div>
      </main>

      <SummaryModal
        open={summaryModalOpen}
        onOpenChange={setSummaryModalOpen}
        summary={currentSummary}
      />
    </div>
  );
}
