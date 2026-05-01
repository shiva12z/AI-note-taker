# AI-Note-Taker (Summary Clone)

AI-Note-Taker is a web application that records live audio or accepts uploaded files to generate instant AI-powered transcripts, summaries, and action items.

## Features

- **Live Recording & Upload**: Record meetings directly in the browser or upload existing audio files.
- **Accurate Transcription**: Full transcript with speaker timestamps using OpenAI Whisper.
- **AI Summary**: Structured TLDR and bullet-point summaries using GPT-4o.
- **Action Item Extraction**: Automatic identification of key decisions and tasks.
- **Meeting History**: Searchable history of all past meetings.
- **Export Options**: Seamlessly export notes to Notion or Google Docs.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Services**: [OpenAI Whisper](https://openai.com/research/whisper) (Transcription), [OpenAI GPT-4o](https://openai.com/index/gpt-4o-announcement/) (Summarization)
- **Storage**: [Supabase Storage](https://supabase.com/storage) or [AWS S3](https://aws.amazon.com/s3/)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API Key
- Clerk API Keys

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shiva12z/AI-note-taker.git
   cd AI-note-taker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file based on `.env.example`.

4. Run the development server:
   ```bash
   npm run dev
   ```

## License

MIT
