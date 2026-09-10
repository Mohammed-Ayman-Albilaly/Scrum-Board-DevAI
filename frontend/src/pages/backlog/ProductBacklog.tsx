import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  GripVertical, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import apiClient from '../../services/api';
import { useParams } from 'react-router-dom';

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
  onEdit: (story: UserStory) => void,
  onDelete: (id: string) => void
}> = ({ story, isPO, onEdit, onDelete }) => {
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
            <Button variant="ghost" className="p-1 h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => onDelete(story.id)}>
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

const ProductBacklog: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState<'PRODUCT_OWNER' | 'TEAM_MEMBER'>('PRODUCT_OWNER');
  
  const [stories, setStories] = React.useState<UserStory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newStory, setNewStory] = React.useState({ title: '', description: '', storyPoints: 0, priority: 1, status: 'UNREFINED' as StoryStatus });

  React.useEffect(() => {
    const fetchStories = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/projects/${projectId}/stories`);
        setStories(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch backlog');
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [projectId]);

  const handleCreateStory = async () => {
    if (!projectId) return;
    try {
      const response = await apiClient.post(`/projects/${projectId}/stories`, {
        ...newStory,
        projectId
      });
      setStories([...stories, response.data]);
      setIsModalOpen(false);
      setNewStory({ title: '', description: '', storyPoints: 0, priority: 1, status: 'UNREFINED' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create story');
    }
  };

  const handleUpdateStory = async (story: UserStory) => {
    if (!projectId) return;
    try {
      await apiClient.put(`/projects/${projectId}/stories/${story.id}`, story);
      setStories(stories.map(s => s.id === story.id ? story : s));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update story');
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!projectId) return;
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await apiClient.delete(`/projects/${projectId}/stories/${id}`);
      setStories(stories.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete story');
    }
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">Loading backlog...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-s1 lg:grid-cols-3 gap-8">
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
                onEdit={(s) => handleUpdateStory(s)} 
                onDelete={handleDeleteStory}
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
                  <p className="text-xl font-bold text-brand-blue-dark">{stories.reduce((acc, s) => acc + s.storyPoints, 0)} pts</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Ready for Sprint</p>
                  <p className="text-xl font-bold text-emerald-600">{stories.filter(s => s.status === 'READY').length} stories</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Unrefined</p>
                  <p className="text-xl font-bold text-orange-500">{stories.filter(s => s.status === 'UNREFINED').length} stories</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-blue-dark">Add New Story</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Story Title" placeholder="As a user, I want to..." value={newStory.title} onChange={(e) => setNewStory({...newStory, title: e.target.value})} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Description</label>
                <textarea 
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white text-brand-blue-dark"
                  rows={4}
                  placeholder="Provide detailed acceptance criteria..."
                  value={newStory.description}
                  onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Story Points" type="number" placeholder="5" value={newStory.storyPoints.toString()} onChange={(e) => setNewStory({...newStory, storyPoints: parseInt(e.target.value) || 0})} />
                <Input label="Priority" type="number" placeholder="1" value={newStory.priority.toString()} onChange={(e) => setNewStory({...newStory, priority: parseInt(e.target.value) || 0})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Satus</label>
                <select className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-brand-blue bg-white text-brand-blue-dark" value={newStory.status} onChange={(e) => setNewStory({...newStory, status: e.target.value as StoryStatus})}>
                  <option value="UNREFINED">Unrefined</option>
                  <option value="READY">Ready</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleCreateStory}>
                  <Plus size={16} />
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

export default ProductBacklog;
