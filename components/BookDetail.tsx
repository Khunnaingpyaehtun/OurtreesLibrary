import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Book as BookIcon,
  FileText,
  Maximize2,
  Minimize2,
  Loader2,
  Globe,
  Monitor,
  Info,
  BookOpen,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Settings2,
  CheckCircle,
  AlertTriangle,
  Sun,
  Moon,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Book } from "../types";
import { COLORS, DDC_CATEGORIES } from "../constants";
import { Document, Page, pdfjs } from "react-pdf";

// Fix for "Setting up fake worker failed"
// We use unpkg and explicitly point to the .mjs or .js worker file.
// For react-pdf v10+, it's safer to use the same version of pdfjs-dist.
if (typeof window !== "undefined") {
  // Using a robust CDN URL that resolves correctly as a full URL
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;
}

interface BookDetailProps {
  book: Book;
  onBack: () => void;
  onFinishBook: (bookId: number) => void;
  isFinished: boolean;
}

type ViewerMode = "custom" | "native" | "google";

const BookDetail: React.FC<BookDetailProps> = ({
  book,
  onBack,
  onFinishBook,
  isFinished,
}) => {
  const [imgError, setImgError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewerMode, setViewerMode] = useState<ViewerMode>("custom");

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfFile, setPdfFile] = useState<string | Blob | null>(null);
  const [mobileTab, setMobileTab] = useState<"info" | "reader">("info");

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setPdfLoading(true);
    setPdfError(null);
    setViewerMode("custom");
    setMobileTab("info");
    setImgError(false);
    setPageNumber(1);
    setScale(1.0);
    setPdfFile(null);

    let active = true;

    const loadPdf = async () => {
      if (!book.pdfUrl) {
        setPdfLoading(false);
        return;
      }

      try {
        const response = await fetch(book.pdfUrl);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const blob = await response.blob();
        if (active) setPdfFile(blob);
      } catch (error: any) {
        console.warn("PDF Fetch Error:", error);
        if (active) {
          // Fallback to direct URL
          setPdfFile(book.pdfUrl);
          if (
            error.message.includes("Failed to fetch") ||
            error.message.includes("404")
          ) {
            setPdfError(`ဖိုင်ရှာမတွေ့ပါ။ Link ကိုစစ်ဆေးပါ။`);
            setPdfLoading(false);
          }
        }
      }
    };

    loadPdf();
    return () => {
      active = false;
    };
  }, [book.pdfUrl]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isFullScreen, mobileTab]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
  };

  const onDocumentLoadError = (err: any) => {
    console.error("PDF Load Error:", err);
    setPdfLoading(false);
    setPdfError(
      "စာအုပ်ဖတ်ရန် အခက်အခဲရှိနေပါသည်။ Settings မှ Reader Mode ပြောင်းကြည့်ပါ။",
    );
  };

  const getBookCoverColor = (ddc: string) => {
    const category = DDC_CATEGORIES.find((c) => c.code === ddc);
    return category ? category.color : COLORS.primary;
  };

  const cycleViewerMode = () => {
    if (viewerMode === "custom") setViewerMode("native");
    else if (viewerMode === "native") setViewerMode("google");
    else setViewerMode("custom");
    setPdfLoading(true);
    setPdfError(null);
  };

  const getViewerUrl = () => {
    let url = book.pdfUrl;
    if (!url) return "";
    if (viewerMode === "google")
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    if (url.includes("drive.google.com"))
      return url
        .replace(/\/view.*/, "/preview")
        .replace(/\/edit.*/, "/preview");
    return url;
  };

  const showCoverImage = book.coverUrl && !imgError;

  return (
    <div className="animate-in fade-in zoom-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-700 bg-white px-5 py-3 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-md active:scale-95"
        >
          <ArrowLeft size={20} /> နောက်သို့
        </button>

        <button
          onClick={() => onFinishBook(book.id)}
          disabled={isFinished}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wide transition-all ${isFinished ? "bg-emerald-100 text-emerald-600" : "bg-slate-800 text-white hover:bg-slate-700 shadow-lg active:scale-95"}`}
        >
          {isFinished ? (
            <>
              <CheckCircle size={16} /> ဖတ်ပြီးပါပြီ
            </>
          ) : (
            <>ဖတ်ပြီးကြောင်းမှတ်သားမည်</>
          )}
        </button>
      </div>

      <div className="flex lg:hidden bg-white rounded-t-[30px] shadow-sm border-b border-slate-100 overflow-hidden">
        <button
          onClick={() => setMobileTab("info")}
          className={`flex-1 py-4 font-black uppercase tracking-wider text-xs ${mobileTab === "info" ? "bg-slate-800 text-white" : "text-slate-400 bg-slate-50"}`}
        >
          Info
        </button>
        <button
          onClick={() => setMobileTab("reader")}
          className={`flex-1 py-4 font-black uppercase tracking-wider text-xs ${mobileTab === "reader" ? "bg-slate-800 text-white" : "text-slate-400 bg-slate-50"}`}
        >
          Reader
        </button>
      </div>

      <div
        className={`bg-white lg:rounded-[40px] rounded-b-[30px] shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-[60] rounded-none" : "lg:h-[calc(100vh-220px)] h-[70vh]"}`}
      >
        <div
          className={`${mobileTab === "info" ? "flex" : "hidden"} lg:${isFullScreen ? "hidden" : "flex"} lg:w-1/3 bg-slate-50 p-8 flex-col items-center border-r border-slate-100 overflow-y-auto scroll-smooth`}
        >
          <div className="relative w-full aspect-[291/396] max-w-[170px] mx-auto mb-6 shrink-0 transition-transform hover:scale-105 duration-500">
             <div className="absolute inset-0">
               <svg width="100%" height="100%" viewBox="0 0 291 396" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.15))' }}>
                 <path fillRule="evenodd" clipRule="evenodd" d="M290.452 340.188C290.447 345.086 290.864 350.299 290.31 355.165C289.401 363.157 279.802 371.364 270.65 372.013C265.458 372.38 260.07 372.142 254.855 372.136L117.659 372.115C117.671 372.254 117.694 372.375 117.733 372.464L31.8476 372.273C25.0189 372.267 20.0474 372.712 14.2001 368.676C6.59749 361.492 4.49487 350.312 10.4179 341.279C15.5595 333.44 23.8017 332.59 32.2851 332.576L44.2011 332.589L103.038 332.615C103.038 332.588 103.038 332.56 103.038 332.532L117.51 332.547L153.494 332.475L265.29 332.493C274.951 332.528 284.809 334.779 289.414 323.853C289.806 322.924 289.971 321.921 290.372 321L290.452 340.188Z" fill="#2E3946"/>
                 <path d="M195 393.298V332.242V329H232V396L216.951 380.898L195 393.298Z" fill={getBookCoverColor(book.ddc)}/>
                 <path d="M195 337V329H232V337H195Z" fill="black" fillOpacity="0.2"/>
                 <path d="M14.4047 369C3.95625 367.439 0.25104 353.539 0.195741 344.875L0.118269 39.8202C0.0969849 36.237 -0.222208 32.3688 0.286829 28.8301C2.14409 15.9332 14.5418 3.45712 27.3803 0.743492C32.8892 -0.420896 39.3711 0.13225 45 0.125246L44.9294 332.973L32.7241 332.898C24.1305 332.911 15.7812 333.761 10.5727 341.601C4.57254 350.635 6.70306 361.816 14.4047 369Z" fill={getBookCoverColor(book.ddc)}/>
                 <path d="M14.4047 369C3.95625 367.439 0.25104 353.539 0.195741 344.875L0.118269 39.8202C0.0969849 36.237 -0.222208 32.3688 0.286829 28.8301C2.14409 15.9332 14.5418 3.45712 27.3803 0.743492C32.8892 -0.420896 39.3711 0.13225 45 0.125246L44.9294 332.973L32.7241 332.898C24.1305 332.911 15.7812 333.761 10.5727 341.601C4.57254 350.635 6.70306 361.816 14.4047 369Z" fill="black" fillOpacity="0.2"/>
                 <path d="M44.1488 0.0799874L269.209 0C279.142 0.00694221 287.962 1.31452 290.719 13.4632C291.181 15.5004 290.933 17.9451 290.939 20.0361L290.929 320.705L290.664 321.118C290.204 322.086 290.047 323.158 289.63 324.146C285.025 335.072 275.167 332.82 265.506 332.786L153.71 332.767L117.725 332.84L44 332.766L44.1488 0.0799874Z" fill={getBookCoverColor(book.ddc)}/>
               </svg>
             </div>
             
             <div className="absolute inset-0 z-10 flex flex-col p-3 text-white">
                <span className="absolute left-[18%] top-[5%] text-[10px] font-semibold tracking-wide drop-shadow-sm opacity-95">ID- {book.id}</span>
                
                <div className="absolute top-[35%] left-[20%] right-[5%] flex items-center justify-center">
                   <h4 className="text-[14px] font-semibold line-clamp-4 leading-snug drop-shadow-md text-center text-white/95">
                     {book.title}
                   </h4>
                </div>
             </div>
          </div>
          <h2 className="text-xl font-black text-slate-800 text-center mb-2">
            {book.title}
          </h2>
          <p className="text-slate-500 font-bold mb-6">{book.author}</p>
          <div className="w-full space-y-3">
            <div className="p-4 bg-white rounded-2xl flex justify-between items-center text-xs font-bold border border-slate-100">
              <span className="text-slate-400 uppercase">Category</span>
              <span className="text-indigo-600 font-black">DDC {book.ddc}</span>
            </div>
            <div className="p-4 bg-white rounded-2xl flex justify-between items-center text-xs font-bold border border-slate-100">
              <span className="text-slate-400 uppercase">Year</span>
              <span className="text-slate-700 font-black">{book.year}</span>
            </div>
          </div>
          <button
            onClick={() => setMobileTab("reader")}
            className="lg:hidden w-full py-4 mt-6 rounded-2xl bg-indigo-600 text-white font-black shadow-lg"
          >
            Read Now
          </button>
        </div>

        <div
          className={`${mobileTab === "reader" ? "flex" : "hidden"} lg:flex flex-1 bg-slate-900 p-2 lg:p-4 flex-col relative`}
        >
          <div className="flex justify-between items-center mb-3 bg-slate-800/50 p-2 rounded-xl relative z-20">
            <div className="flex gap-2">
              <button
                onClick={cycleViewerMode}
                className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors text-[10px] font-black uppercase flex items-center gap-2"
              >
                {viewerMode === "custom" ? (
                  <Settings2 size={14} />
                ) : viewerMode === "native" ? (
                  <Monitor size={14} />
                ) : (
                  <Globe size={14} />
                )}
                {viewerMode}
              </button>
              {viewerMode === "custom" && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg text-white transition-colors ${showSettings ? "bg-indigo-500" : "bg-white/10 hover:bg-white/20"}`}
                >
                  <SlidersHorizontal size={14} />
                </button>
              )}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            {viewerMode === "custom" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  className="text-white/50 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-[10px] font-mono text-white/70">
                  {pageNumber}/{numPages}
                </span>
                <button
                  onClick={() =>
                    setPageNumber((p) => Math.min(numPages, p + 1))
                  }
                  className="text-white/50 hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {showSettings && viewerMode === "custom" && (
            <div className="absolute top-16 left-4 bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-2xl z-50 w-64 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                  Display Settings
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase">
                  <span className="flex items-center gap-1.5">
                    <Sun size={12} /> Brightness
                  </span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase">
                  <span className="flex items-center gap-1.5">
                    <Settings2 size={12} /> Contrast
                  </span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  {isDarkMode ? (
                    <Moon size={14} className="text-indigo-400" />
                  ) : (
                    <Sun size={14} className="text-amber-400" />
                  )}
                  Dark Mode
                </span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${isDarkMode ? "bg-indigo-500" : "bg-slate-600"}`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className="flex-1 bg-white/5 rounded-xl overflow-auto scroll-smooth p-4 flex justify-center no-scrollbar relative z-10"
          >
            {pdfLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 z-10">
                <Loader2 className="animate-spin text-[#AAB971]" size={40} />
              </div>
            )}

            {pdfError ? (
              <div className="m-auto text-center p-8">
                <AlertTriangle
                  size={48}
                  className="mx-auto text-amber-500 mb-4 opacity-50"
                />
                <p className="text-slate-400 text-sm mb-6">{pdfError}</p>
                <button
                  onClick={cycleViewerMode}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase"
                >
                  Switch Mode
                </button>
              </div>
            ) : !book.pdfUrl ? (
              <div className="m-auto text-center p-8">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 text-sm font-bold">
                  PDF စာအုပ် မရရှိနိုင်သေးပါ။
                </p>
              </div>
            ) : viewerMode === "custom" && pdfFile ? (
              <div
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${isDarkMode ? "invert(100%) hue-rotate(180deg)" : ""}`,
                }}
                className="transition-all duration-300 w-full flex justify-center"
              >
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  className="flex flex-col items-center w-full"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    width={
                      containerWidth
                        ? Math.min(containerWidth - 40, 800)
                        : undefined
                    }
                    className="shadow-2xl mb-8"
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                  />
                </Document>
              </div>
            ) : (
              <iframe
                src={getViewerUrl() || undefined}
                className="w-full h-full border-none bg-white rounded-lg"
                onLoad={() => setPdfLoading(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
