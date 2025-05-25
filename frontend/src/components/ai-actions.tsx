import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AiActionsProps {
  onSummaryGenerated: (summary: string) => void;
  hasSummary: boolean;
}

export default function AiActions({ onSummaryGenerated, hasSummary }: AiActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastSummary, setLastSummary] = useState("");
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/todos/summarize");
      const data = await response.json();
      
      setLastSummary(data.summary);
      onSummaryGenerated(data.summary);
      
      toast({
        title: "Success",
        description: "AI summary generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please check your Gemini API key.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToSlack = async () => {
    if (!lastSummary) return;
    
    setIsSending(true);
    try {
      await apiRequest("POST", "/api/slack/send-summary", { summary: lastSummary });
      
      toast({
        title: "Success",
        description: "Summary sent to Slack successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send to Slack. Please check your Slack configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="fas fa-robot text-secondary mr-2"></i>
          AI Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="w-full bg-secondary hover:bg-violet-600"
        >
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Generate AI Summary
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleSendToSlack}
          disabled={!hasSummary || isSending}
          variant={hasSummary ? "default" : "secondary"}
          className="w-full relative"
        >
          {isSending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Sending...
            </>
          ) : (
            <>
              <i className="fab fa-slack mr-2"></i>
              Send to Slack
              {!hasSummary && (
                <span className="ml-2 text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">
                  Generate summary first
                </span>
              )}
            </>
          )}
        </Button>
        
        {!hasSummary && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
            <p className="text-sm text-gray-600">
              <i className="fas fa-info-circle mr-1"></i>
              Generate a summary to enable Slack sharing
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
