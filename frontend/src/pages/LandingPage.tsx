import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-neutral-bg font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
          <span className="text-xl font-bold text-brand-blue-dark">ScrumFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-brand-blue-dark hover:text-brand-blue font-medium transition-colors">Features</a>
          <a href="#how-it-works" className="text-brand-blue-dark hover:text-brand-blue font-medium transition-colors">How it Works</a>
          <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
          <Button variant="primary" onClick={() => navigate('/signup')}>Sign Up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-blue-dark leading-tight mb-6">
            Master Your Workflow with <span className="text-brand-blue">Precision</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            The ultimate Scrum board for modern agile teams. Organize your backlog, plan your sprints, and track progress with an intuitive interface designed for speed and clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="primary" 
              className="w-full sm:w-auto px-8 py-4 text-lg" 
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button 
              variant="ghost" 
              className="w-full sm:w-auto px-8 py-4 text-lg" 
              onClick={() => navigate('/login')}
            >
              Log In to Your Account
            </Button>
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-6xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-green rounded-full blur-3xl"></div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue-dark mb-4">Everything you need for Agile</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stop juggling spreadsheets and fragmented tools. We've combined the essential elements of Scrum into one seamless experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Dynamic Backlog",
                description: "Effortlessly prioritize tasks and refine your product vision with a powerful, flexible backlog manager.",
                icon: "📋",
                color: "bg-blue-50"
              },
              {
                title: "Intuitive Sprint Boards",
                description: "Visualize work flow and track velocity with drag-and-drop boards that keep your team aligned.",
                icon: " Kanban",
                color: "bg-green-50"
              },
              {
                title: "Ceremony Tracking",
                description: "Maintain a history of your sprint reviews and retrospectives to drive continuous improvement.",
                icon: "🕒",
                color: "bg-orange-50"
              }
            ].map((feature, idx) => (
              <div key={idx} className={`p-8 rounded-2xl border border-gray-100 transition-transform hover:-translate-y-2 duration-300 ${feature.color}`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-brand-blue-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue-dark mb-4">How it Works</h2>
          <p className="text-gray-600">Get your project off the ground in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
          
          {[
            { step: "01", title: "Create Project", desc: "Set up your project space and invite your team members to collaborate." },
            { step: "02", title: "Plan Sprint", desc: "Move high-priority items from the backlog into your current sprint." },
            { step: "03", title: "Execute & Deliver", desc: "Move tasks across the board and mark them as deployed upon completion." }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold mb-6 shadow-md ring-4 ring-brand-neutral-bg">
                {step.step}
              </div>
              <h3 className="text-xl font-bold text-brand-blue-dark mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="font-bold text-brand-blue-dark">ScrumFlow</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ScrumFlow Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button onClick={() => {}} className="text-gray-400 hover:text-brand-blue transition-colors text-sm">Privacy Policy</button>
            <button onClick={() => {}} className="text-gray-400 hover:text-brand-blue transition-colors text-sm">Terms of Service</button>
          </div>
        </div>
      </footer}
    </div>
  );
};

export default LandingPage;
