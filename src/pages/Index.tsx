import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Calendar, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';
import { ThemeToggle } from '@/components/ui/theme-toggle'; // ✅ Import ThemeToggle

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* ✅ Fixed ThemeToggle Button */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="gradient-accent absolute inset-0" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight animate-fade-in-down">
                Prism
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
                See your day from every angle — manage tasks, track events, and organize everything that matters in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/tasks">
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                  View Tasks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you plan, manage, and complete your tasks efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Task Management</h3>
              <p className="text-muted-foreground">
                Create, organize, and track tasks with categories, priorities, and due dates.
              </p>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Event Tracking</h3>
              <p className="text-muted-foreground">
                Never miss important deadlines, meetings, renewals, and personal events.
              </p>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your productivity with stats and completion insights.
              </p>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                <Zap className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Priority Management</h3>
              <p className="text-muted-foreground">
                Set priorities from urgent to low and focus on what matters most.
              </p>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <p className="text-muted-foreground">
                Organize tasks by work, personal, finance, health, or custom categories.
              </p>
            </div>

            <div className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow">
                <Target className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Reminders</h3>
              <p className="text-muted-foreground">
                Stay ahead with timely alerts for overdue tasks and upcoming deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-primary relative">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to take control of your day?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-white/90">
            Join thousands of users managing their tasks and events seamlessly with Prism.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Organizing Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Index;
