import React from 'react';
import { Clock, Calendar, Eye, RefreshCw, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'standup', label: 'Daily Standup', icon: <Clock size={18} /> },
  { id: 'planning', label: 'Planning', icon: <Calendar size={18} /> },
  { id: 'review', label: 'Review', icon: <Eye size={18} /> },
  { id: 'retro', label: 'Retro', icon: <RefreshCw size={18} /> },
];

const DailyStandupLog: React.FC = () => {
  return (
    <Card title="Daily Standup Reports">
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-slate-500 text-sm">Submit your daily progress report.</p>
          <Button variant="primary">Submit Report</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-brand-blue-dark">User {i}</span>
                <span className="text-xs text-slate-400">Today</span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Yesterday:</strong> Finished the API integration.</p>
                <p><strong>Today:</strong> Working on the UI polish.</p>
                <p><strong>Blockers:</strong> None.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const PlanningLog: React.FC = () => {
  return (
    <Card title="Sprint Planning Notes">
      <div className="space-y-4">
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          <p className="text-slate-600"><strong>Committed Points:</strong> 42</p>
          <p className="text-slate-600"><strong>Capacity Notes:</strong> Team is at full capacity. One member on leave Friday.</p>
        </div>
      </div>
    </Card>
  );
};

const ReviewLog: React.FC = () => {
  return (
    <Card title="Sprint Review Summary">
      <div className="space-y-4">
        <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
          <p className="text-slate-600"><strong>Demo Summary:</strong> All primary stories completed. Feedback on the dashboard layout was positive.</p>
          <p className="text-slate-600"><strong>Stakeholder Feedback:</strong> Request to add a dark mode for the archive page.</p>
        </div>
      </div>
    </Card>
  );
};

const RetroLog: React.FC = () => {
  return (
    <Card title="Sprint Retrospective">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-emerald-600">Went Well</h4>
          <div className="space-y-2">
            {['Collaboration was great', 'API was stable'].map((text, i) => (
              <div key={i} className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-800">{text}</div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-orange-500">Needs Improvement</h4>
          <div className="space-y-2">
            {['Daily standups too long', 'Lack of documentation'].map((text, i) => (
              <div key={i} className="p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">{text}</div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-sky-600">Action Items</h4>
          <div className="space-y-2">
            {['Limit standup to 15m', 'Update API docs'].map((text, i) => (
              <div key={i} className="p-3 bg-sky-50 border border-sky-100 rounded-lg text-sm text-sky-800">{text}</div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const CeremonyLogs: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('standup');
  const navigate = useNavigate();

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

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue-dark">Ceremony Logs</h1>
          <p className="text-slate-500">Review and track the outcomes of scrum ceremonies</p>
        </header>

        <div className="flex gap-6 mb-8 border-b border-slate-200">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id 
                ? 'text-brand-blue-dark border-b-2 border-brand-green' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.icon} {tab.label}
              </div>
            </button>
          ))}
        </div>

        <div className="transition-all duration-300">
          {activeTab === 'standup' && <DailyStandupLog />}
          {activeTab === 'planning' && <PlanningLog />}
          {activeTab === 'review' && <ReviewLog />}
          {activeTab === 'retro' && <RetroLog />}
        </div>
      </div>
    </div>
  );
};

export default CeremonyLogs;
