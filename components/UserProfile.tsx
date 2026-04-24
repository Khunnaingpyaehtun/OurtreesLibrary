import React from "react";
import { User as UserType, Book } from "../types";
import { ACHIEVEMENTS } from "../constants";
import BookCard from "./BookCard";
import StudyTree from "./StudyTree";
// Added ChevronRight to the lucide-react imports
import {
  BookOpen,
  Award,
  Clock,
  Fingerprint,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronRight,
} from "lucide-react";

interface UserProfileProps {
  user: UserType;
  allBooks: Book[];
  onBookClick: (book: Book) => void;
  onBack: () => void;
  onRequestOpen: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  allBooks,
  onBookClick,
  onBack,
  onRequestOpen,
  onLogout,
}) => {
  const readBooks = allBooks.filter((b) => user.readHistory.includes(b.id));
  const currentBooks = allBooks.filter(
    (b) =>
      user.currentlyReading.includes(b.id) && !user.readHistory.includes(b.id),
  );
  const readCount = readBooks.length;

  const unlockedAchievements = ACHIEVEMENTS.filter(
    (a) => readCount >= a.requiredBooks,
  );

  // Dynamic Status based on reading history
  const getMemberStatus = () => {
    if (readCount >= 50)
      return {
        label: "PLATINUM",
        color: "from-slate-300 to-slate-500",
        icon: <Sparkles size={16} />,
      };
    if (readCount >= 20)
      return {
        label: "GOLD",
        color: "from-amber-400 to-yellow-600",
        icon: <Zap size={16} />,
      };
    if (readCount >= 5)
      return {
        label: "SILVER",
        color: "from-slate-200 to-slate-400",
        icon: <ShieldCheck size={16} />,
      };
    return {
      label: "BASIC",
      color: "from-[#AAB971] to-[#C4D18D]",
      icon: <BookOpen size={16} />,
    };
  };

  const status = getMemberStatus();

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800">
          ကိုယ်ပိုင်စာမျက်နှာ
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-700 bg-white px-5 py-3 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-md active:scale-95"
        >
          <ArrowLeft size={18} /> နောက်သို့
        </button>
      </div>

      {/* Premium Member Card Redesign */}
      <div className="max-w-md mx-auto mb-16 perspective-1000">
        <div
          className={`aspect-[1.6/1] rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative text-[#2B3A1A] group transition-transform duration-500 hover:rotate-y-12`}
        >
          {/* Background Base */}
          <img 
            src="https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/ID%20card.svg" 
            alt="ID Card Background" 
            className="absolute inset-0 w-full h-full object-cover" 
          />

          {/* Glass Container */}
          <div className="relative h-full p-8 pt-5 text-[#2B3A1A] flex flex-col justify-between">
            <div className="mt-14 ml-14">
              {/* Temporarily hidden 
              <div className="text-[6px] font-black uppercase opacity-80 mb-0.5 ml-0.5">
                Reader Name :
              </div>
              <div className="text-[14px] font-black leading-none drop-shadow-sm mb-1 line-clamp-1 max-w-[150px]">
                {user.name}
              </div>
              <div className="text-[6px] font-black uppercase opacity-80 mb-0.5 ml-0.5 mt-2">
                Reader ID :
              </div>
              <div className="text-[10px] font-black font-mono">
                {user.id.slice(-8).toUpperCase()}
              </div>
              */}
            </div>

            <div className="absolute bottom-5 right-8 text-right">
              {/* Temporarily hidden
              <div className="text-[5px] font-black uppercase opacity-80 mr-1">
                since {user.joinedDate}
              </div>
              */}
            </div>
          </div>

          {/* Holographic Strip Aesthetic */}
          <div className="absolute right-12 top-0 bottom-0 w-8 bg-gradient-to-b from-transparent via-white/10 to-transparent skew-x-12"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Achievements Section */}
          <div className="bg-[#B9C17E] p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col">
            <h3 className="text-lg font-black text-[#5C6E35] drop-shadow-sm mb-4">
              ဆုတံဆိပ်များ:
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {unlockedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  title={ach.description}
                  className="flex items-center gap-2 bg-white/95 text-[#5C6E35] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm cursor-default hover:scale-105 transition-transform"
                >
                  <span className="text-lg sm:text-2xl pt-0.5">
                    {ach.icon}
                  </span>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-black leading-none">
                      {ach.title}
                    </div>
                    <div className="text-[8px] font-bold opacity-70 uppercase tracking-tighter mt-1">
                      {ach.requiredBooks} Books
                    </div>
                  </div>
                </div>
              ))}
              {unlockedAchievements.length === 0 && (
                <div className="w-full py-6 text-center border-2 border-dashed border-white/40 rounded-3xl">
                  <p className="text-xs text-white/80 font-bold">
                    စာအုပ်များဖတ်ပြီး ဆုတံဆိပ်များ စတင်ရယူလိုက်ပါ!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Request Book Section */}
          <div className="bg-[#B9C17E] p-6 sm:p-8 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-black text-[#5C6E35] drop-shadow-sm mb-4">
              စာအုပ်အသစ်တောင်းဆိုရန်
            </h3>
            <button
              onClick={onRequestOpen}
              className="w-full bg-white/95 hover:bg-white text-slate-400 font-bold px-6 py-4 sm:py-5 rounded-2xl shadow-sm transition-all active:scale-95 text-left text-sm"
            >
              စာအုပ်အမည်တောင်းဆိုမည်
            </button>
          </div>

          {/* Comments/Notes Section (Static Mock) */}
          <div className="bg-[#B9C17E] p-6 sm:p-8 rounded-[32px] shadow-sm">
            <h3 className="text-lg font-black text-[#5C6E35] drop-shadow-sm mb-4">
              သဘောထားမှတ်ချက်များ:
            </h3>
            <div className="w-full bg-white/95 h-24 sm:h-32 rounded-2xl shadow-sm"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Study Tree Section */}
          <div className="bg-[#B9C17E] p-6 sm:p-8 rounded-[32px] shadow-sm h-full max-h-[600px] flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-black text-[#5C6E35] drop-shadow-sm mb-0 shrink-0 z-10 relative">
              လေ့လာမှုရလဒ် ပင်
            </h3>
            <div className="flex-1 flex items-center justify-center relative z-10 min-h-[300px]">
              <StudyTree readCount={user.readHistory.length} />
            </div>
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <radialGradient id="glare" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
                </radialGradient>
                <rect width="100%" height="100%" fill="url(#glare)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Reading History */}
      <div className="bg-white p-8 rounded-[50px] shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F7EC] flex items-center justify-center text-[#AAB971]">
              <ShieldCheck size={24} />
            </div>
            ဖတ်ပြီးသားစာအုပ်များ
          </h3>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {readCount} Total History
          </div>
        </div>

        {readBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {readBooks.map((book) => (
              <div
                key={book.id}
                className="opacity-90 hover:opacity-100 transition-opacity"
              >
                <BookCard
                  book={book}
                  isAdmin={false}
                  onClick={onBookClick}
                  onDelete={() => {}}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
            <BookOpen size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold opacity-60">
              ဖတ်ပြီးသားစာအုပ်မရှိသေးပါ။
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onLogout}
          className="bg-red-50 hover:bg-red-100 text-red-500 font-bold py-4 px-12 rounded-3xl transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          Logout / Exit
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
