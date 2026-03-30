import { Activity, Home, Image as ImageIcon, PlusCircle, Settings, TrendingUp } from 'lucide-react';
import { sidebarProfile } from '../data/memories';

type SidebarProps = {
  onAddMemory: () => void;
};

const navItems = [
  { label: 'Home', icon: Home, active: false },
  { label: 'Timeline', icon: Activity, active: true },
  { label: 'Gallery', icon: ImageIcon, active: false },
  { label: 'Growth', icon: TrendingUp, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

export default function Sidebar({ onAddMemory }: SidebarProps) {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r-0 bg-[#f5f3ef] dark:bg-stone-900 flex flex-col p-6 gap-8 z-50">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-[#41684a] dark:text-[#c1edc8] font-headline">
          Shiguang Shouzhang
        </h1>
        <p className="text-xs text-stone-500 font-medium">The Living Scrapbook</p>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm">
          <img
            alt="Baby Profile Picture"
            className="w-full h-full object-cover"
            src={sidebarProfile.image}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center">
          <p className="font-headline font-bold text-on-surface">{sidebarProfile.name}</p>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
            {sidebarProfile.ageLabel}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map(({ label, icon: Icon, active }) => (
          <a
            key={label}
            href="#"
            className={
              active
                ? 'flex items-center gap-3 px-4 py-3 bg-white dark:bg-stone-800 text-[#41684a] dark:text-[#c1edc8] rounded-full shadow-sm font-headline text-sm font-medium scale-95 active:scale-90 transition-transform'
                : 'flex items-center gap-3 px-4 py-3 text-stone-600 dark:text-stone-400 font-headline text-sm font-medium hover:bg-white/50 dark:hover:bg-stone-800/50 transition-all duration-300 rounded-full'
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <button
        onClick={onAddMemory}
        className="w-full py-4 bg-primary text-on-primary rounded-xl font-headline font-bold flex items-center justify-center gap-2 editorial-shadow hover:brightness-110 transition-all"
      >
        <PlusCircle className="w-5 h-5" />
        Add Memory
      </button>
    </aside>
  );
}
