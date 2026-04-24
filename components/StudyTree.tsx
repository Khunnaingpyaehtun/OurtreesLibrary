import React from "react";

interface StudyTreeProps {
  readCount: number;
}

const StudyTree: React.FC<StudyTreeProps> = ({ readCount }) => {
  // 1-9: Seed
  // 10-19: Sprout
  // 20-29: Stem
  // 30-39: Stem + 1 Leaf
  // 40-49: Stem + 2 Leaves
  // 50-59: Stem + 3 Leaves
  // >= 60: Stem + 4 Leaves (Tree)

  const showSeed = readCount >= 1;
  const showSprout = readCount >= 10;
  const showStem = readCount >= 20;
  const leavesCount = readCount >= 30 ? Math.floor((readCount - 20) / 10) : 0;

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-end pb-10 relative">
      <svg
        width="200"
        height="300"
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg transition-all duration-1000"
      >
        {/* Pot / Ground */}
        <path d="M50 280 L150 280 L130 300 L70 300 Z" fill="#6B4423" />
        <ellipse cx="100" cy="280" rx="50" ry="10" fill="#5C3A21" />

        {/* 0 books: show a hint text in the middle maybe, but we handle it outside */}

        {/* Level 1: Seed (1-9 books) */}
        {showSeed && !showSprout && (
          <ellipse
            cx="100"
            cy="280"
            rx="6"
            ry="4"
            fill="#8B5A2B"
            className="animate-in fade-in"
          />
        )}

        {/* Level 2: Sprout (10-19 books) */}
        {showSprout && !showStem && (
          <path
            d="M100 280 Q 95 260 105 250"
            stroke="#85944E"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="animate-pulse"
          />
        )}

        {/* Level 3+: Stem (>= 20 books) */}
        {showStem && (
          <path
            d="M100 280 Q 100 200 100 120"
            stroke="#5C6E35"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Leaves (>= 30 books) */}
        {/* Leaf 1 (Right) */}
        {leavesCount >= 1 && (
          <path
            d="M100 220 Q 130 200 140 220 Q 120 240 100 220"
            fill="#85944E"
            className="animate-in zoom-in"
          />
        )}

        {/* Leaf 2 (Left) */}
        {leavesCount >= 2 && (
          <path
            d="M100 180 Q 70 160 60 180 Q 80 200 100 180"
            fill="#85944E"
            className="animate-in zoom-in"
          />
        )}

        {/* Leaf 3 (Right higher) */}
        {leavesCount >= 3 && (
          <path
            d="M100 140 Q 125 120 135 140 Q 115 160 100 140"
            fill="#AAB971"
            className="animate-in zoom-in"
          />
        )}

        {/* Leaf 4 (Top Left) */}
        {leavesCount >= 4 && (
          <path
            d="M100 120 Q 75 100 65 120 Q 85 140 100 120"
            fill="#AAB971"
            className="animate-in zoom-in"
          />
        )}
        
        {/* Leaf 5 (Top Right) */}
        {leavesCount >= 5 && (
          <path
            d="M100 110 Q 120 80 130 100 Q 110 120 100 110"
            fill="#BACC82"
            className="animate-in zoom-in"
          />
        )}

        {/* Leaf 6 (Top Center) */}
        {leavesCount >= 6 && (
          <path
            d="M100 120 Q 110 70 100 50 Q 90 70 100 120"
            fill="#BACC82"
            className="animate-in zoom-in"
          />
        )}

      </svg>
      
      <div className="absolute top-0 w-full text-center p-4">
        {readCount === 0 && <p className="text-[#5C6E35] font-bold text-sm">စာအုပ်များဖတ်ပြီး သစ်ပင်လေးကို စိုက်ပျိုးပါ။</p>}
        {showSeed && !showSprout && <p className="text-[#5C6E35] font-bold text-sm">မျိုးစေ့လေး (စာအုပ် {readCount} အုပ်)</p>}
        {showSprout && !showStem && <p className="text-[#5C6E35] font-bold text-sm">အညှောင့်ပေါက်ပြီ (စာအုပ် {readCount} အုပ်)</p>}
        {showStem && leavesCount === 0 && <p className="text-[#5C6E35] font-bold text-sm">အညှောင့်ရှင်ပြီ (စာအုပ် {readCount} အုပ်)</p>}
        {leavesCount === 1 && <p className="text-[#5C6E35] font-bold text-sm">ရွက်သစ် တရွက်ထွက်ပြီ (စာအုပ် {readCount} အုပ်)</p>}
        {leavesCount >= 2 && <p className="text-[#5C6E35] font-bold text-sm">{leavesCount} ရွက် (စာအုပ် {readCount} အုပ်)</p>}
      </div>
    </div>
  );
};

export default StudyTree;
