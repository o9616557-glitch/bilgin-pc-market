"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }: { images: any[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!images || images.length === 0) return <div className="text-slate-500 text-xs p-6">Resim Bulunamadı</div>;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextModalImage = () => {
    setModalCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevModalImage = () => {
    setModalCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const openModal = () => {
    setModalCurrentIndex(currentIndex);
    setIsModalOpen(true);
  };

  const onTouchStart = (e: React.TouchEvent, target: 'gallery' | 'modal') => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (target: 'gallery' | 'modal') => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;  
    const isRightSwipe = distance < -50; 

    if (isLeftSwipe) {
      target === 'gallery' ? nextImage() : nextModalImage();
    }
    if (isRightSwipe) {
      target === 'gallery' ? prevImage() : prevModalImage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      
      {/* ANA BÜYÜK RESİM KUTUSU */}
      <div 
        className="relative group bg-[#0b0f1a] rounded-[2rem] p-6 md:p-8 border border-slate-800/50 flex items-center justify-center shadow-inner overflow-hidden aspect-square cursor-pointer"
        onTouchStart={(e) => onTouchStart(e, 'gallery')}
        onTouchMove={onTouchMove}
        onTouchEnd={() => onTouchEnd('gallery')}
      >
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }} 
              className="absolute left-3 md:left-5 z-10 bg-black/40 hover:bg-blue-600 border border-white/10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all opacity-60 hover:opacity-100 shadow-lg active:scale-90"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }} 
              className="absolute right-3 md:right-5 z-10 bg-black/40 hover:bg-blue-600 border border-white/10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full backdrop-blur-md transition-all opacity-60 hover:opacity-100 shadow-lg active:scale-90"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </>
        )}

        {/* İŞTE BURASI ŞEFİM: RESMİN KENDİSİNE DE 'rounded-2xl' EKLEDİK */}
        <img 
          key={currentIndex} 
          src={images[currentIndex].src} 
          alt={productName} 
          onClick={openModal}
          className="w-full h-full object-contain rounded-2xl transition-all duration-300 animate-in fade-in"
        />
      </div>

      {/* BÜYÜK EKRAN PENCERESİ (MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center p-4 md:p-10 transition-all animate-in fade-in">
          
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 z-50 bg-white/10 hover:bg-red-600 w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 transition-all shadow-xl active:scale-90"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div 
            className="relative w-full max-w-7xl h-full flex items-center justify-center group"
            onTouchStart={(e) => onTouchStart(e, 'modal')}
            onTouchMove={onTouchMove}
            onTouchEnd={() => onTouchEnd('modal')}
          >
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevModalImage} 
                  className="absolute left-3 md:left-6 z-10 bg-white/5 hover:bg-blue-600 border border-white/10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl backdrop-blur-lg transition-all opacity-80 hover:opacity-100 shadow-2xl active:scale-90"
                >
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <button 
                  onClick={nextModalImage} 
                  className="absolute right-3 md:right-6 z-10 bg-white/5 hover:bg-blue-600 border border-white/10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl backdrop-blur-lg transition-all opacity-80 hover:opacity-100 shadow-2xl active:scale-90"
                >
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </>
            )}

            <img 
              key={modalCurrentIndex} 
              src={images[modalCurrentIndex].src} 
              alt={`${productName} - Büyük`} 
              className="w-auto h-auto max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}