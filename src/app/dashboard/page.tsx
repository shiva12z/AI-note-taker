'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, Mic, FileAudio, Clock, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/meetings');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setMeetings(data);
        } else {
          console.error('API returned non-array data:', data);
          setMeetings([]);
        }
      } else {
        console.error('Failed to fetch meetings:', response.statusText);
        setMeetings([]);
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Meeting['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Completed</Badge>;
      case 'PROCESSING':
        return <Badge variant="secondary" className="animate-pulse">Processing</Badge>;
      case 'UPLOADING':
        return <Badge variant="outline">Uploading</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Meetings</h1>
          <p className="text-muted-foreground mt-1">Manage and view your recorded notes and summaries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/record">
            <Button className="gap-2 shadow-sm">
              <Mic className="h-4 w-4" />
              Record New
            </Button>
          </Link>
          <Link href="/upload">
            <Button variant="outline" className="gap-2 shadow-sm">
              <FileAudio className="h-4 w-4" />
              Upload File
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative mb-8 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search meetings by title..."
          className="pl-10 h-12 border-slate-200 bg-white shadow-sm rounded-xl focus-visible:ring-primary/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMeetings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeetings.map((meeting) => (
            <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
              <Card className="group hover:border-primary transition-all duration-200 cursor-pointer h-full flex flex-col shadow-sm hover:shadow-md border-slate-200 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
                      {meeting.title || 'Untitled Meeting'}
                    </CardTitle>
                    {getStatusBadge(meeting.status)}
                  </div>
                  <div className="flex items-center text-[13px] text-slate-500 gap-4 mt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(meeting.date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(meeting.duration)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-[13px] leading-relaxed text-slate-600 line-clamp-2">
                    Click to view full transcript and AI-generated summary from this session.
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-4 flex justify-between items-center text-primary font-medium text-xs">
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm max-w-2xl mx-auto mt-8">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <FileAudio className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {searchQuery ? "No matches found" : "Your library is empty"}
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            {searchQuery 
              ? `We couldn't find any meetings matching "${searchQuery}". Try a different search term.`
              : "Record your first meeting or lecture to get started with AI-powered notes and summaries."}
          </p>
          {!searchQuery && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/record">
                <Button className="h-11 px-8 rounded-lg font-semibold">
                  Record your first meeting
                </Button>
              </Link>
            </div>
          )}
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
