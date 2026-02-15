import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Book as BookIcon, FileText, Maximize2, Minimize2, Loader2, Globe, Monitor, Info, BookOpen, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Settings2, CheckCircle } from 'lucide-react';
import { Book } from '../types';
import { COLORS, DDC_CATEGORIES } from '../constants';
import { Document, Page, pdfjs } from 'react-pdf';

// Robust worker configuration
// Ensure we have a valid version for the worker URL
const pdfVersion = pdfjs.version || '4.4.168'; 
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;

interface BookDetailProps {
  book: Book;
  onBack: () => void;
  onFinishBook: (bookId: number) => void;
  isFinished: boolean;
}

type ViewerMode = 'custom' | 'native' | 'google';

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack, onFinishBook, isFinished }) => {
  const [imgError, setImgError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewerMode, setViewerMode] = useState<ViewerMode>('custom');
  
  // Custom Reader State
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<'info' | 'reader'>('info');

  useEffect(() => {
    setPdfLoading(true);
    setViewerMode('custom'); 
    setMobileTab('info'); 
    setImgError(false);
    setPageNumber(1);
    setScale(1.0);
  }, [book]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isFullScreen, mobileTab]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
  };

  const getBookCoverColor = (ddc: string) => {
    const category = DDC_CATEGORIES.find(c => c.code === ddc);
    return category ? category.color : COLORS.primary;
  };

  const getProcessedCoverUrl = (url: string) => {
    if (!url) return "";
    try {
      if (url.includes('drive.google.com')) {
        const idMatch = url.match(/\/d\/([^/?]+)/) || url.match(/id=([^&]+)/);
        if (idMatch && idMatch[1]) {
          return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
        }
      }
      if (url.includes('dropbox.com')) {
        return url.replace('?dl=0', '?raw=1').replace('?dl=1', '?raw=1');
      }
    } catch (e) {
      return url;
    }
    return url;
  };

  const cycleViewerMode = () => {
    if (viewerMode === 'custom') setViewerMode('native');
    else if (viewerMode === 'native') setViewerMode('google');
    else setViewerMode('custom');
    setPdfLoading(true);
  };

  const getViewerUrl = () => {
    let url = book.pdfUrl;
    if (!url) return "";
    if (viewerMode === 'google') {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    }
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*/, '/preview').replace(/\/edit.*/, '/preview');
    }
    if (url.includes('dropbox.com')) {
      return url.replace('?dl=0', '').replace('?dl=1', '') + '?raw=1';
    }
    return url;
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  const handlePageChange = (offset: number) => {
    setPageNumber(prev => Math.min(Math.max(prev + offset, 1), numPages));
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageNumber(Number(e.target.value));
  };

  // Robust file URL handling to prevent "Invalid PDF url data" errors
  const file = useMemo(() => {
    if (!book.pdfUrl) return null;
    
    try {
      // If it's a local file path (e.g. C:\Users...) entered by mistake, we can't load it in browser.
      // But we can try to treat it as a string.
      // Ideally, we want an absolute URL for the worker.
      
      const isAbsolute = /^(?:[a-z]+:)?\/\//i.test(book.pdfUrl) || book.pdfUrl.startsWith('data:');
      
      if (isAbsolute) {
        return { url: book.pdfUrl };
      }

      // Resolve relative path to absolute
      const absoluteUrl = new URL(book.pdfUrl, window.location.origin).toString();
      return { url: absoluteUrl };
      
    } catch (e) {
      console.warn("URL resolution failed, using raw string:", book.pdfUrl);
      return { url: book.pdfUrl };
    }
  }, [book.pdfUrl]);

  const displayCoverUrl = getProcessedCoverUrl(book.coverUrl);
  const showCoverImage = book.coverUrl && !imgError;

  return (
    <div className="animate-in fade-in zoom-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors active:scale-95 focus:outline-none rounded-lg p-1"
        >
          <ArrowLeft size={24} /> <span className="hidden sm:inline">Back</span>
        </button>

        {/* Finish Book Button */}
        <button
           onClick={() => onFinishBook(book.id)}
           disabled={isFinished}
           className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wide transition-all ${isFinished ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-800 text-white hover:bg-slate-700 shadow-lg active:scale-95'}`}
        >
           {isFinished ? (
               <><CheckCircle size={16} /> Completed</>
           ) : (
               <>Mark as Finished</>
           )}
        </button>
      </div>
      
      {/* Mobile Tabs */}
      <div 
        className="flex lg:hidden bg-white rounded-t-[30px] shadow-sm border-b border-slate-100 overflow-hidden mb-0"
      >
        <button 
          onClick={() => setMobileTab('info')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-colors ${mobileTab === 'info' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-50'}`}
        >
          <Info size={16} /> Info
        </button>
        <button 
          onClick={() => setMobileTab('reader')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-colors ${mobileTab === 'reader' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-50'}`}
        >
          <BookOpen size={16} /> Reader
        </button>
      </div>

      <div className={`bg-white lg:rounded-[40px] rounded-b-[30px] rounded-t-none lg:rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300 ${isFullScreen ? 'h-[calc(100vh-100px)]' : 'lg:min-h-[600px] lg:h-[calc(100vh-180px)] h-[80vh] lg:h-auto'}`}>
        
        {/* Left: Info Side */}
        <div 
          className={`${mobileTab === 'info' ? 'flex' : 'hidden'} lg:${isFullScreen ? 'hidden' : 'flex'} lg:w-1/3 bg-slate-50 p-6 lg:p-10 flex-col items-center border-r border-slate-100 overflow-y-auto h-full`}
        >
          <div 
            className="w-32 h-48 lg:w-48 lg:h-64 rounded-2xl shadow-2xl overflow-hidden mb-6 lg:mb-8 shrink-0 transition-transform hover:scale-105 duration-300" 
            style={!showCoverImage ? { backgroundColor: getBookCoverColor(book.ddc) } : {}}
          >
            {showCoverImage ? (
              <img 
                src={displayCoverUrl} 
                className="w-full h-full object-cover" 
                alt={book.title} 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-white flex-col gap-2 p-4 text-center">
                 <BookIcon size={48} className="opacity-50" />
                 <span className="text-xs font-black uppercase opacity-80">{book.title}</span>
              </div>
            )}
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-800 text-center mb-2 leading-tight">{book.title}</h2>
          <p className="text-slate-500 font-bold italic mb-6 lg:mb-8 text-sm lg:text-base">{book.author}</p>
          
          <button 
            onClick={() => setMobileTab('reader')}
            className="lg:hidden w-full py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-lg active:scale-95 transition-transform mb-6 flex items-center justify-center gap-2"
          >
             <BookOpen size={20} /> Read Now
          </button>

          <div className="w-full space-y-3 lg:space-y-4 mt-auto">
            <div className="p-4 lg:p-5 bg-white rounded-2xl lg:rounded-3xl flex justify-between items-center text-xs font-bold shadow-sm border border-slate-100">
              <span className="text-slate-400">CATEGORY</span>
              <span className="text-indigo-600 font-black">DDC {book.ddc}</span>
            </div>
            <div className="p-4 lg:p-5 bg-white rounded-2xl lg:rounded-3xl flex justify-between items-center text-xs font-bold shadow-sm border border-slate-100">
              <span className="text-slate-400">PUBLISHED</span>
              <span className="text-slate-700 font-black">{book.year || "Unknown"}</span>
            </div>
          </div>
        </div>
        
        {/* Right: PDF Viewer Side */}
        <div 
          className={`${mobileTab === 'reader' ? 'flex' : 'hidden'} lg:flex ${isFullScreen ? 'w-full' : 'lg:w-2/3'} bg-slate-900 p-2 lg:p-4 flex-col relative group transition-all duration-300 h-full`}
        >
          {book.pdfUrl ? (
            <div className="w-full h-full flex flex-col">
              {/* Toolbar */}
              <div className="flex flex-wrap justify-between items-center mb-3 lg:mb-4 px-1 gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                
                <div className="flex items-center gap-2">
                   <button
                    onClick={cycleViewerMode}
                    className="p-2 rounded-lg transition-colors flex items-center gap-2 text-[10px] font-bold uppercase focus:outline-none bg-white/10 hover:bg-white/20 text-slate-300"
                   >
                     {viewerMode === 'custom' ? <Settings2 size={16} /> : viewerMode === 'native' ? <Monitor size={16} /> : <Globe size={16} />}
                     <span className="hidden sm:inline">
                        {viewerMode === 'custom' ? "Reader" : viewerMode === 'native' ? "Legacy" : "Google"}
                     </span>
                   </button>

                   <button 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors hidden lg:block"
                  >
                    {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </div>

                {viewerMode === 'custom' && (
                  <div className="flex items-center gap-3 flex-1 justify-center max-sm:hidden">
                    <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                      <button onClick={handleZoomOut} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white">
                        <ZoomOut size={14} />
                      </button>
                      <span className="text-[10px] font-mono text-slate-300 w-10 text-center">{Math.round(scale * 100)}%</span>
                      <button onClick={handleZoomIn} className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white">
                        <ZoomIn size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700 px-3">
                      <button disabled={pageNumber <= 1} onClick={() => handlePageChange(-1)} className="text-slate-400 hover:text-white disabled:opacity-30">
                        <ChevronLeft size={16} />
                      </button>
                      <div className="flex items-center gap-2">
                         <input 
                            type="range" 
                            min="1" 
                            max={numPages || 1} 
                            value={pageNumber} 
                            onChange={handleSliderChange}
                            className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                         />
                         <span className="text-[10px] font-mono text-slate-300 whitespace-nowrap">
                            {pageNumber} / {numPages || '--'}
                         </span>
                      </div>
                      <button disabled={pageNumber >= numPages} onClick={() => handlePageChange(1)} className="text-slate-400 hover:text-white disabled:opacity-30">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Toolbar */}
              {viewerMode === 'custom' && (
                <div className="sm:hidden flex flex-col gap-3 mb-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                   <div className="flex items-center justify-center gap-6 border-b border-white/5 pb-2">
                      <button onClick={handleZoomOut} className="p-2 bg-slate-800 rounded-lg text-slate-300">
                        <ZoomOut size={18} />
                      </button>
                      <span className="text-xs font-mono text-slate-300 font-bold">{Math.round(scale * 100)}%</span>
                      <button onClick={handleZoomIn} className="p-2 bg-slate-800 rounded-lg text-slate-300">
                        <ZoomIn size={18} />
                      </button>
                   </div>
                   
                   <div className="flex items-center gap-3 w-full">
                      <button onClick={() => handlePageChange(-1)} className="text-slate-400 p-1">
                        <ChevronLeft size={24}/>
                      </button>
                      <div className="flex-1 flex flex-col gap-1">
                        <input 
                            type="range" 
                            min="1" 
                            max={numPages || 1} 
                            value={pageNumber} 
                            onChange={handleSliderChange}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
                          <span>1</span>
                          <span>{pageNumber} / {numPages}</span>
                          <span>{numPages}</span>
                        </div>
                      </div>
                      <button onClick={() => handlePageChange(1)} className="text-slate-400 p-1">
                        <ChevronRight size={24}/>
                      </button>
                   </div>
                </div>
              )}

              <div 
                ref={containerRef}
                className="relative grow rounded-2xl bg-slate-100/5 overflow-auto shadow-inner flex justify-center p-4 no-scrollbar border border-white/5"
              >
                {pdfLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10">
                    <Loader2 className="animate-spin mb-4 text-[#DB8C29]" size={48} />
                    <p className="text-xs font-black uppercase tracking-widest opacity-60">Loading Document...</p>
                  </div>
                )}

                {viewerMode === 'custom' && file ? (
                  <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(err) => { console.error("PDF Load Error:", err); setPdfLoading(false); }}
                    loading={null}
                    className="flex flex-col items-center"
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      scale={scale} 
                      width={containerWidth ? Math.min(containerWidth - 40, 800) : undefined}
                      className="shadow-2xl mb-4"
                      renderAnnotationLayer={true}
                      renderTextLayer={true}
                    />
                  </Document>
                ) : viewerMode !== 'custom' ? (
                  <iframe 
                    src={getViewerUrl()} 
                    className="w-full h-full border-none bg-white rounded-xl" 
                    title={`PDF Reader for ${book.title}`}
                    allow="autoplay"
                    onLoad={() => setPdfLoading(false)}
                  />
                ) : (
                   <div className="m-auto text-center text-white opacity-40 space-y-4 py-20">
                     <FileText size={100} className="mx-auto" />
                     <p className="text-xl font-bold">PDF Unavailable</p>
                   </div>
                )}
              </div>
            </div>
          ) : (
            <div className="m-auto text-center text-white opacity-40 space-y-4 py-20 animate-pulse">
              <FileText size={100} className="mx-auto" />
              <p className="text-xl font-bold">PDF Unavailable</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;