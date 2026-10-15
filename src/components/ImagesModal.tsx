import React, { useState } from 'react';
import { ChevronLeft, Image as ImageIcon, Upload, Trash2, Plus, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { MENU_ITEMS } from '../data/menuData.ts';

interface ImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImagesModal: React.FC<ImagesModalProps> = ({ isOpen, onClose }) => {
  const { images, saveImage, refreshImages, profile } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setIsUploading(true);
    const ok = await saveImage(imageUrl.trim(), title.trim() || 'Food Memory', category);
    setIsUploading(false);

    if (ok) {
      setImageUrl('');
      setTitle('');
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadForm(false);
      }, 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick preset food images to save to Cloudflare D1
  const presetFoodImages = MENU_ITEMS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Red Header */}
        <div className="bg-[#E32626] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <button
            onClick={onClose}
            aria-label="Back"
            className="p-1 -ml-1 hover:bg-white/10 rounded-lg active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight">Saved Food Images</h1>
            <p className="text-[10px] text-white/80">Stored in Cloudflare D1 SQL</p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="p-1 hover:bg-white/10 rounded-lg text-white"
            title="Upload image"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 pb-20">
          {/* Cloudflare D1 Sync Banner */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-start space-x-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Cloudflare D1 SQL Active</div>
              <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                All food photos, favorite items, and meal receipts are stored in your Cloudflare D1 SQL database.
              </p>
            </div>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <form onSubmit={handleSaveImage} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700">
                Save Image to Cloudflare D1
              </h3>

              {/* File upload input */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Upload From Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-zinc-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E32626] file:text-white hover:file:bg-red-700 cursor-pointer"
                />
              </div>

              {/* Or paste Image URL */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Or Paste Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/burger.jpg"
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Juicy Double Smash Feast"
                  className="w-full text-xs p-2 rounded-lg border border-zinc-300 bg-white"
                />
              </div>

              {imageUrl && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex space-x-2 pt-1">
                <button
                  type="submit"
                  disabled={isUploading || !imageUrl}
                  className="flex-1 bg-[#E32626] disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs hover:bg-red-700 active:scale-98 transition-all flex items-center justify-center space-x-1"
                >
                  {uploadSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Saved to D1!</span>
                    </>
                  ) : isUploading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Save to Cloudflare D1</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="bg-zinc-200 text-zinc-700 text-xs font-bold px-3 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Quick Presets to Save */}
          {!showUploadForm && images.length === 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Quick-Save Menu Favorites to D1
              </div>
              <div className="grid grid-cols-2 gap-2">
                {presetFoodImages.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 border border-zinc-200 rounded-xl bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded-lg mb-1.5" />
                    <div className="font-bold text-[11px] text-zinc-900 truncate">{p.name}</div>
                    <button
                      type="button"
                      onClick={() => saveImage(p.image, p.name, 'menu')}
                      className="mt-1.5 w-full bg-red-50 text-[#E32626] hover:bg-[#E32626] hover:text-white font-bold text-[10px] py-1 rounded-md transition-colors"
                    >
                      Save to D1
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stored Images List */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Cloudflare D1 Gallery ({images.length})
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
                <p className="text-xs font-bold text-zinc-700">No images saved yet</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Upload a food photo or click quick-save above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-2xs"
                  >
                    <div className="aspect-square bg-zinc-100">
                      <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <div className="font-bold text-xs text-zinc-900 truncate">{img.title}</div>
                      <div className="text-[10px] text-zinc-400">
                        {new Date(img.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
