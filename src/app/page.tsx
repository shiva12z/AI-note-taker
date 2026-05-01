import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mic, FileAudio, Zap, Clock, Share2, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 md:py-32 bg-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Stop taking notes. <br />
            <span className="text-primary">Start having meetings.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get instant AI-generated transcripts, structured summaries, and action items from any meeting or lecture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/record">
              <Button size="lg" className="h-12 px-8 text-lg font-semibold">
                Start Recording Free
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-semibold">
                Upload Audio File
              </Button>
            </Link>
          </div>
          <div className="mt-16 relative">
            <div className="bg-slate-100 rounded-2xl p-4 md:p-8 shadow-2xl border border-slate-200">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-slate-400 flex flex-col items-center">
                  <Mic className="h-12 w-12 mb-4 animate-pulse text-primary" />
                  <p className="font-medium">Experience AI Transcription Magic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to stay productive</h2>
            <p className="text-muted-foreground">Focus on the conversation, we'll handle the documentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="h-8 w-8 text-blue-500" />}
              title="Live Recording"
              description="Record meetings directly from your browser with high-quality audio capture."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-amber-500" />}
              title="AI Summarization"
              description="Our GPT-4o powered engine extracts key decisions and action items in seconds."
            />
            <FeatureCard 
              icon={<FileAudio className="h-8 w-8 text-emerald-500" />}
              title="Audio Import"
              description="Upload MP3, WAV, or M4A files from your lectures or previous recordings."
            />
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-purple-500" />}
              title="Searchable History"
              description="Find exactly what was said with full-text search across all your past meetings."
            />
            <FeatureCard 
              icon={<Clock className="h-8 w-8 text-rose-500" />}
              title="Speaker Timestamps"
              description="See exactly who said what and when with automated speaker identification."
            />
            <FeatureCard 
              icon={<Share2 className="h-8 w-8 text-indigo-500" />}
              title="Easy Export"
              description="Send your notes to Notion, Google Docs, or Slack with a single click."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to save hours every week?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals and students using AI Note Taker to capture every detail.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="h-12 px-10 text-lg font-semibold">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-1 rounded">
              <NotebookPen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">AI Note Taker</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AI Note Taker. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function NotebookPen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.431 3.592a2.63 2.63 0 0 1 3.12 3.112" />
      <path d="M16 4.2c1.5 0 3 1.5 3 3s-1.5 3-3 3" />
      <path d="M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      <path d="M16 3.135a2.847 2.847 0 0 1 3.73 3.73l-2.632 2.633-3.73-3.73L16 3.135Z" />
      <path d="m13.368 5.868 3.73 3.73-8.113 8.113a2.122 2.122 0 0 1-.784.506l-3.231 1.144 1.144-3.231a2.122 2.122 0 0 1 .506-.784l8.748-8.748Z" />
    </svg>
  )
}
