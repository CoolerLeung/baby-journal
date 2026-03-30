import { Bell, Calendar, ChevronDown, CircleUser, Heart, MessageCircle, Plus, Quote, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { timelineMonths, timelinePebbles } from '../data/memories';
import type { TimelineMemoryCard } from '../types/memory';

type TimelineViewProps = {
  onAddMemory: () => void;
  onOpenMemory: (id: string) => void;
};

type AugustGridCardProps = {
  key?: string;
  card: TimelineMemoryCard;
  onOpenMemory: (id: string) => void;
};

function AugustGridCard({
  card,
  onOpenMemory,
}: AugustGridCardProps) {
  if (card.variant === 'featured') {
    return (
      <div className="lg:col-span-2 group cursor-pointer" onClick={() => onOpenMemory(card.id)}>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow transition-transform hover:-translate-y-1 duration-300">
          <div className="grid grid-cols-5 h-[400px]">
            <div className="col-span-3 h-full">
              <img
                alt={card.title}
                className="w-full h-full object-cover"
                src={card.image}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-2 p-8 flex flex-col justify-between bg-surface-container-lowest">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {card.category}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">{card.date}</span>
                </div>
                <h4 className="text-2xl font-headline font-bold text-on-surface mb-3 leading-tight">
                  {card.title}
                </h4>
                <p className="text-on-surface-variant font-body leading-relaxed line-clamp-4">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current" /> {card.likes}
                </span>
                <span className="text-xs font-bold text-stone-400 flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 fill-current" /> {card.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (card.variant === 'standard') {
    return (
      <div
        className="bg-surface-container-lowest rounded-2xl editorial-shadow p-6 flex flex-col gap-4 group transition-transform hover:-translate-y-1 duration-300 cursor-pointer"
        onClick={() => onOpenMemory(card.id)}
      >
        <div className="aspect-square rounded-xl overflow-hidden">
          <img
            alt={card.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={card.image}
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-wider rounded-full">
              {card.category}
            </span>
            <span className="text-xs text-stone-400 font-medium">{card.date}</span>
          </div>
          <h4 className="text-lg font-headline font-bold text-on-surface mb-2">{card.title}</h4>
          <p className="text-sm text-on-surface-variant font-body leading-relaxed line-clamp-2">
            {card.description}
          </p>
        </div>
      </div>
    );
  }

  if (card.variant === 'quote') {
    return (
      <div
        className="bg-[#ffe07d] rounded-2xl p-10 flex flex-col justify-center items-center text-center editorial-shadow transition-transform hover:-translate-y-1 duration-300 cursor-pointer"
        onClick={() => onOpenMemory(card.id)}
      >
        <Quote className="w-10 h-10 text-on-secondary-container mb-4 fill-current" />
        <h4 className="text-2xl font-headline font-extrabold text-on-secondary-container leading-tight mb-4 italic">
          {card.quote}
        </h4>
        <p className="text-on-secondary-fixed-variant font-body text-sm max-w-[200px]">
          {card.description}
        </p>
        <span className="mt-6 text-[10px] font-bold text-on-secondary-fixed-variant uppercase tracking-widest">
          {card.date}
        </span>
      </div>
    );
  }

  if (card.variant === 'portrait') {
    return (
      <div className="lg:col-span-1 row-span-1 cursor-pointer" onClick={() => onOpenMemory(card.id)}>
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden h-full flex flex-col editorial-shadow transition-transform hover:-translate-y-1 duration-300">
          <div className="h-64 overflow-hidden">
            <img
              alt={card.title}
              className="w-full h-full object-cover"
              src={card.image}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider rounded-full">
                {card.category}
              </span>
              <span className="text-xs text-stone-400 font-medium">{card.date}</span>
            </div>
            <h4 className="text-lg font-headline font-bold text-on-surface mb-2">{card.title}</h4>
            <p className="text-sm text-on-surface-variant font-body leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

type OverlayCardProps = {
  key?: string;
  card: Extract<TimelineMemoryCard, { variant: 'overlay' }>;
  onOpenMemory: (id: string) => void;
};

function OverlayCard({
  card,
  onOpenMemory,
}: OverlayCardProps) {
  return (
    <div
      className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low group relative cursor-pointer"
      onClick={() => onOpenMemory(card.id)}
    >
      <img
        alt={card.alt}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        src={card.image}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white font-headline font-bold">{card.title}</p>
        <p className="text-white/80 text-xs font-body">{card.date}</p>
      </div>
    </div>
  );
}

export default function TimelineView({ onAddMemory, onOpenMemory }: TimelineViewProps) {
  const [august, july] = timelineMonths;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="timeline"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen"
      >
        <header className="sticky top-0 w-full z-40 bg-[#fbf9f5]/80 dark:bg-stone-950/80 backdrop-blur-xl flex justify-between items-center px-8 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#41684a] dark:text-[#c1edc8] font-headline">
              Timeline
            </h2>
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full text-sm text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors">
              <Calendar className="w-4 h-4" />
              <span>All Time</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Search memories..."
                className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container focus:outline-none w-64 text-sm font-body"
              />
            </div>
            <div className="flex items-center gap-4 text-[#41684a]">
              <Bell className="w-6 h-6 cursor-pointer hover:text-primary-dim transition-colors" />
              <CircleUser className="w-6 h-6 cursor-pointer hover:text-primary-dim transition-colors" />
            </div>
          </div>
        </header>

        <div className="px-10 py-12 max-w-7xl mx-auto">
          <section className="mb-14">
            <div className="flex items-baseline gap-4 mb-10">
              <h3 className="text-4xl font-headline font-extrabold text-on-surface">
                {august.month}
              </h3>
              <span className="text-xl font-headline text-stone-400">{august.year}</span>
              <div className="h-[2px] flex-grow bg-surface-container-high rounded-full ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {august.cards.map((card) => (
                <AugustGridCard key={card.id} card={card} onOpenMemory={onOpenMemory} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-baseline gap-4 mb-10">
              <h3 className="text-4xl font-headline font-extrabold text-on-surface">
                {july.month}
              </h3>
              <span className="text-xl font-headline text-stone-400">{july.year}</span>
              <div className="h-[2px] flex-grow bg-surface-container-high rounded-full ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {july.cards.map((card) => (
                <OverlayCard
                  key={card.id}
                  card={card as Extract<TimelineMemoryCard, { variant: 'overlay' }>}
                  onOpenMemory={onOpenMemory}
                />
              ))}
            </div>
          </section>
        </div>

        <button
          onClick={onAddMemory}
          className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform z-50"
        >
          <Plus className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-on-surface text-surface text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Quick Record
          </span>
        </button>

        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center hidden xl:flex">
          <div className="w-1 h-32 bg-surface-container-high rounded-full relative">
            <div className="absolute top-0 left-0 w-full h-1/4 bg-primary rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            {timelinePebbles.map((label, index) => (
              <div
                key={label}
                className={
                  index === 0
                    ? 'w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer hover:brightness-95 transition-all'
                    : 'w-10 h-10 rounded-full bg-white text-stone-400 flex items-center justify-center text-[10px] font-bold border border-surface-container-low cursor-pointer hover:bg-stone-50 transition-all'
                }
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
