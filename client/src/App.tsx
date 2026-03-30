import { useState } from 'react';
import AddMemoryModal from './components/AddMemoryModal';
import MemoryDetailView from './components/MemoryDetailView';
import Sidebar from './components/Sidebar';
import TimelineView from './components/TimelineView';
import { detailMemories } from './data/memories';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

  const selectedMemory = selectedMemoryId ? detailMemories[selectedMemoryId] : null;

  return (
    <div className="font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex">
      <Sidebar onAddMemory={() => setIsModalOpen(true)} />

      <main className="ml-64 flex-1 min-h-screen relative overflow-x-hidden">
        {selectedMemory ? (
          <MemoryDetailView
            memory={selectedMemory}
            onBack={() => setSelectedMemoryId(null)}
          />
        ) : (
          <TimelineView
            onAddMemory={() => setIsModalOpen(true)}
            onOpenMemory={setSelectedMemoryId}
          />
        )}
      </main>

      <AddMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
