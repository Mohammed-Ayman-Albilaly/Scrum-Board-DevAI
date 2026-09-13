import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Archive, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  ArrowLeft
} from 'lucide-react';
import apiClient from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

type UserStory = {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  columnStatus: string;
};

type Sprint = {
  id: string;
  name: string;
  goal: string;
  isClosed: boolean;
  stories: UserStory[];
};

const DeployedArchive: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [userRole] = React.useState<'SCRUM_MASTER' | 'PRODUCT_OWNER' | 'TEAM_MEMBER'>('SCRUM_MASTER');
  const [sprints, setSprints] = React.useState<Sprint[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchArchive = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/projects/${projectId}/archive`);
        setSprints(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch archive');
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, [projectId]);

  const handleCloseSprint = async (sprintId: string) => {
    if (!projectId) return;
    try {
      await apiClient.post(`/sprints/${sprintId}/close?projectId=${projectId}`);
      setSprints(sprints.filter(s => s.id !== sprintId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close sprint');
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-bg p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 mb-6 text-slate-500 hover:text-brand-blue" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-green rounded-lg text-white">
              <Archive size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-blue-dark">Global Deployed List</h1>
              <p className="text-slate-500 mt-1">Archive of all completed user stories for this project</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Role: {userRole}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500">Loading archive...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">{error}</div>
        ) : (
          <div className="space-y-8">
            {sprints.map(sprint => (
              <div key={sprint.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${sprint.isClosed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                      {sprint.isClosed ? <Lock size={18} /> : <Calendar size={18} />}
                    </div>
                    <div>
                      <h2 className="font-bold text-brand-blue-dark">{sprint.name}</h2>
                      <p className="text-xs text-slate-500 italic">{sprint.goal}</p>
                    </div>
                  </div>
                  
                  {!sprint.isClosed && userRole === 'SCRUM_MASTER' && (
                    <Button 
                      variant="accent" 
                      className="flex items-center gap-2 text-xs"
                      onClick={() => handleCloseSprint(sprint.id)}
                    >
                      <Lock size={14} />
                      Close Sprint
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sprint.stories
                    .filter(story => story.columnStatus === 'DEPLOYED')
                    .map(story => (
                    <Card key={story.id} className="p-4 border-l-4 border-l-emerald-500 group hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-brand-blue-dark text-sm">{story.title}</h4>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {story.storyPoints} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{story.description}</p>
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Deployed to Production
                      </div>
                    </Card>
                  ))}
                  {sprint.stories.filter(s => s.columnStatus === 'DEPLOYED').length === 0 && (
                    <div className="col-span-full text-center py-6 text-slate-400 text-xs italic border-2 border-dashed border-slate-200 rounded-xl">
                      No deployed stories in this sprint
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sprints.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No archived sprints found for this project.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeployedArchive;
