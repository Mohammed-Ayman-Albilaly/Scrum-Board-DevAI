import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FolderKanban, Plus, Users, LayoutGrid } from 'lucide-react';
import apiClient from '../../services/api';

type Project = {
  id: string;
  name: string;
  description: string;
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <Card className="group hover:border-brand-green transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-brand-neutral-bg rounded-lg group-hover:bg-emerald-50 transition-colors">
          <FolderKanban className="text-brand-green" size={24} />
        </div>
        <Button variant="ghost" className="p-1 h-8 w-8 flex items-center justify-center">
          <Users size={16} />
        </Button>
      </div>
      <h3 className="text-lg font-bold text-brand-blue-dark mb-1">{project.name}</h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
      <Button variant="secondary" className="w-full" onClick={() => window.location.href = `/project/${project.id}/backlog`}>
        Open Project
      </Button>
    </Card>
  );
};

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [newProject, setNewProject] = React.useState({ name: '', description: '' });

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/projects/my-projects');
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const response = await apiClient.post('/projects', newProject);
      setProjects([...projects, response.data]);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-brand-neutral-bg p-6 lg:p-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-dark flex items-center gap-3">
            <LayoutGrid className="text-brand-green" />
            My Projects
          </h1>
          <p className="text-slate-500 mt-1">Welcome back! Manage your agricultural scrum boards.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Create Project
        </Button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-500">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              No projects found. Create your first one!
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-blue-dark">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Project Name" 
                placeholder="e.g. Wheat Cycle 2026" 
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Description</label>
                <textarea 
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white text-brand-blue-dark"
                  rows={3}
                  placeholder="Describe the project goals..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
