import { ArrowLeft, ArrowRight, ChevronRight, Edit2, ImagePlus, MapPin, MoreVertical, Music, Pause, Printer, Share2, Sun, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { MemoryDetail } from '../types/memory';

type MemoryDetailViewProps = {
  memory: MemoryDetail;
  onBack: () => void;
};

export default function MemoryDetailView({ memory, onBack }: MemoryDetailViewProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={memory.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen px-10 py-8 max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
            <span className="cursor-pointer hover:text-stone-800 transition-colors" onClick={onBack}>
              Journal
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-800">{memory.breadcrumbLabel}</span>
          </div>
          <div className="flex items-center gap-6 text-stone-600">
            <Music className="w-5 h-5 cursor-pointer hover:text-stone-900 transition-colors" />
            <Share2 className="w-5 h-5 cursor-pointer hover:text-stone-900 transition-colors" />
            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-stone-900 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-sm">
              <img
                src={memory.mainImage}
                alt={memory.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-white/20 backdrop-blur-md rounded-2xl p-3 text-white text-xs font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{memory.location}</span>
                </div>
                <div className="bg-yellow-400/90 text-yellow-950 px-3 py-1 rounded-full font-bold">
                  {memory.camera}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {memory.galleryImages.map((image, index) => (
                <div
                  key={image}
                  className={
                    index === 0
                      ? 'w-20 h-20 rounded-2xl overflow-hidden cursor-pointer ring-2 ring-primary ring-offset-2'
                      : 'w-20 h-20 rounded-2xl overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity'
                  }
                >
                  <img
                    src={image}
                    alt={`${memory.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
              <div className="w-20 h-20 rounded-2xl bg-stone-200 flex items-center justify-center cursor-pointer hover:bg-stone-300 transition-colors text-stone-500">
                <ImagePlus className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white rounded-[2rem] p-10 shadow-sm flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#fde68a] text-yellow-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide mb-6 self-start">
              <Sun className="w-4 h-4" />
              {memory.dateLabel}
            </div>

            <h1 className="text-5xl font-headline font-extrabold text-stone-900 leading-tight mb-4">
              {memory.title}
            </h1>

            <div className="text-sm text-stone-500 font-medium mb-8">
              Written by {memory.author} • {memory.time}
            </div>

            <div className="bg-[#f5f5f0] rounded-2xl p-4 flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 bg-[#41684a] text-white rounded-full flex items-center justify-center hover:bg-[#34533b] transition-colors">
                  <Pause className="w-5 h-5 fill-current" />
                </button>
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                    Now Playing
                  </p>
                  <p className="text-sm font-bold text-stone-800">{memory.audioTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-60">
                <div className="w-1 h-4 bg-[#41684a] rounded-full animate-pulse" />
                <div className="w-1 h-6 bg-[#41684a] rounded-full animate-pulse delay-75" />
                <div className="w-1 h-3 bg-[#41684a] rounded-full animate-pulse delay-150" />
                <div className="w-1 h-5 bg-[#41684a] rounded-full animate-pulse delay-200" />
              </div>
            </div>

            <div className="prose prose-stone prose-p:leading-relaxed prose-p:text-stone-600 mb-10">
              {memory.body.map((paragraph) => (
                <p key={paragraph} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-12">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-stone-100 text-stone-600 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <button className="flex-1 bg-[#41684a] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#34533b] transition-colors">
                <Edit2 className="w-5 h-5" />
                Edit Entry
              </button>
              <button className="w-14 h-14 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="w-14 h-14 bg-stone-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="w-14 h-14 bg-white shadow-md text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors absolute right-10 bottom-32 xl:static xl:shadow-none xl:bg-stone-100 xl:hover:bg-stone-200">
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={onBack}>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-stone-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-stone-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Previous Memory
              </p>
              <p className="text-sm font-bold text-stone-800">{memory.previousLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 cursor-pointer group text-right" onClick={onBack}>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                Next Memory
              </p>
              <p className="text-sm font-bold text-stone-800">{memory.nextLabel}</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-stone-50 transition-colors">
              <ArrowRight className="w-5 h-5 text-stone-600" />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
