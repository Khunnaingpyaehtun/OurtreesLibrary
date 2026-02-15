import React from 'react';
import { User as UserType, Book } from '../types';
import { COLORS, ACHIEVEMENTS } from '../constants';
import BookCard from './BookCard';
import { BookOpen, Award, Clock, Fingerprint } from 'lucide-react';

interface UserProfileProps {
  user: UserType;
  allBooks: Book[];
  onBookClick: (book: Book) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, allBooks, onBookClick }) => {
  const readBooks = allBooks.filter(b => user.readHistory.includes(b.id));
  const currentBooks = allBooks.filter(b => user.currentlyReading.includes(b.id) && !user.readHistory.includes(b.id));
  const readCount = readBooks.length;

  const unlockedAchievements = ACHIEVEMENTS.filter(a => readCount >= a.requiredBooks);
  const nextAchievement = ACHIEVEMENTS.find(a => readCount < a.requiredBooks);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Virtual ID Card */}
      <div className="max-w-md mx-auto mb-12 transform hover:scale-[1.02] transition-transform duration-300">
        <div className="aspect-[1.586/1] rounded-[24px] overflow-hidden shadow-2xl relative text-white">
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#DB8C29] to-[#9e5f12]"></div>
            
            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-black italic tracking-tighter">Our Trees</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Library Member</p>
                    </div>
                    <Fingerprint className="opacity-50" size={32} />
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-white/30">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase opacity-60 mb-0.5">Member Name</div>
                        <div className="text-lg font-black tracking-wide leading-none">{user.name}</div>
                        <div className="text-[10px] font-mono mt-1 opacity-80">ID: {user.id.slice(-6).toUpperCase()}</div>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[9px] font-bold uppercase opacity-60">Joined Date</div>
                        <div className="font-mono text-xs font-bold">{user.joinedDate}</div>
                    </div>
                    <div className="text-right">
                         <div className="text-[9px] font-bold uppercase opacity-60">Books Read</div>
                         <div className="text-2xl font-black leading-none">{readCount}</div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Stats & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                  <Award size={16} /> Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                  {unlockedAchievements.length > 0 ? (
                      unlockedAchievements.map(ach => (
                          <div key={ach.id} className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-xl border border-yellow-100" title={ach.description}>
                              <span className="text-xl">{ach.icon}</span>
                              <div className="text-xs font-bold">{ach.title}</div>
                          </div>
                      ))
                  ) : (
                      <div className="text-xs text-slate-400 italic">Read more books to unlock badges!</div>
                  )}
              </div>
              {nextAchievement && (
                  <div className="mt-4 pt-4 border-t border-slate-50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Next Goal: {nextAchievement.title}</div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                              className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${(readCount / nextAchievement.requiredBooks) * 100}%` }}
                          ></div>
                      </div>
                  </div>
              )}
          </div>

          <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                  <Clock size={16} /> Currently Reading
              </h3>
              {currentBooks.length > 0 ? (
                   <div className="space-y-3">
                       {currentBooks.map(book => (
                           <div key={book.id} onClick={() => onBookClick(book)} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group">
                               <div className="w-8 h-12 bg-slate-200 rounded overflow-hidden">
                                  {book.coverUrl && <img src={book.coverUrl} className="w-full h-full object-cover" />}
                               </div>
                               <div className="flex-1 min-w-0">
                                   <div className="text-xs font-black truncate group-hover:text-[#DB8C29] transition-colors">{book.title}</div>
                                   <div className="text-[10px] text-slate-400 truncate">{book.author}</div>
                               </div>
                               <BookOpen size={16} className="text-slate-300" />
                           </div>
                       ))}
                   </div>
              ) : (
                  <div className="text-xs text-slate-400 italic py-4 text-center">No books in progress</div>
              )}
          </div>
      </div>

      {/* Reading History */}
      <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
         <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-[#DB8C29]" size={20} /> Reading History
         </h3>
         {readBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {readBooks.map(book => (
                   <div key={book.id}>
                       <BookCard book={book} isAdmin={false} onClick={onBookClick} onDelete={() => {}} />
                   </div>
               ))}
            </div>
         ) : (
             <div className="text-center py-10 text-slate-400">
                 <p className="text-sm font-bold opacity-60">You haven't finished any books yet.</p>
             </div>
         )}
      </div>

    </div>
  );
};

export default UserProfile;