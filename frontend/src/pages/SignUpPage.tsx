import apiClient from '../services/api';

import React from 'react';
import { Card, Button, Input } from '../components/ui';
import { UserPlus } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    specialization: ''
  });
  const [error, setError] = React.useState<string | null>(null);

  const validate = () => {
    const { username, email, password, specialization } = formData;
    if (!username || !email || !password || !specialization) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await apiClient.post('/auth/signup', formData);
      if (response.status === 200 || response.status === 201) {
        window.location.href = '/login';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during sign up');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-brand-green rounded-xl text-white mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bold text-brand-blue-dark">Join AgriTech</h1>
          <p className="text-slate-500 text-center mt-2">
            Start organizing your scrum process today
          </p>
          <a href="/" className="mt-4 text-sm text-brand-blue hover:underline flex items-center gap-1">
            ← Back to Home
          </a>
        </div>

        <form onSubmit={handleSignUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {error && (
            <div className="col-span-full p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          <Input 
            label="Username" 
            name="username"
            placeholder="johndoe" 
            value={formData.username}
            onChange={handleChange}
          />
          <Input 
            label="Email" 
            name="email"
            type="email"
            placeholder="john@farm.com" 
            value={formData.email}
            onChange={handleChange}
          />
          <Input 
            label="Specialization" 
            name="specialization"
            placeholder="e.g. Agronomist" 
            value={formData.specialization}
            onChange={handleChange}
          />
          <Input 
            label="Password" 
            name="password"
            type="password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={handleChange}
          />
          
          <div className="col-span-full pt-4">
            <Button type="submit" className="w-full py-3">
              Create Account
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <a href="/login" className="text-brand-green font-semibold hover:underline">
              Sign in here
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignUpPage;
