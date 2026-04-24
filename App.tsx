import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  MessageSquare,
  Book as BookIcon,
  Brain,
  Sun,
  Users,
  MessageSquare as MsgIcon,
  Microscope,
  Settings,
  Palette,
  PenTool,
  Map,
  TrendingUp,
  Home,
  Star,
  LayoutGrid,
  ChevronRight,
  ArrowLeft,
  X,
  Flame,
  Languages,
  Atom,
  Monitor,
  BookOpen,
  MapPin,
  Laptop
} from "lucide-react";
import Header from "./components/Header";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import BookCard from "./components/BookCard";
import BookDetail from "./components/BookDetail";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import AddBookModal from "./components/modals/AddBookModal";
import RequestBookModal from "./components/modals/RequestBookModal";
import Footer from "./components/Footer";

import {
  Book,
  BookRequest,
  NewBookForm,
  NewRequestForm,
  Tab,
  User as UserType,
} from "./types";
import {
  COLORS,
  DDC_CATEGORIES,
  SAMPLE_BOOKS,
  STORAGE_KEY,
  REQUEST_STORAGE_KEY,
  CURRENT_USER_KEY,
} from "./constants";

const iconMap: Record<string, React.ReactNode> = {
  book: <BookIcon size={32} />,
  brain: <Brain size={32} />,
  sun: <Sun size={32} />,
  users: <Users size={32} />,
  "message-square": <MsgIcon size={32} />,
  microscope: <Microscope size={32} />,
  settings: <Settings size={32} />,
  palette: <Palette size={32} />,
  "pen-tool": <PenTool size={32} />,
  map: <Map size={32} />,
  flame: <Flame size={32} />,
  languages: <Languages size={32} />,
  atom: <Atom size={32} />,
  laptop: <Laptop size={32} />,
  "book-open": <BookOpen size={32} />,
  "map-pin": <MapPin size={32} />,
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedDDC, setSelectedDDC] = useState("All");
  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2800);
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    const savedRequests = localStorage.getItem(REQUEST_STORAGE_KEY);
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
       setCurrentUser(JSON.parse(savedUser));
       setShowDisclaimer(true);
    }

    // Ensure all books have a views property
    const loadedBooks: Book[] = savedBooks
      ? JSON.parse(savedBooks)
      : SAMPLE_BOOKS;
    const migrationBooks = loadedBooks.map((b) => ({
      ...b,
      views: b.views || 0,
    }));
    setBooks(migrationBooks);
    setRequests(savedRequests ? JSON.parse(savedRequests) : []);
    setIsLoaded(true);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
    }
  }, [books, requests, isLoaded]);

  // Show disclaimer only once per session when user logs in
  useEffect(() => {
    if (currentUser && !sessionStorage.getItem('disclaimerShown')) {
      setShowDisclaimer(true);
      sessionStorage.setItem('disclaimerShown', 'true');
    }
  }, [currentUser]);

  const notify = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleBackToHome = () => {
    setViewingBook(null);
    setActiveTab("home");
    setSelectedDDC("All");
    setSearchTerm("");
  };

  const handleBookClick = (book: Book) => {
    // Increment views
    const updatedBooks = books.map((b) =>
      b.id === book.id ? { ...b, views: (b.views || 0) + 1 } : b,
    );
    setBooks(updatedBooks);

    setViewingBook(book);
    if (
      currentUser &&
      !currentUser.currentlyReading.includes(book.id) &&
      !currentUser.readHistory.includes(book.id)
    ) {
      const updatedUser = {
        ...currentUser,
        currentlyReading: [...currentUser.currentlyReading, book.id],
      };
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const handleFinishBook = (bookId: number) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      currentlyReading: currentUser.currentlyReading.filter(
        (id) => id !== bookId,
      ),
      readHistory: [...new Set([...currentUser.readHistory, bookId])],
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    notify("စာအုပ်ဖတ်ပြီးကြောင်း မှတ်သားလိုက်ပါပြီ");
  };

  const currentlyReadingBooks = useMemo(
    () => books.filter((b) => currentUser?.currentlyReading.includes(b.id)).slice(0, 5),
    [books, currentUser]
  );
  
  const featuredBooks = useMemo(
    () => books.filter((b) => b.isFeatured).slice(0, 5),
    [books],
  );
  const mostReadBooks = useMemo(
    () =>
      [...books].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [books],
  );

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDDC = selectedDDC === "All" || book.ddc === selectedDDC;
    return matchesSearch && matchesDDC;
  });

  if (showSplash) return <SplashScreen />;
  if (!currentUser)
    return <AuthScreen onLoginSuccess={(u) => {
      setCurrentUser(u);
      setShowDisclaimer(true);
    }} />;

  const showGlobalBack = !viewingBook && activeTab !== "home" && activeTab !== "profile";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.bgLight }}
    >
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowDisclaimer(false)} />
          <div className="relative bg-[#FCFDFB] w-full max-w-lg rounded-[32px] shadow-2xl p-8 sm:p-10 border border-slate-100 transform animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full"
            >
              <X size={20} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#BACC82]/20 text-[#889851] flex items-center justify-center">
                <BookIcon size={32} />
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center mb-4">
              ရှင်းလင်းချက် (Disclaimer)
            </h2>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-slate-600 text-sm leading-relaxed text-center">
                ဤ အင်တာနက်စာမျက်နှာပေါ်ရှိ အကြောင်းအရာများသည် 'တို့သစ်ပင်များပညာရေးဖောင်ဒေးရှင်း' မှ ပညာရေးဆိုင်ရာ လမ်းညွှန်မှုနှင့် အကြံပြုချက်များကိုသာ ပေးရန် ရည်ရွယ်၍ 
                ဖန်တီးထားပါသည်။ ပါဝင်သောစာအုပ်အများစုကို အင်တာနက်ပေါ်ရှိ အခမဲ့ရနိုင်သောရင်းမြစ်များမှ စုစည်းထားပြီး အကျိုးအမြတ်မရယူသော ပညာရေးရည်ရွယ်ချက်အတွက် 
                အသုံးပြုထားခြင်းဖြစ်သည်။ မည်သည့်စာအုပ် သို့မဟုတ် အကြောင်းအရာကိုမျှ မူပိုင်ခွင့်ချိုးဖောက်ရန် ရည်ရွယ်ထားခြင်းမရှိပါ။ သင်သည် မူပိုင်ခွင့်ပိုင်ရှင်ဖြစ်ပြီး 
                သင့်စာအုပ်ကို ဤစာမျက်နှာမှ ဖယ်ရှားလိုပါက ကျေးဇူးပြု၍ ကျွန်ုပ်တို့ထံ ဆက်သွယ်ပါ၊ ကျွန်ုပ်တို့ ချက်ချင်း ဖယ်ရှားပေးပါမည်။
              </p>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="w-full bg-[#BACC82] hover:bg-[#AAB971] text-white font-bold py-4 rounded-xl transition-colors shadow-sm active:scale-[0.98]"
              >
                သိပါပြီ
              </button>
            </div>
          </div>
        </div>
      )}

      <Header
        user={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem(CURRENT_USER_KEY);
        }}
        onOpenProfile={() => {
          setViewingBook(null);
          setActiveTab("profile");
        }}
        onExport={() => notify("Backup Saved")}
        onResetView={handleBackToHome}
        onOpenDashboard={() => {
          setViewingBook(null);
          setActiveTab("admin_dashboard");
        }}
      />

      <main className="max-w-6xl mx-auto px-4 pt-6 flex-1 w-full">
        {showGlobalBack && (
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm font-black text-slate-600 hover:text-[#AAB971] transition-all active:scale-95"
              >
                <ArrowLeft size={18} /> နောက်သို့
              </button>
            </div>
        )}

        {viewingBook ? (
          <BookDetail
            book={viewingBook}
            onBack={() => setViewingBook(null)}
            onFinishBook={handleFinishBook}
            isFinished={currentUser.readHistory.includes(viewingBook.id)}
          />
        ) : activeTab === "admin_dashboard" ? (
          <AdminDashboard
            books={books}
            requests={requests}
            onAddBook={() => setIsAddBookModalOpen(true)}
            onEditBook={(b) => {
              setEditingBook(b);
              setIsAddBookModalOpen(true);
            }}
            onDeleteBook={(id) => setBooks(books.filter((b) => b.id !== id))}
            onDeleteRequest={(id) =>
              setRequests(requests.filter((r) => r.id !== id))
            }
            onResetData={() => setBooks(SAMPLE_BOOKS)}
            onBack={handleBackToHome}
          />
        ) : activeTab === "profile" ? (
          <UserProfile
            user={currentUser}
            allBooks={books}
            onBookClick={handleBookClick}
            onBack={handleBackToHome}
            onRequestOpen={() => setIsRequestModalOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              localStorage.removeItem(CURRENT_USER_KEY);
            }}
          />
        ) : (
          <>
            {activeTab === "home" && !searchTerm && (
              <div className="space-y-6 mb-12">
                <div className="bg-[#BACC82] rounded-[24px] p-8 relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="tree-pattern-bg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                          <path d="M30 15 L15 45 L25 45 L25 60 L35 60 L35 45 L45 45 Z" fill="#889851" />
                        </pattern>
                      </defs>
                      <rect x="0" y="0" width="100%" height="100%" fill="url(#tree-pattern-bg)"></rect>
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-center text-sm font-bold text-slate-900 mb-4 tracking-wide">
                      နောက်ခံအကြောင်းအရာ
                    </h2>
                    <p className="text-center text-slate-800 text-xs sm:text-sm leading-relaxed font-medium px-4">
                      စစ်အာဏာသိမ်းမှုနှင့် မတရားအုပ်ချုပ်မှုများကြောင့် သန်းနှင့်ချီသော လူငယ်များ၏ ပညာရေးအခွင့်အလမ်းများသည် ဆိုးရွားစွာ ထိခိုက်လျက်ရှိပါသည်။ အထူးသဖြင့် 
                      ပဋိပက္ခဖြစ်ပွားရာဒေသများမှ နေရပ်စွန့်ခွာရသော တော်လှန်လူငယ်များသည် ၎င်းတို့၏ ပညာရေးကို ဆက်လက်သင်ယူနိုင်ရန်အတွက် 
                      အခက်အခဲများစွာကို ကြုံတွေ့နေရပါသည်။ သို့ရာတွင် တော်လှန်လူငယ်များအနေဖြင့် ပညာရေးရည်မှန်းချက်များ ပြတ်တောက်သွားခြင်း
                      မရှိစေရေးအတွက် ဝိုင်းဝန်းပံ့ပိုးကူညီပေးရန် အထူးလိုအပ်လျက်ရှိပါသည်။ 
                      <br /><br />
                      'တို့သစ်ပင်များ' ပညာရေးဖောင်ဒေးရှင်းသည် တော်လှန်လူငယ်များအတွက် ပညာရေးအခွင့်အလမ်းများ ပိုမိုရရှိစေရန်နှင့် တတ်စွမ်းသမျှ ပံ့ပိုးကူညီရန် 
                      ရည်ရွယ်ပါသဖြင့်၊ ဤပညာရေးဖောင်ဒေးရှင်းမှတစ်ဆင့် တော်လှန်လူငယ်များအတွက် လိုအပ်သောပံ့ပိုးမှုများကို ရယူနိုင်မည့်အပြင်၊ 
                      အရည်အသွေးပြည့်၀သော ပညာရေးအစီအမံများကိုပါ လက်လှမ်းမီနိုင်ရေးအတွက် အထောက်အကူပြုနိုင်မည်ဟု ယုံကြည်ပါသည်။
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative mb-8 max-w-4xl mx-auto flex items-center shadow-md rounded-[32px] overflow-hidden bg-white border border-slate-100 p-1">
              <input
                type="text"
                placeholder="စာအုပ်အမည် သို့မဟုတ် စာရေးဆရာ အမည်ဖြင့် ရှာဖွေပါ..."
                className="w-full pl-6 pr-4 py-4 border-none outline-none font-bold text-sm bg-white text-slate-700 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#BACC82] hover:bg-[#AAB971] transition-colors text-white px-8 py-3 rounded-full flex items-center gap-2 font-bold whitespace-nowrap m-1">
                <Search size={18} /> ရှာဖွေပါ
              </button>
            </div>

            <div className="flex justify-center gap-8 mb-16 overflow-x-auto scroll-smooth py-2">
              {["home", "browse", "requests"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as Tab);
                    setSelectedDDC("All");
                  }}
                  className={`px-12 py-3.5 rounded-full text-sm font-bold transition-all duration-200 border-2 ${activeTab === tab ? "text-white bg-[#BACC82] border-[#BACC82] shadow-sm" : "bg-white text-[#BACC82] border-slate-100 hover:border-[#BACC82]"}`}
                >
                  {tab === "home"
                    ? "ပင်မ"
                    : tab === "browse"
                      ? "အမျိုးအစား"
                      : "ပညာပေးကဏ္ဍ"}
                </button>
              ))}
            </div>

            {searchTerm ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-12 gap-x-4 pb-20">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isAdmin={currentUser.role === "admin"}
                    onClick={handleBookClick}
                    onDelete={(id) =>
                      setBooks(books.filter((b) => b.id !== id))
                    }
                  />
                ))}
              </div>
            ) : activeTab === "home" ? (
              <div className="space-y-16 pb-20">
                {/* Currently Reading Section */}
                <section>
                  <div className="flex items-center justify-center mb-10 mt-8">
                    <h3 className="text-2xl font-bold text-[#B0BF76] text-center">
                      ဖတ်လက်စ စာအုပ်များ
                    </h3>
                  </div>
                  {currentlyReadingBooks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {currentlyReadingBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          isAdmin={false}
                          onClick={handleBookClick}
                          onDelete={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                     <div className="text-center opacity-40 font-black text-sm text-slate-500 py-10">
                       ဖတ်လက်စ စာအုပ်များ မရှိသေးပါ။
                     </div>
                  )}
                </section>

                {/* Suggested Books Section */}
                <section>
                  <div className="flex items-center justify-center mb-10 mt-16 border-t border-slate-200 pt-16">
                    <h3 className="text-2xl font-bold text-[#B0BF76] text-center">
                      ဖတ်ရှုရန် အကြံပြုထားသော စာအုပ်များ
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {featuredBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isAdmin={false}
                        onClick={handleBookClick}
                        onDelete={() => {}}
                      />
                    ))}
                  </div>
                </section>

                {/* Most Read Books Section */}
                <section>
                  <div className="flex items-center justify-center mb-10 mt-16 border-t border-slate-200 pt-16">
                    <h3 className="text-2xl font-bold text-[#B0BF76] text-center">
                      ဖတ်ရှုမှု အများဆုံးစာအုပ်များ
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {mostReadBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isAdmin={false}
                        onClick={handleBookClick}
                        onDelete={() => {}}
                      />
                    ))}
                  </div>
                </section>

                {/* Categories Shortcut */}
                <section className="mb-8">
                  <div className="flex items-center justify-center mb-10 mt-16 border-t border-slate-200 pt-16 relative">
                    <h3 className="text-2xl font-bold text-[#B0BF76] text-center">
                      စာအုပ်အမျိုးအစားများ
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                    {DDC_CATEGORIES.map((cat) => (
                      <button
                        key={cat.code}
                        onClick={() => {
                          setSelectedDDC(cat.code);
                          setActiveTab("list");
                        }}
                        className="py-6 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 flex flex-col items-center justify-between gap-4 h-full"
                        style={{ backgroundColor: cat.color }}
                      >
                        <div className="text-white text-2xl font-black">
                          {cat.code}
                        </div>
                        <div className="text-white flex-grow flex items-center justify-center opacity-95">
                          {iconMap[cat.iconName]}
                        </div>
                        <div className="text-[13px] font-bold text-white text-center leading-tight">
                          {cat.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            ) : activeTab === "browse" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 pb-20">
                {DDC_CATEGORIES.map((cat) => (
                  <button
                    key={cat.code}
                    onClick={() => {
                      setSelectedDDC(cat.code);
                      setActiveTab("list");
                    }}
                    className="py-6 px-4 rounded-[12px] shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 flex flex-col items-center justify-between gap-4 h-full"
                    style={{ backgroundColor: cat.color }}
                  >
                    <div className="text-white text-2xl font-black">
                      {cat.code}
                    </div>
                    <div className="text-white flex-grow flex items-center justify-center opacity-95">
                      {iconMap[cat.iconName]}
                    </div>
                    <div className="text-[13px] font-bold text-white text-center leading-tight">
                      {cat.label}
                    </div>
                  </button>
                ))}
              </div>
            ) : activeTab === "requests" ? (
              <div className="flex flex-col items-center justify-center pt-20 pb-40 text-slate-400">
                <BookOpen size={48} className="mb-4 opacity-30" />
                <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                <p className="text-sm font-medium opacity-60">
                  ပညာပေးကဏ္ဍများကို မကြာမီ တင်ဆက်ပေးပါမည်။
                </p>
              </div>
            ) : (
              /* List Tab (DDC Category View) */
              <div className="pb-20">
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{
                      backgroundColor: DDC_CATEGORIES.find(
                        (c) => c.code === selectedDDC,
                      )?.color,
                    }}
                  >
                    <BookIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">
                      {
                        DDC_CATEGORIES.find((c) => c.code === selectedDDC)
                          ?.label
                      }
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Dewey Decimal Classification {selectedDDC}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-12 gap-x-4">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isAdmin={currentUser.role === "admin"}
                        onClick={handleBookClick}
                        onDelete={(id) =>
                          setBooks(books.filter((b) => b.id !== id))
                        }
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center opacity-30 font-black text-slate-400">
                      ဤအမျိုးအစားတွင် စာအုပ်များမရှိသေးပါ။
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {currentUser.role === "admin" &&
        !viewingBook &&
        activeTab !== "admin_dashboard" && (
          <button
            onClick={() => {
              setEditingBook(null);
              setIsAddBookModalOpen(true);
            }}
            className="fixed bottom-10 right-8 w-16 h-16 rounded-[28px] text-white shadow-2xl flex items-center justify-center bg-[#AAB971] z-50"
          >
            <Plus size={32} />
          </button>
        )}

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onAdd={(b) => setBooks([...books, { ...b, id: Date.now(), views: 0 }])}
        onUpdate={(d) =>
          editingBook &&
          setBooks(
            books.map((b) => (b.id === editingBook.id ? { ...b, ...d } : b)),
          )
        }
        bookToEdit={editingBook}
      />
      <RequestBookModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequest={(r) =>
          setRequests([
            ...requests,
            { ...r, id: Date.now(), date: new Date().toLocaleDateString() },
          ])
        }
      />
      {showNotification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest z-[70]">
          {showNotification}
        </div>
      )}
    </div>
  );
};

export default App;
