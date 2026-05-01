'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mic, Square, Pause, Play, Trash2, Upload, Loader2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { Visualizer } from '@/components/Visualizer';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function RecordPage() {
  const router = useRouter();
  const {
    status,
    audioBlob,
    audioUrl,
    duration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    stream
  } = useAudioRecorder();

  const [isUploading, setIsUploading] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      // Simulate upload for now as backend might not be ready
      // In a real scenario, we'd send this to /api/meetings/upload
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      console.log('Uploading audio blob:', audioBlob);
      
      // Mocking the delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Recording uploaded successfully!');
      router.push('/dashboard');
    } catch (err) {
      console.error('Upload failed', err);
      toast.error('Failed to upload recording');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Live Recording</CardTitle>
          <CardDescription>
            Record your meeting or lecture. We'll generate a summary once you're done.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`text-5xl font-mono ${status === 'recording' ? 'text-red-500' : 'text-slate-600'}`}>
              {formatDuration(duration)}
            </div>
            
            <Visualizer stream={stream} isRecording={status === 'recording'} />

            <div className="flex items-center space-x-4">
              {status === 'idle' || status === 'stopped' ? (
                <Button 
                  size="lg" 
                  className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={startRecording}
                >
                  <Mic className="h-8 w-8" />
                </Button>
              ) : (
                <>
                  {status === 'recording' ? (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-16 w-16 border-2"
                      onClick={pauseRecording}
                    >
                      <Pause className="h-8 w-8 text-slate-600" />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full h-16 w-16 border-2"
                      onClick={resumeRecording}
                    >
                      <Play className="h-8 w-8 text-slate-600" />
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="rounded-full h-16 w-16 shadow-lg"
                    onClick={stopRecording}
                  >
                    <Square className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="text-sm font-medium text-slate-500 capitalize">
              {status === 'idle' ? 'Ready to record' : status.replace('stopped', 'Recording complete')}
            </div>
          </div>

          {status === 'stopped' && audioUrl && (
            <div className="space-y-4 pt-4 border-t">
              <div className="text-sm font-medium">Preview Recording:</div>
              <audio src={audioUrl} controls className="w-full h-10" />
              
              <div className="flex space-x-4 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 space-x-2" 
                  onClick={resetRecording}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Discard</span>
                </Button>
                <Button 
                  className="flex-1 space-x-2" 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>Upload & Process</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50 border-t flex justify-center py-4 rounded-b-xl">
          <p className="text-xs text-slate-400">
            Microphone access is required for recording. Audio is processed securely.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
