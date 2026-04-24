import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { COLORS, USERS_STORAGE_KEY } from "../constants";
import { User as UserType } from "../types";
import { TreeBorder } from "./TreeBorder";

interface AuthScreenProps {
  onLoginSuccess: (user: UserType) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    region: "",
    bornYear: "",
    libraryName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users: UserType[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (isLogin) {
        // Login Logic
        // Special Admin Backdoor
        if (
          formData.username === "admin" &&
          formData.password === "ourtrees123"
        ) {
          const adminUser: UserType = {
            id: "admin",
            name: "System Administrator",
            username: "admin",
            password: "...",
            role: "admin",
            joinedDate: new Date().toLocaleDateString(),
            readHistory: [],
            currentlyReading: [],
          };
          onLoginSuccess(adminUser);
          return;
        }

        const user = users.find(
          (u) =>
            u.username === formData.username &&
            u.password === formData.password,
        );
        if (user) {
          onLoginSuccess(user);
        } else {
          setError("Invalid username or password");
          setIsLoading(false);
        }
      } else {
        // Registration Logic
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        if (users.some((u) => u.username === formData.username)) {
          setError("Username already taken");
          setIsLoading(false);
          return;
        }

        const newUser: UserType = {
          id: Date.now().toString(),
          name: formData.name,
          username: formData.username,
          password: formData.password,
          gender: formData.gender,
          region: formData.region,
          bornYear: formData.bornYear,
          libraryName: formData.libraryName,
          role: "user",
          joinedDate: new Date().toLocaleDateString(),
          readHistory: [],
          currentlyReading: [],
        };

        users.push(newUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        onLoginSuccess(newUser);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FCFDFB] relative overflow-hidden pb-[4vh]">
      <TreeBorder />
      
      {/* Vertically centering the card correctly with a small gap above the trees */}
      <div className="w-full max-w-sm rounded-[32px] shadow-[0_16px_40px_-10px_rgba(0,0,0,0.15)] relative z-10 flex-shrink-0 animate-in fade-in zoom-in duration-500 overflow-hidden bg-white mb-[14vh]">
        
        {/* Top Header Section */}
        <div className="bg-[#A4B571] pt-12 pb-14 text-center text-white relative">
          
          {/* Faint white pine trees inside the green card at bottom */}
          <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none z-0">
             <div
               className="w-full h-[60px]"
               style={{ 
                 backgroundColor: 'white',
                 maskImage: 'url("https://raw.githubusercontent.com/Khunnaingpyaehtun/Ticket-System/main/Trees%20shiloutte.svg")',
                 maskSize: 'auto 100%',
                 maskPosition: 'bottom center',
                 maskRepeat: 'repeat-x',
                 WebkitMaskImage: 'url("https://raw.githubusercontent.com/Khunnaingpyaehtun/Ticket-System/main/Trees%20shiloutte.svg")',
                 WebkitMaskSize: 'auto 100%',
                 WebkitMaskPosition: 'bottom center',
                 WebkitMaskRepeat: 'repeat-x',
                 opacity: 1 
               }} 
             />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4">
              <img src="https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/Logo.svg" alt="Logo" className="w-[87px] h-[86px] object-contain" />
            </div>
            <div className="mb-2">
              <img src="https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/Logo%20text.svg" alt="Our Trees Education Foundation" className="h-[43px] object-contain" />
            </div>
            <p className="text-sm font-semibold tracking-wide mt-3 opacity-100">
              Digital Library System
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="px-8 pb-8 pt-6 relative z-20">
          
          {/* Toggle Buttons */}
          <div className="flex gap-1 mb-8 bg-[#EBEFE2] p-1.5 rounded-full mx-auto w-[90%]">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${isLogin ? "bg-[#AAB971] text-white shadow-sm" : "text-[#85944E]"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${!isLogin ? "bg-[#AAB971] text-white shadow-sm" : "text-[#85944E]"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#85944E] ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all border border-transparent"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#85944E] ml-1">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all border border-transparent"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            
            {isLogin ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#85944E] ml-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all border border-transparent"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#85944E] ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all border border-transparent"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#85944E] ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all border border-transparent"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#85944E] ml-1">
                      Gender
                    </label>
                    <select
                      required
                      className="w-full px-3 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all appearance-none border border-transparent"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#85944E] ml-1">
                      Region
                    </label>
                    <select
                      required
                      className="w-full px-3 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all appearance-none border border-transparent"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Select Region
                      </option>
                      <option value="Kachin">Kachin</option>
                      <option value="Kayah">Kayah</option>
                      <option value="Kayin">Kayin</option>
                      <option value="Chin">Chin</option>
                      <option value="Sagaing">Sagaing</option>
                      <option value="Tanintharyi">Tanintharyi</option>
                      <option value="Bago">Bago</option>
                      <option value="Magway">Magway</option>
                      <option value="Mandalay">Mandalay</option>
                      <option value="Mon">Mon</option>
                      <option value="Rakhine">Rakhine</option>
                      <option value="Yangon">Yangon</option>
                      <option value="Shan">Shan</option>
                      <option value="Ayeyarwady">Ayeyarwady</option>
                      <option value="Naypyidaw">Naypyidaw</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#85944E] ml-1">
                      Year of Birth
                    </label>
                    <select
                      required
                      className="w-full px-3 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all appearance-none border border-transparent"
                      value={formData.bornYear}
                      onChange={(e) =>
                        setFormData({ ...formData, bornYear: e.target.value })
                      }
                    >
                      <option value="" disabled>
                        Select Year
                      </option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#85944E] ml-1">
                      Library Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-3 rounded-2xl bg-[#EEF2E6] font-bold text-sm text-[#555] outline-none focus:ring-2 focus:ring-[#AAB971]/50 transition-all border border-transparent"
                      value={formData.libraryName}
                      onChange={(e) =>
                        setFormData({ ...formData, libraryName: e.target.value })
                      }
                      placeholder="e.g. Spring Library"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <p className="text-[11px] font-bold text-red-500 text-center bg-red-50 p-2 rounded-xl">
                {error}
              </p>
            )}

            <div className="pt-2">
               <button
                 type="submit"
                 disabled={isLoading}
                 className="w-[90%] mx-auto py-3.5 rounded-full text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                 style={{ backgroundColor: "#AAB971" }}
               >
                 {isLoading ? (
                   <Loader2 className="animate-spin" size={18} />
                 ) : isLogin ? (
                   "Access Library"
                 ) : (
                   "Create Account"
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
