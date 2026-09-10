import React from 'react';
import { Card, Button } from '../components/ui';
import { 
  Archive, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

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
  const [userRole, setUserRole] = React.useState<'SCRUM_MASTER' | 'PRODUCT_OWNER' | 'TEAM_MEMBER'>('SCRUM_MASTER');
  
  // Mock data for Global Deployed List
  const [sprints, setSprints] = React.useState<Sprint[]>([
    {
      id: 's1',
      name: 'Sprint 1: Core Infrastructure',
      goal: 'Complete authentication and project dashboard',
      isClosed: true,
      stories: [
        { id: '1', title: 'JWT Authentication', description: 'Secure API endpoints', storyPoints: 5, columnStatus: 'DEPLOYED' },
        { id: '4', title: 'Postgres Indexing', description: 'DB optimization', storyPoints: 2, columnStatus: 'DEPLOYED' },
      ]
    },
    {
      id: 's2',
      name: 'Sprint 2: User Management',
      goal: 'Implement member roles and permissions',
      isClosed: false,
      stories: [
        { id: '5', title: 'Role Middleware', description: 'RBAC logic', storyPoints: 3, columnStatus: 'DEPLOYED' },
        { id: '6', title: 'Member Table', description: 'UI for members', storyPoints: 2, columnStatus: 'UNDER_TESTING' },
      ]
    }
  ]);

  const handleCloseSprint = async (sprintId: string) => {
    try {
      // API Call would go here
      console.log(`Closing sprint ${sprintId}...`);
      setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, isClosed: true } : s));
    } catch (error) {
      console.error('Failed to close sprint:', error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-bg p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark flex items-center gap-3">
            <Archive className="text-brand-green" size={32} />
            Global Deployed List
          </h1>
          <p className="text-slate-500 mt-1">Archive of all completed user stories across all sprints</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            Role: {userRole}
          </div>
        </div>
      </header>

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
      </div>
    </div>
  );
};

export default DeployedArchive;
