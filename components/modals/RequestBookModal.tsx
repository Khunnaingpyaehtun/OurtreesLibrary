import React, { useState } from "react";
import { NewRequestForm } from "../../types";
import { COLORS } from "../../constants";

interface RequestBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequest: (form: NewRequestForm) => void;
}

const RequestBookModal: React.FC<RequestBookModalProps> = ({
  isOpen,
  onClose,
  onRequest,
}) => {
  const [newRequest, setNewRequest] = useState<NewRequestForm>({
    title: "",
    author: "",
    requester: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequest(newRequest);
    setNewRequest({ title: "", author: "", requester: "" });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in zoom-in duration-300">
      <div className="bg-[#B9C17E] w-full max-sm:max-w-full max-w-md rounded-[40px] shadow-2xl p-10 pt-12">
        <h2 className="text-2xl font-black mb-8 text-center text-white drop-shadow-sm">
          စာအုပ်အသစ်တောင်းဆိုရန်
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 pt-2">
            <input
              required
              placeholder="တောင်းဆိုလိုသော စာအုပ်အမည်"
              className="w-full px-7 py-5 rounded-xl bg-white/90 font-bold text-sm outline-none focus:ring-2 focus:ring-[#AAB971] border-none shadow-sm placeholder:text-slate-400 text-slate-800"
              value={newRequest.title}
              onChange={(e) =>
                setNewRequest({ ...newRequest, title: e.target.value })
              }
            />
            <input
              required
              placeholder="စာရေးဆရာ အမည်"
              className="w-full px-7 py-5 rounded-xl bg-white/90 font-bold text-sm outline-none focus:ring-2 focus:ring-[#AAB971] border-none shadow-sm placeholder:text-slate-400 text-slate-800"
              value={newRequest.author}
              onChange={(e) =>
                setNewRequest({ ...newRequest, author: e.target.value })
              }
            />
            <input
              required
              placeholder="တောင်းဆိုသူအမည် (သင့်နာမည်)"
              className="w-full px-7 py-5 rounded-xl bg-white/90 font-bold text-sm outline-none focus:ring-2 focus:ring-[#AAB971] border-none shadow-sm placeholder:text-slate-400 text-slate-800"
              value={newRequest.requester}
              onChange={(e) =>
                setNewRequest({ ...newRequest, requester: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 rounded-xl text-[#AAB971] bg-white font-black hover:bg-slate-50 shadow-md active:scale-95 transition-all mt-6"
          >
            တောင်းဆိုချက်ကို အတည်ပြုမည်
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-white/70 text-[12px] font-bold mt-2 text-center hover:text-white transition-colors"
          >
            ပယ်ဖျက်မည်။
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestBookModal;
