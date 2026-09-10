import apiClient from '../../services/api';
import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Calendar, 
  Target, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { useParams } from 'react-router-dom';

type Story = {
  id: string;
  title: string;
  storyPoints: number;
  status: 'UNREFINED' | 'READY';
};

type Sprint = {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  committedPoints: number;
};

const SprintPlanning: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [userRole, setUserRole] = React.useState<'SCRUM_MASTER' | 'PRODUCT_OWNER' | 'TEAM_MEMBER'>('SCRUM_MASTER');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [activeSprint, setActiveSprint] = React.useState<Sprint | null>(null);
  const [backlogStories, setBacklogStories] = React.useState<Story[]>([]);
  const [newSprint, setNewSprint] = React.useState({ name: '', goal: '', startDate: '', endDate: '' });

  React.useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const [sprintRes, storiesRes] = await Promise.all([
          apiClient.get(`/sprints/active?projectId=${projectId}`),
          apiClient.get(`/projects/${projectId}/stories`)
        ]);
        setActiveSprint(sprintRes.data);
        setBacklogStories(storiesRes.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch planning data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleCreateSprint = async () => {
    if (!projectId) return;
    try {
      // Backend expects projectId as a RequestParam
      const response = await apiClient.post(`/sprints?projectId=${projectId}`, newSprint);
      setActiveSprint(response.data);
      setIsModalOpen(false);
      setNewSprint({ name: '', goal: '', startDate: '', endDate: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create sprint');
    }
  };

  const handleCommitStory = async (storyId: string) => {
    if (!projectId || !activeSprint) return;
    try {
      // Backend expects: /api/sprints/{storyId}/commit?sprintId=...&projectId=...
      await apiClient.post(`/sprints/${storyId}/commit?sprintId=${activeSprint.id}&projectId=${projectId}`);
      
      // Refresh stories
      const response = await apiClient.get(`/projects/${projectId}/stories`);
      setBacklogStories(response.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to commit story');
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-bg p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark">Sprint Planning</h1>
          <p className="text-slate-500 mt-1">Define goals and commit stories for the next iteration</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            Role: {userRole}
          </div>
          {userRole === 'SCRUM_MASTER' && (
            <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Create Sprint
            </Button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">Loading planning data...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Sprint Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-t-4 border-t-brand-blue">
              <h2 className="text-lg font-bold text-brand-blue-dark mb-4 flex items-center gap-2">
                <Target size={20} className="text-brand-blue" />
                Current Sprint
              </h2>
              
              {activeSprint ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sprint Name</p>
                    <p className="font-semibold text-brand-blue-dark">{activeSprint.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Goal</p>
                    <p className="text-sm text-slate-600 italic">"{activeSprint.goal}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Start Date</p>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar size={14} /> {activeSprint.startDate}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">End Date</p>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock size={14} /> {activeSprint.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Committed Points</span>
                    <span className="text-lg font-bold text-brand-green">{activeSprint.committedPoints} pts</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No active sprint found.</p>
              )}
            </Card>
          </div>

          {/* Right: Planning Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-brand-blue-dark flex items-center gap-2">
                <CheckCircle2 size={20} className="text-brand-green" />
                Ready for Sprint
              </h2>
              <span className="text-xs text-slate-400">Only stories with 'READY' status can be moved</span>
            </div>

            <div className="space-y-3">
              {backlogStories.filter(s => s.status === 'READY').map(story => (
                <Card key={story.id} className="p-4 flex items-center justify-between group hover:border-brand-green transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-neutral-bg rounded-lg text-brand-blue">
                      <ArrowRight size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-brand-blue-dark">{story.title}</p>
                      <p className="text-xs text-slate-500">{story.storyPoints} story points</p>
                    </div>
                  </div>
                  {userRole === 'PRODUCT_OWNER' && (
                    <Button variant="secondary" className="text-xs py-1 px-3" onClick={() => handleCommitStory(story.id)}>
                      Commit to Sprint
                    </Button>
                  )}
                </Card>
              ))}
              {backlogStories.filter(s => s.status === 'READY').length === 0 && (
                <div className="text-center py-10 text-slate-400 italic">
                  No stories ready for planning.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-blue-dark">Create New Sprint</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Sprint Name" 
                placeholder="e.g. Sprint 1: Foundations" 
                value={newSprint.name}
                onChange={(e) => setNewSprint({...newSprint, name: e.target.value})}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Sprint Goal</label>
                <textarea 
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white text-brand-blue-dark"
                  rows={3}
                  placeholder="What is the primary objective of this sprint?"
                  value={newSprint.goal}
                  onChange={(e) => setNewSprint({...newSprint, goal: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" value={newSprint.startDate} onChange={(e) => setNewSprint({...newSprint, startDate: e.target.value})} />
                <Input label="End Date" type="date" value={newSprint.endDate} onChange={(e) => setNewSprint({...newSprint, endDate: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleCreateSprint}>
                  Create Sprint
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintPlanning;
