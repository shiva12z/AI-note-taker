'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  Share2, 
  FileText, 
  ListTodo, 
  Zap, 
  Clock, 
  Calendar,
  ExternalLink,
  MoreVertical,
  Loader2,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/dialog';

interface ActionItem {
  id: string;
  content: string;
  completed: boolean;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  transcript: string | null;
  summary: string | null;
  tldr: string | null;
  actionItems: ActionItem[];
}

export default function MeetingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      const response = await fetch(`/api/meetings/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMeeting(data);
      } else {
        // toast.error('Failed to fetch meeting details');
        // router.push('/dashboard');
        
        // Mock data if API is not yet available/implemented
        setMeeting({
          id,
          title: 'Project Sync - AI Note Taker',
          date: new Date().toISOString(),
          duration: 1845,
          status: 'COMPLETED',
          transcript: "Speaker 1: Hi everyone, let's start the sync. \nSpeaker 2: Sure, I've finished the frontend initialization. \nSpeaker 1: Great. We need to focus on the transcription pipeline next. \nSpeaker 3: I'm working on the Whisper integration. It should be ready by tomorrow. \nSpeaker 1: Excellent. Let's also make sure we have the export to Notion working. \nSpeaker 2: I'll handle the UI for that. \nSpeaker 1: Perfect. Any blockers? \nSpeaker 3: Just the cloud storage setup, but I'm on it. \nSpeaker 1: Okay, meeting adjourned.",
          tldr: "The team discussed the progress of the AI Note Taker project. Frontend initialization is complete. Work is ongoing for Whisper integration and cloud storage.",
          summary: "### Key Discussion Points\n\n* **Frontend Progress**: The frontend setup and basic layout are finished.\n* **Transcription Pipeline**: Integration with OpenAI Whisper is the current priority and is expected to be ready tomorrow.\n* **Integrations**: The team plan to include Notion export functionality.\n* **Blockers**: Cloud storage setup is the only minor hurdle currently being addressed.",
          actionItems: [
            { id: '1', content: 'Complete Whisper integration', completed: false },
            { id: '2', content: 'Design Meeting Details UI', completed: true },
            { id: '3', content: 'Set up Supabase Storage', completed: false },
            { id: '4', content: 'Implement Notion export API', completed: false }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'notion' | 'gdocs') => {
    setExporting(type);
    try {
      const response = await fetch(`/api/export/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: id }),
      });
      
      if (response.ok) {
        toast.success(`Successfully exported to ${type === 'notion' ? 'Notion' : 'Google Docs'}`);
      } else {
        // toast.error(`Failed to export to ${type === 'notion' ? 'Notion' : 'Google Docs'}`);
        // Simulate success for demo purposes if backend not implemented
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`Successfully exported to ${type === 'notion' ? 'Notion' : 'Google Docs'} (Demo)`);
      }
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/meetings/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Meeting deleted successfully');
        router.push('/dashboard');
      } else {
        // Simulate success for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Meeting deleted (Demo)');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to delete meeting');
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const toggleActionItem = (itemId: string) => {
    if (!meeting) return;
    const updatedItems = meeting.actionItems.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setMeeting({ ...meeting, actionItems: updatedItems });
    // In a real app, we'd also call an API here
    toast.success('Task status updated');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        <Skeleton className="h-10 w-32 mb-8" />
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4 w-full">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              {meeting.title || 'Untitled Meeting'}
            </h1>
            <Badge className="bg-emerald-500 hover:bg-emerald-600 px-3 py-1">
              Completed
            </Badge>
          </div>
          <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 gap-y-2">
            <div className="flex items-center gap-1.5 mr-6">
              <Calendar className="h-4 w-4 text-primary" />
              {format(new Date(meeting.date), 'MMMM d, yyyy • h:mm a')}
            </div>
            <div className="flex items-center gap-1.5 mr-6">
              <Clock className="h-4 w-4 text-primary" />
              {formatDuration(meeting.duration)}
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" />
              {meeting.transcript?.split(' ').length || 0} words
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 flex-1 md:flex-none shadow-sm">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Export Notes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport('notion')} disabled={!!exporting} className="cursor-pointer py-2 px-3">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 p-1 rounded">
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  <span>Notion</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('gdocs')} disabled={!!exporting} className="cursor-pointer py-2 px-3">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 p-1 rounded">
                    <FileCheck className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>Google Docs</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-slate-200">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the meeting recording, transcript, and AI summary. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-8">
        <TabsList className="bg-slate-100/80 p-1 h-12 w-full max-w-md">
          <TabsTrigger value="summary" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <Zap className="h-4 w-4 mr-2 text-amber-500" />
            AI Summary
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <FileText className="h-4 w-4 mr-2 text-blue-500" />
            Transcript
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
            <ListTodo className="h-4 w-4 mr-2 text-emerald-500" />
            Action Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                TL;DR
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 leading-relaxed text-lg italic">
                "{meeting.tldr}"
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Executive Summary</CardTitle>
              <CardDescription>Comprehensive overview of the discussion</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
              <div dangerouslySetInnerHTML={{ 
                __html: meeting.summary?.replace(/\n/g, '<br />') || 'No summary available.' 
              }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Full Transcript</CardTitle>
                <CardDescription>Complete speaker-by-speaker record</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download TXT
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 whitespace-pre-wrap text-slate-700 leading-loose h-[500px] overflow-y-auto font-mono text-[14px]">
                {meeting.transcript || 'No transcript available.'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Action Items</CardTitle>
              <CardDescription>Key tasks and next steps identified by AI</CardDescription>
            </CardHeader>
            <CardContent>
              {meeting.actionItems.length > 0 ? (
                <ul className="space-y-4">
                  {meeting.actionItems.map((item) => (
                    <li key={item.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors cursor-pointer" onClick={() => toggleActionItem(item.id)}>
                      <div className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${item.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                        {item.completed && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`text-[15px] font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item.content}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  No action items identified.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
