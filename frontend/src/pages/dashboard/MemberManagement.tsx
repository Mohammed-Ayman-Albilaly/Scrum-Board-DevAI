import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, ShieldCheck, UserPlus, Trash2, Users, ArrowLeft } from 'lucide-react';
import apiClient from '../../services/api';
import { useNavigate } from 'react-router-dom';

type Role = 'PRODUCT_OWNER' | 'SCRUM_MASTER' | 'TEAM_MEMBER';

type Member = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

const MemberManagement: React.FC<{ projectId: string }> = ({ projectId }) => {
  const navigate = useNavigate();
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newMember, setNewMember] = React.useState({ username: '', email: '', role: 'TEAM_MEMBER' as Role });
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/projects/${projectId}/members`);
        setMembers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [projectId]);

  const handleAddMember = async () => {
    try {
      const response = await apiClient.post(`/projects/${projectId}/members`, newMember);
      setMembers([...members, response.data]);
      setIsModalOpen(false);
      setNewMember({ username: '', email: '', role: 'TEAM_MEMBER' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await apiClient.delete(`/projects/members/${memberId}`);
      setMembers(members.filter(m => m.id !== memberId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 w-fit text-slate-500 hover:text-brand-blue" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-blue-dark flex items-center gap-2">
            <Users size={20} className="text-brand-green" />
            Project Members
          </h2>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} />
            Add Member
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading members...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-sm text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="pb-3 font-medium">Member</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map(member => (
                  <tr key={member.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-neutral-bg rounded-full text-brand-blue">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-blue-dark">{member.username}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        member.role === 'PRODUCT_OWNER' ? 'bg-emerald-100 text-emerald-700' : 
                        member.role === 'SCRUM_MASTER' ? 'bg-sky-100 text-sky-700' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" className="p-1 h-8 w-8">
                          <ShieldCheck size={16} />
                        </Button>
                        <Button variant="ghost" className="p-1 h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleRemoveMember(member.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-10 text-center text-slate-500">No members added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-brand-blue-dark">Add Team Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <Input 
                label="Username" 
                placeholder="johndoe" 
                value={newMember.username}
                onChange={(e) => setNewMember({...newMember, username: e.target.value})}
              />
              <Input 
                label="Email" 
                type="email" 
                placeholder="john@farm.com" 
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-brand-blue-dark">Role</label>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue bg-white text-brand-blue-dark"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value as Role})}
                >
                  <option value="TEAM_MEMBER">Team Member</option>
                  <option value="SCRUM_MASTER">Scrum Master</option>
                  <option value="PRODUCT_OWNER">Product Owner</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleAddMember}>
                  Add Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
