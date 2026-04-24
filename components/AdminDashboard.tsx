import React, { useState } from "react";
import { Book, BookRequest } from "../types";
import {
  Plus,
  Trash2,
  Search,
  BookOpen,
  MessageSquare,
  Pencil,
  Database,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { COLORS } from "../constants";

interface AdminDashboardProps {
  books: Book[];
  requests: BookRequest[];
  onAddBook: () => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: number) => void;
  onDeleteRequest: (id: number) => void;
  onResetData: () => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  requests,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onDeleteRequest,
  onResetData,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"books" | "requests" | "settings">(
    "books",
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800">
          စီမံခန့်ခွဲမှု Dashboard
        </h2>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-700 bg-white px-5 py-3 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-md active:scale-95"
        >
          <ArrowLeft size={18} /> နောက်သို့
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[30px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E5EDCD] flex items-center justify-center text-[#85944E]">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {books.length}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">
              Total Books
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {requests.length}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase">
              Requests
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab("books")}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider ${activeTab === "books" ? "bg-slate-800 text-white shadow-lg" : "bg-white text-slate-400"}`}
        >
          Manage Books
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider ${activeTab === "requests" ? "bg-slate-800 text-white shadow-lg" : "bg-white text-slate-400"}`}
        >
          Requests
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider ${activeTab === "settings" ? "bg-slate-800 text-white shadow-lg" : "bg-white text-slate-400"}`}
        >
          Settings
        </button>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        {activeTab === "books" && (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 font-bold text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={onAddBook}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-black text-xs uppercase bg-[#AAB971] shadow-lg"
              >
                <Plus size={16} /> Add New
              </button>
            </div>
            <div className="overflow-x-auto scroll-smooth">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-slate-400 text-[10px] uppercase font-black">
                    <th className="p-4">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-b border-slate-50">
                      <td className="p-4 text-sm font-bold text-slate-700">
                        {book.title}
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-500">
                        {book.author}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onEditBook(book)}
                            className="p-2 bg-blue-50 text-blue-500 rounded-lg"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() =>
                              confirm("ဖျက်မှာသေချာပါသလား?") &&
                              onDeleteBook(book.id)
                            }
                            className="p-2 bg-red-50 text-red-500 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="p-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-3"
              >
                <div>
                  <h4 className="font-bold text-slate-800">{req.title}</h4>
                  <p className="text-xs text-slate-500">
                    By {req.requester} on {req.date}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteRequest(req.id)}
                  className="p-2 text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-8 text-center">
            <Database size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="font-black text-slate-800 mb-2">
              စနစ်ထိန်းသိမ်းမှု
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              စာအုပ်ဒေတာများကို ပင်မသတ်မှတ်ချက်များအတိုင်း ပြန်လည်ပြင်ဆင်ရန်
            </p>
            <button
              onClick={() =>
                confirm("Reset လုပ်မှာသေချာပါသလား?") && onResetData()
              }
              className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase"
            >
              <RefreshCw size={14} className="inline mr-2" /> Reset to Defaults
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
