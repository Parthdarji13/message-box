'use client'

import React from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/user'; // Your Message interface

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      // In next video, we'll build this backend endpoint
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast({
        title: response.data.message,
      });
      // Update the parent component's state
      const messageId = String(message._id);
      onMessageDelete(messageId);
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">{message.content}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleString()}
          </p>
        </div>
        <Button variant="destructive" size="icon" onClick={handleDeleteConfirm}>
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}