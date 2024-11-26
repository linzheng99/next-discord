'use client';

import '@livekit/components-styles';

import { useUser } from '@clerk/nextjs';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export default function MediaRoom({
  chatId,
  video,
  audio,
}: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!user) return;
    const { firstName, lastName, username, emailAddresses } = user

    const name = firstName && lastName ? `${firstName} ${lastName}` : username || emailAddresses?.[0]?.emailAddress || '';

    void (async () => {
      try {
        const response = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await response.json();
        setToken(data.token as string);
      } catch (error) {
        console.log(error);
      }
    })()
  }, [user?.firstName, user?.lastName, chatId]);

  if(!token) {
    return (
      <div className="flex flex-col items-center justify-center h-full flex-1">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }


  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      token={token}
      audio={audio}
      video={video}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
