import { Bold, Calendar, ChevronDown, Cloud, ImagePlus, Italic, Lightbulb, Link as LinkIcon, List, Network, Smile, Sparkles, Wand2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState, useRef } from 'react';
import { uploadApi, recordsApi } from '../lib/api';

type AddMemoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddMemoryModal({ isOpen, onClose }: AddMemoryModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ src: string; name: string; size: string }[]>([]);
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles).slice(0, 10);
    setFiles(arr);
    setPreviews(arr.map((f) => ({ src: URL.createObjectURL(f), name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB' })));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSave = async () => {
    if (!title) { setError('Please enter a title'); return; }
    setError('');
    let mediaIds: string[] = [];

    if (files.length > 0) {
      setUploading(true);
      setUploadProgress(0);
      const res = await uploadApi.upload(files, (pct) => setUploadProgress(pct));
      setUploading(false);
      if (!res.ok) { setError('Upload failed: ' + res.error); return; }
      mediaIds = res.data.map((m: any) => m.id);
    }

    setSaving(true);
    const res = await recordsApi.create({ date, title, memo: memo || undefined, mediaType: undefined, mediaIds: mediaIds.length > 0 ? mediaIds : undefined });
    setSaving(false);
    if (res.ok) {
      setFiles([]);
      setPreviews([]);
      setTitle('');
      setMemo('');
      onClose();
    } else {
      setError(res.error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }} className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <div className="bg-surface-container-lowest w-full rounded-[2rem] shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
              <div className="px-8 py-6 flex justify-between items-center border-b border-surface-container-high">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"><Sparkles className="w-6 h-6 fill-current" /></div>
                  <div>
                    <h2 className="text-xl font-headline font-bold text-on-surface">Add New Memory</h2>
                    <p className="text-sm text-on-surface-variant font-body">Capture a moment in Baby&apos;s Journey</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors"><X className="w-6 h-6 text-on-surface-variant" /></button>
              </div>

              <div className="flex flex-col lg:flex-row overflow-y-auto">
                <div className="p-8 flex-1 lg:border-r border-surface-container-high flex flex-col gap-6">
                  <div className="flex justify-between items-end">
                    <h3 className="font-headline font-bold text-on-surface">Media Assets</h3>
                    <span className="text-xs font-bold text-on-surface-variant">{files.length} / 10 Selected</span>
                  </div>

                  <div
                    ref={dragRef}
                    className="border-2 border-dashed border-outline-variant rounded-3xl p-10 flex flex-col items-center justify-center gap-3 text-center bg-surface-container-lowest cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-container/50 text-primary flex items-center justify-center mb-2"><ImagePlus className="w-6 h-6" /></div>
                    <p className="font-headline font-bold text-on-surface">Drag &amp; Drop Photos<br /><span className="font-normal text-sm text-on-surface-variant">or <span className="underline font-bold">browse files</span></span></p>
                    <p className="text-[10px] font-bold text-outline uppercase tracking-wider mt-2">Up to 10 photos or 1 video (max 500mb)</p>
                    <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                  </div>

                  {uploading && (
                    <div className="w-full bg-surface-container-high rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}

                  {error && <p className="text-red-500 text-xs">{error}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    {previews.map((img, i) => (
                      <div key={img.src + i} className="relative rounded-2xl overflow-hidden aspect-square group">
                        <img src={img.src} className="w-full h-full object-cover" alt={img.name} />
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">{img.size}</div>
                        <button onClick={() => { setFiles(files.filter((_, j) => j !== i)); setPreviews(previews.filter((_, j) => j !== i)); }} className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2"><Calendar className="w-3 h-3" /> Memory Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 bg-surface-container-low px-4 py-3 rounded-xl text-sm font-bold text-on-surface" />
                  </div>

                  <input type="text" placeholder="Give this memory a title..." value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-headline font-bold text-on-surface placeholder:text-outline-variant w-full bg-transparent border-none focus:outline-none mt-2" />

                  <div className="border border-surface-container-high rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[200px]">
                    <div className="bg-surface-container-lowest border-b border-surface-container-high p-3 flex gap-4 text-on-surface-variant items-center">
                      <Bold className="w-4 h-4" /><Italic className="w-4 h-4" /><List className="w-4 h-4" /><div className="w-px h-4 bg-surface-container-high mx-1" /><Smile className="w-4 h-4" /><LinkIcon className="w-4 h-4" />
                    </div>
                    <textarea placeholder="Write the story behind these photos..." value={memo} onChange={(e) => setMemo(e.target.value)} className="flex-1 p-4 bg-surface-container-lowest resize-none focus:outline-none text-sm font-body text-on-surface" />
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center"><Network className="w-5 h-5" /></div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Visibility</p>
                        <p className="text-xs text-on-surface-variant">Family Circle Only</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-primary hover:text-primary-dim transition-colors">Change</button>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low px-8 py-6 flex justify-between items-center border-t border-surface-container-high">
                <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider"><Cloud className="w-4 h-4" /> Auto-syncing to cloud vault</div>
                <div className="flex items-center gap-6">
                  <button onClick={onClose} className="text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={saving || uploading} className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all editorial-shadow disabled:opacity-50">
                    {saving ? 'Saving...' : uploading ? `Uploading ${uploadProgress}%` : 'Save Memory'}
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-10 bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full flex items-center gap-2 shadow-xl z-50">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-bold">Draft Autosaved</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
