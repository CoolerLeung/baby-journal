import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AddMemoryModal from './components/AddMemoryModal';
import MemoryDetailView from './components/MemoryDetailView';
import Sidebar from './components/Sidebar';
import TimelineView from './components/TimelineView';

function AppContent() {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading...</div>;
  if (!user) return <LoginPage />;

  const refreshTimeline = () => setRefreshKey((k) => k + 1);

  return (
    <div className="font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex">
      <Sidebar onAddMemory={() => setIsModalOpen(true)} />
      <main className="ml-64 flex-1 min-h-screen relative overflow-x-hidden">
        {selectedMemoryId ? (
          <MemoryDetailView
            memoryId={selectedMemoryId}
            onBack={() => setSelectedMemoryId(null)}
          />
        ) : (
          <TimelineView
            key={refreshKey}
            onAddMemory={() => setIsModalOpen(true)}
            onOpenMemory={setSelectedMemoryId}
          />
        )}
      </main>
      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); refreshTimeline(); }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
