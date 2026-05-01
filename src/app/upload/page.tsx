'use client';

import { Button } from '@/components/ui/button';
import { Upload, FileAudio, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      // Mock upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('File uploaded successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      <h1 className="text-3xl font-bold mb-4">Upload Audio</h1>
      <p className="text-muted-foreground mb-12">
        Upload an existing meeting or lecture recording to get an AI summary.
      </p>

      <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center">
        {!file ? (
          <>
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            <p className="font-medium mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-muted-foreground mb-6">MP3, WAV, or M4A (max 50MB)</p>
            <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>Select File</Button>
            <input 
              id="file-upload"
              type="file" 
              className="hidden" 
              accept="audio/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mb-8">
              <div className="flex items-center space-x-3">
                <FileAudio className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full h-12 gap-2" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isUploading ? 'Processing...' : 'Process with AI'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
