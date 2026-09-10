import React from 'react';
import { Card, Button } from '../components/ui';
import { 
  Trello, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  LayoutGrid 
} from 'lucide-react';

type ColumnStatus = 'SPRINT_BACKLOG' | 'UNDER_DEVELOPMENT' | 'UNDER_TESTING' | 'DEPLOYED';

type UserStory = {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  columnStatus: ColumnStatus;
};

const COLUMNS: { id: ColumnStatus; label: string; color: string }[] = [
  { id: 'SPRINT_BACKLOG', label: 'Sprint Backlog', color: 'bg-slate-100 text-slate-600' },
  { id: 'UNDER_DEVELOPMENT', label: 'Under Development', color: 'bg-blue-100 text-blue-700' },
  { id: 'UNDER_TESTING', label: 'Under Testing', color: 'bg-orange-100 text-orange-700' },
  { id: 'DEPLOYED', label: 'Deployed', color: 'bg-emerald-100 text-emerald-700' },
];

const BoardStoryCard: React.FC<{ 
  story: UserStory, 
  onMove: (storyId: string, direction: 'next' | 'prev') => void 
}> = ({ story, onMove }) => {
  return (
    <Card className="mb-3 group hover:shadow-md transition-all cursor-default border-l-4 border-l-brand-blue">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-brand-blue-dark text-sm">{story.title}</h4>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {story.storyPoints} pts
          </span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{story.description}</p>
        
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <Button 
            variant="ghost" 
            className="p-1 h-7 w-7" 
            onClick={() => onMove(story.id, 'prev')}
            disabled={story.columnStatus === 'SPRINT_BACKLOG'}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button 
            variant="ghost" 
            className="p-1 h-7 w-7" 
            onClick={() => onMove(story.id, 'next')}
            disabled={story.columnStatus === 'DEPLOYED'}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ScrumBoard: React.FC = () => {
  const [stories, setStories] = React.useState<UserStory[]>([
    { id: '1', title: 'JWT Authentication', description: 'Secure API endpoints', storyPoints: 5, columnStatus: 'SPRINT_BACKLOG' },
    { id: '2', title: 'Project Gallery UI', description: 'Dashboard view', storyPoints: 3, columnStatus: 'UNDER_DEVELOPMENT' },
    { id: '3', title: 'RBAC Middleware', description: 'Project level access', storyPoints: 8, columnStatus: 'UNDER_TESTING' },
    { id: '4', title: 'Postgres Indexing', description: 'DB optimization', storyPoints: 2, columnStatus: 'DEPLOYED' },
  ]);

  const moveStory = async (id: string, direction: 'next' | 'prev') => {
    const story = stories.find(s => s.id === id);
    if (!story) return;

    const currentIndex = COLUMNS.findIndex(c => c.id === story.columnStatus);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      const newStatus = COLUMNS[nextIndex].id;
      
      try {
        // In a real scenario, projectId would be retrieved from current project context/URL
        const projectId = 'some-project-id'; 
        await fetch(`/api/projects/${projectId}/stories/${id}/transition?status=${newStatus}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        setStories(prev => prev.map(s => 
          s.id === id ? { ...s, columnStatus: newStatus } : s
        ));
      } catch (error) {
        console.error('Failed to move story:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-bg p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-green rounded-lg text-white">
            <Trello size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-blue-dark">Scrum Board</h1>
            <p className="text-slate-500 text-sm">Sprint 1: Core Infrastructure</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
            <Clock size={14} />
            Days Remaining: 7
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">
            <CheckCircle2 size={14} />
            Velocity: 12/20 pts
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex flex-col h-full">
            <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl font-bold text-xs uppercase tracking-wider ${col.color}`}>
              <div className="flex items-center gap-2">
                <LayoutGrid size={14} />
                {col.label}
              </div>
              <span className="bg-white/50 px-2 py-0.5 rounded-full">
                {stories.filter(s => s.columnStatus === col.id).length}
              </span>
            </div>
            <div className="flex-1 bg-slate-200/30 p-3 rounded-b-xl overflow-y-auto space-y-3 border-x border-b border-slate-200">
              {stories.filter(s => s.columnStatus === col.id).map(story => (
                <BoardStoryCard 
                  key={story.id} 
                  story={story} 
                  onMove={moveStory} 
                />
              ))}
              {stories.filter(s => s.columnStatus === col.id).length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  No stories in this column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrumBoard;
