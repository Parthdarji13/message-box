'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useCompletion } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SendMessage() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { username } = useParams<{ username: string }>();

  // useCompletion hook to handle AI suggestions
  const { complete, completion, isLoading: isSuggestLoading } = useCompletion({
    api: '/api/suggest-messages',
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/send-message', { username, content });
      toast.success(response.data.message);
      setContent('');
    } catch (error: any) {
      toast.error(error.response?.data.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle clicking on a suggested message
  const handleMessageClick = (message: string) => {
    setContent(message);
  };

  // Helper to parse the pipe-separated string from OpenAI
  const parseMessages = (messageString: string) => {
    return messageString.split('|').filter((msg) => msg.trim() !== "");
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
      <form onSubmit={handleSendMessage} className="space-y-4">
        <label className="block text-sm font-medium">Send Anonymous Message to @{username}</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your anonymous message here"
          className="w-full p-2 border rounded"
          rows={4}
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={isLoading || !content}>
            {isLoading ? 'Sending...' : 'Send It'}
          </Button>
        </div>
      </form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={() => complete('')} // Trigger OpenAI suggestion
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader><h3 className="text-xl font-semibold">Messages</h3></CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {parseMessages(completion || "What's your favorite movie?|Do you have any pets?|What's your dream job?").map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Button onClick={() => window.location.href = '/sign-up'}>Create Your Account</Button>
      </div>
    </div>
  );
}