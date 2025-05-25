import axios from 'axios';

interface SlackMessage {
  text?: string;
  blocks?: any[];
}

/**
 * Sends a message to Slack using Incoming Webhooks
 * @param message - Message content to send to Slack
 * @returns Promise resolving to the response from Slack
 */
export async function sendSlackMessage(message: SlackMessage): Promise<any> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new Error("Slack Webhook URL is required. Please add your SLACK_WEBHOOK_URL to the environment variables.");
  }

  try {
    const response = await axios.post(process.env.SLACK_WEBHOOK_URL, message);
    return response.data;
  } catch (error) {
    console.error('Error sending Slack message:', error);
    throw error;
  }
}
