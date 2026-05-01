export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Meetings</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <p className="text-muted-foreground mb-6">You haven't recorded any meetings yet.</p>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium">
          Record your first meeting
        </button>
      </div>
    </div>
  );
}
