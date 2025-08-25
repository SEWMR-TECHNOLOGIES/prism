import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/layout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Tasks from '@/pages/Tasks';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<div className="p-8 text-center text-muted-foreground">Calendar coming soon...</div>} />
            <Route path="/goals" element={<div className="p-8 text-center text-muted-foreground">Goals coming soon...</div>} />
            <Route path="/archive" element={<div className="p-8 text-center text-muted-foreground">Archive coming soon...</div>} />
            <Route path="/settings" element={<div className="p-8 text-center text-muted-foreground">Settings coming soon...</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
