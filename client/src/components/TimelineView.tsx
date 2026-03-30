import { Bell, Calendar, ChevronDown, CircleUser, Heart, MessageCircle, Plus, Quote, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { recordsApi } from '../lib/api';

type TimelineViewProps = {
  onAddMemory: () => void;
  onOpenMemory: (id: string) => void;
};

type Card = {
  id: string;
  variant: 'featured' | 'standard' | 'quote' | 'portrait' | 'overlay';
  category?: string;
  date: string;
  title?: string;
  description?: string;
  image: string;
  quote?: string;
  likes?: number;
  comments?: number;
  alt?: string;
};

type MonthGroup = { month: string; year: string; cards: Card[] };

function recordToCard(r: any, index: number): Card {
  const img = r.cover?.url || r.cover?.thumbUrl || `https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Photo`;
  if (index === 0) {
    return { id: String(r.id), variant: 'featured', category: r.mediaType || 'Milestone', date: r.date, title: r.title, description: r.memo || '', image: img, likes: 0, comments: 0 };
  }
  if (index % 5 === 0) {
    return { id: String(r.id), variant: 'portrait', category: 'Portrait', date: r.date, title: r.title, description: r.memo || '', image: img };
  }
  if (index % 7 === 0) {
    return { id: String(r.id), variant: 'quote', quote: `"${r.title}"`, description: r.memo || '', date: r.date };
  }
  if (index % 3 === 0) {
    return { id: String(r.id), variant: 'overlay', title: r.title, date: r.date, image: img, alt: r.title };
  }
  return { id: String(r.id), variant: 'standard', category: r.mediaType || 'Daily', date: r.date, title: r.title, description: r.memo || '', image: img };
}

function groupByMonth(records: any[]): MonthGroup[] {
  const map = new Map<string, Card[]>();
  records.forEach((r, i) => {
    const d = new Date(r.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthName = d.toLocaleString('en-US', { month: 'long' });
    const year = String(d.getFullYear());
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(recordToCard(r, i));
  });
  return Array.from(map.entries()).map(([key, cards]) => {
    const [yearStr, monthStr] = key.split('-');
    const d = new Date(Number(yearStr), Number(monthStr) - 1);
    return { month: d.toLocaleString('en-US', { month: 'long' }), year: yearStr, cards };
  });
}

type AugustGridCardProps = {
  card: Card;
  onOpenMemory: (id: string) => void;
};

function AugustGridCard({ card, onOpenMemory }: AugustGridCardProps) {
  if (card.variant === 'featured') {
    return (
      <div className="lg:col-span-2 group cursor-pointer" onClick={() => onOpenMemory(card.id)}>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow transition-transform hover:-translate-y-1 duration-300">
          <div className="grid grid-cols-5 h-[400px]">
            <div className="col-span-3 h-full">
              <img alt={card.title} className="w-full h-full object-cover" src={card.image} referrerPolicy="no-referrer" />
            </div>
            <div className="col-span-2 p-8 flex flex-col justify-between bg-surface-container-lowest">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider rounded-full">{card.category}</span>
                  <span className="text-xs text-stone-400 font-medium">{card.date}</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-on-surface mb-3 leading-tight">{card.title}</h4>
                <p className="text-on-surface-variant font-body leading-relaxed line-clamp-4">{card.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-primary flex items-center gap-1"><Heart className="w-4 h-4 fill-current" /> {card.likes}</span>
                <span className="text-xs font-bold text-stone-400 flex items-center gap-1"><MessageCircle className="w-4 h-4 fill-current" /> {card.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (card.variant === 'standard') {
    return (
      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow p-6 flex flex-col gap-4 group transition-transform hover:-translate-y-1 duration-300 cursor-pointer" onClick={() => onOpenMemory(card.id)}>
        <div className="aspect-square rounded-xl overflow-hidden">
          <img alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={card.image} referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-wider rounded-full">{card.category}</span>
            <span className="text-xs text-stone-400 font-medium">{card.date}</span>
          </div>
          <h4 className="text-lg font-headline font-bold text-on-surface mb-2">{card.title}</h4>
          <p className="text-sm text-on-surface-variant font-body leading-relaxed line-clamp-2">{card.description}</p>
        </div>
      </div>
    );
  }
  if (card.variant === 'quote') {
    return (
      <div className="bg-[#ffe07d] rounded-2xl p-10 flex flex-col justify-center items-center text-center editorial-shadow transition-transform hover:-translate-y-1 duration-300 cursor-pointer" onClick={() => onOpenMemory(card.id)}>
        <Quote className="w-10 h-10 text-on-secondary-container mb-4 fill-current" />
        <h4 className="text-2xl font-headline font-extrabold text-on-secondary-container leading-tight mb-4 italic">{card.quote}</h4>
        <p className="text-on-secondary-fixed-variant font-body text-sm max-w-[200px]">{card.description}</p>
        <span className="mt-6 text-[10px] font-bold text-on-secondary-fixed-variant uppercase tracking-widest">{card.date}</span>
      </div>
    );
  }
  if (card.variant === 'portrait') {
    return (
      <div className="lg:col-span-1 row-span-1 cursor-pointer" onClick={() => onOpenMemory(card.id)}>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden h-full flex flex-col editorial-shadow transition-transform hover:-translate-y-1 duration-300">
          <div className="h-64 overflow-hidden">
            <img alt={card.title} className="w-full h-full object-cover" src={card.image} referrerPolicy="no-referrer" />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider rounded-full">{card.category}</span>
              <span className="text-xs text-stone-400 font-medium">{card.date}</span>
            </div>
            <h4 className="text-lg font-headline font-bold text-on-surface mb-2">{card.title}</h4>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">{card.description}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function OverlayCard({ card, onOpenMemory }: { card: Card; onOpenMemory: (id: string) => void }) {
  return (
    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low group relative cursor-pointer" onClick={() => onOpenMemory(card.id)}>
      <img alt={card.alt || card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={card.image} referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white font-headline font-bold">{card.title}</p>
        <p className="text-white/80 text-xs font-body">{card.date}</p>
      </div>
    </div>
  );
}

export default function TimelineView({ onAddMemory, onOpenMemory }: TimelineViewProps) {
  const [months, setMonths] = useState<MonthGroup[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadRecords = async (p: number, append = false) => {
    setLoading(true);
    const res = await recordsApi.list(p, 20);
    if (res.ok) {
      const newRecords = res.data || [];
      const allRecords = append ? [...(months.flatMap((m) => m.cards) || []), ...newRecords] : newRecords;
      setMonths(groupByMonth(allRecords));
      setHasMore(newRecords.length === 20);
    }
    setLoading(false);
  };

  useEffect(() => { loadRecords(1); }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadRecords(nextPage, true);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div key="timeline" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="w-full min-h-screen">
        <header className="sticky top-0 w-full z-40 bg-[#fbf9f5]/80 dark:bg-stone-950/80 backdrop-blur-xl flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#41684a] dark:text-[#c1edc8] font-headline">Timeline</h2>
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full text-sm text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors">
              <Calendar className="w-4 h-4" />
              <span>All Time</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input type="text" placeholder="Search memories..." className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container focus:outline-none w-64 text-sm font-body" />
            </div>
            <div className="flex items-center gap-4 text-[#41684a]">
              <Bell className="w-6 h-6 cursor-pointer hover:text-primary-dim transition-colors" />
              <CircleUser className="w-6 h-6 cursor-pointer hover:text-primary-dim transition-colors" />
            </div>
          </div>
        </header>

        <div className="px-10 py-12 max-w-7xl mx-auto">
          {months.map((m) => (
            <section key={`${m.year}-${m.month}`} className="mb-14">
              <div className="flex items-baseline gap-4 mb-10">
                <h3 className="text-4xl font-headline font-extrabold text-on-surface">{m.month}</h3>
                <span className="text-xl font-headline text-stone-400">{m.year}</span>
                <div className="h-[2px] flex-grow bg-surface-container-high rounded-full ml-4" />
              </div>
              {m.cards.some((c) => c.variant === 'overlay') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {m.cards.map((card) =>
                    card.variant === 'overlay' ? (
                      <OverlayCard key={card.id} card={card} onOpenMemory={onOpenMemory} />
                    ) : (
                      <AugustGridCard key={card.id} card={card} onOpenMemory={onOpenMemory} />
                    )
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {m.cards.map((card) => (
                    <AugustGridCard key={card.id} card={card} onOpenMemory={onOpenMemory} />
                  ))}
                </div>
              )}
            </section>
          ))}

          {loading && <p className="text-center text-stone-400 py-8">Loading...</p>}
          {!loading && hasMore && (
            <div className="text-center py-8">
              <button onClick={loadMore} className="px-6 py-3 bg-surface-container-low rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                Load More
              </button>
            </div>
          )}
          {!loading && months.length === 0 && (
            <div className="text-center py-20 text-stone-400">
              <p className="text-lg mb-2">No memories yet</p>
              <p className="text-sm">Click the + button to add your first memory!</p>
            </div>
          )}
        </div>

        <button onClick={onAddMemory} className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform z-50">
          <Plus className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-on-surface text-surface text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Quick Record</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
