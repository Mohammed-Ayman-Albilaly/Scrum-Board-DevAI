import React from 'react';
import { Card, Button, Input } from '../components/ui';
import { 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

type StoryStatus = 'UNREFINED' | 'READY';
type ColumnStatus = 'SPRINT_BACKLOG' | 'UNDER_DEVELOPMENT' | 'UNDER_TESTING' | 'DEPLOYED';

type UserStory = {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: number;
  status: StoryStatus;
  columnStatus: ColumnStatus;
};

const StoryCard: React.FC<{ 
  story: UserStory, 
  isPO: boolean, 
  onEdit: (story: UserStory) => void 
}> = ({ story, isPO, onEdit }) => {
  const statusColors = {
    UNREFINED: 'bg-slate-100 text-slate-600',
    READY: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <Card className="mb-3 group relative overflow-hidden border-l-4 border-l-transparent hover:border-l-brand-green transition-all">
      <div className="flex items-start gap-4">
        <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400">
          <GripVertical size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-brand-blue-dark">{story.title}</h4>
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${statusColors[story.status]}`}>
              {story.status}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{story.description}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <AlertCircle size={14} />
              Points: <span className="text-brand-blue-dark">{story.storyPoints}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <ChevronRight size={14} />
              Priority: <span className="text-brand-blue-dark">{story.priority}</span>
            </div>
          </div>
        </div>
        {isPO && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" className="p-1 h-8 w-8" onClick={() => onEdit(story)}>
              <Edit2 size={14} />
            </Button>
            <Button variant="ghost" className="p-1 h-8 w-8 text-red-500 hover:bg-red-50">
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

const ProductBacklog: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState<'PRODUCT_OWNER' | 'TEAM_MEMBER'>('PRODUCT_OWNER'); // Mock for UI testing
  
  const [stories, setStories] = React.useState<UserStory[]>([
    { id: '1', title: 'Implement JWT Authentication', description: 'Set up secure token-based auth for all API endpoints', storyPoints: 5, priority: 1, status: 'READY', columnStatus: 'SPRINT_BACKLOG' },
    { id: '2', title: 'Project Dashboard UI', description: 'Create the main project gallery and member management views', storyPoints: 3, priority: 2, status: 'READY', columnStatus: 'SPRINT_BACKLOG' },
    { id: '3', title: 'RBAC Security Layer', description: 'Ensure project-level access control for all endpoints', storyPoints: 8, priority: 3, status: 'UNREFINED', columnStatus: 'SPRINT_BACKLOG' },
    { id: '4', title: 'Database Schema Optimization', description: 'Refine PostgreSQL indexes for story and sprint queries', storyPoints: 2, priority: 4, status: 'UNREFINED', columnStatus: 'SPRINT_BACKLOG' },
  ]);

  return (
    <div className="min-h-screen bg-brand-neutral-bg p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark">Product Backlog</h1>
          <p className="text-slate-500 mt-1">Prioritize and refine user stories for the project</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            Role: {userRole}
          </div>
          {userRole === 'PRODUCT_OWNER' && (
            <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Add Story
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-blue-dark flex items-center gap-2">
              <LayoutGrid size={20} className="text-brand-green" />
              Prioritized Stories
            </h2>
            <div className="text-xs text-slate-400">
              Total Stories: {stories.length}
            </div>
          </div>
          {stories.map(story => (
            <StoryCard 
              key={story.id} 
              story={story} 
              isPO={userRole === 'PRODUCT_OWNER'} 
              onEdit={(s) => console.log('Edit story', s)} 
            />
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="font-bold text-brand-blue-dark mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-brand-green" />
              Backlog Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Total Story Points</p>
                <p className="text-xl font-bold text-brand-blue-dark">18 pts</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Ready for Sprint</p>
                <p className="text-xl font-bold text-emerald-600">2 stories</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Unrefined</p>
                <p className="text-xl font-bold text-orange-500">2 stories</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-blue-dark">Add New Story</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Story Title" placeholder="As a user, I want to..." />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Description</label>
                <textarea 
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white text-brand-blue-dark"
                  rows={4}
                  placeholder="Provide detailed acceptance criteria..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Story Points" type="number" placeholder="5" />
                <Input label="Priority" type="number" placeholder="1" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Initial Status</label>
                <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white text-brand-blue-dark">
                  <option value="UNREFINED">Unrefined</option>
                  <option value="READY">Ready</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1">
                  Create Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock LayoutGrid for the missing import in the a-tag
const LayoutGrid = ({ size, className }: { size: number, className: string }) => (
  <div className={`inline-block ${className}`} style={{ width: size, height: size, background: 'currentColor', mask: 'url(https://api.dicebear.com/7.x/shapes/svg?seed=grid)', WebkitMask: 'url(https://api.dicebear.com/7.x/shapes/svg?seed=grid)' }}></div>
);

export default ProductBacklog;
