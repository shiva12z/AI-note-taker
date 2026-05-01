'use client';

import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      <h1 className="text-3xl font-bold mb-4">Record Meeting</h1>
      <p className="text-muted-foreground mb-12">
        Click the button below to start recording. We'll capture the audio and generate a summary for you.
      </p>

      <div className="flex flex-col items-center justify-center space-y-8">
        <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-4 ${isRecording ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
          {isRecording ? (
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-32 h-32 rounded-full border-4 border-red-200 animate-ping opacity-20" />
               <Square className="h-12 w-12 text-red-500 fill-red-500" />
            </div>
          ) : (
            <Mic className="h-12 w-12 text-slate-400" />
          )}
        </div>

        <div className="space-y-4 w-full max-w-xs">
          {!isRecording ? (
            <Button size="lg" className="w-full h-14 text-lg" onClick={() => setIsRecording(true)}>
              Start Recording
            </Button>
          ) : (
            <Button size="lg" variant="destructive" className="w-full h-14 text-lg" onClick={() => setIsRecording(false)}>
              Stop Recording
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Recording in progress...' : 'Ready to record'}
          </p>
        </div>
      </div>
    </div>
  );
}
