import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
}

export default function SummaryModal({ open, onOpenChange, summary }: SummaryModalProps) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendToSlack = async () => {
    setIsSending(true);
    try {
      await apiRequest("POST", "/api/slack/send-summary", { summary });
      
      toast({
        title: "Success",
        description: "Summary sent to Slack successfully!",
      });
      
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i className="fas fa-robot text-secondary mr-2"></i>
            AI Todo Summary
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-96 p-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-3">Summary of Pending Tasks</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-500">
            <i className="fas fa-clock mr-1"></i>
            Generated just now
          </span>
          <div className="flex space-x-3">
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button 
              onClick={handleSendToSlack}
              disabled={isSending}
              className="bg-green-600 hover:bg-green-700"
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
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
