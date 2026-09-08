import React from 'react';
import { Card, Button, Input } from '../components/ui';
import { User, ShieldCheck, UserPlus, Trash2 } from 'lucide-react';

type Role = 'PRODUCT_OWNER' | 'SCRUM_MASTER' | 'TEAM_MEMBER';

type Member = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

const MemberManagement: React.FC = () => {
  const [members] = React.useState<Member[]>([
    { id: '1', username: 'farmer_joe', email: 'joe@farm.com', role: 'PRODUCT_OWNER' },
    { id: '2', username: 'agro_expert', email: 'expert@agri.com', role: 'SCRUM_MASTER' },
    { id: '3', username: 'worker_bee', email: 'bee@farm.com', role: 'TEAM_MEMBER' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-blue-dark flex items-center gap-2">
          <Users size={20} className="text-brand-green" />
          Project Members
        </h2>
        <Button variant="primary" className="flex items-center gap-2">
          <UserPlus size={18} />
          Add Member
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-slate-500 border-b border-slate-200">
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
                      <Button variant="ghost" className="p-1 h-8 w-8 text-red-500 hover:bg-red-50">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MemberManagement;
