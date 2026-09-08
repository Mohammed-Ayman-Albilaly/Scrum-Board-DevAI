import React from 'react';
import { Card, Button, Input } from '../components/ui';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const validate = () => {
    if (!email || !password) {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-brand-green rounded-xl text-white mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-brand-blue-dark">Welcome Back</h1>
          <p className="text-slate-500 text-center mt-2">
            Manage your agricultural projects with precision
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          <Input 
            label="Email Address" 
            placeholder="name@farm.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300" />
              <span className="text-slate-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-brand-blue hover:underline">Forgot password?</a>
          </div>

          <Button className="w-full py-3">
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-brand-green font-semibold hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
