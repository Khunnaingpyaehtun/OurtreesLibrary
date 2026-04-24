import React from "react";

const treeUrl =
  'url("https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/Trees%20shiloutte.svg")';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-48 md:mt-64 w-full">
      {/* Tree Border on top */}
      <div
        className="absolute top-0 left-0 w-full -translate-y-[80%] pointer-events-none"
        style={{ height: "35vh", minHeight: "260px", maxHeight: "400px" }}
      >
        {/* Layer 1: Base Forest Layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: "#B9C17E",
            maskImage: treeUrl,
            maskSize: "auto 100%",
            maskPosition: "bottom center",
            maskRepeat: "repeat-x",
            WebkitMaskImage: treeUrl,
            WebkitMaskSize: "auto 100%",
            WebkitMaskPosition: "bottom center",
            WebkitMaskRepeat: "repeat-x",
          }}
        />
        {/* Layer 2: Density Layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: "#B9C17E",
            maskImage: treeUrl,
            maskSize: "auto 90%",
            maskPosition: "bottom left 30px",
            maskRepeat: "repeat-x",
            WebkitMaskImage: treeUrl,
            WebkitMaskSize: "auto 90%",
            WebkitMaskPosition: "bottom left 30px",
            WebkitMaskRepeat: "repeat-x",
            transform: "scaleX(-1)",
          }}
        />
        {/* Layer 3: Additional Density Layer for depth */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: "#B9C17E",
            maskImage: treeUrl,
            maskSize: "auto 80%",
            maskPosition: "bottom left 120px",
            maskRepeat: "repeat-x",
            WebkitMaskImage: treeUrl,
            WebkitMaskSize: "auto 80%",
            WebkitMaskPosition: "bottom left 120px",
            WebkitMaskRepeat: "repeat-x",
          }}
        />
      </div>

      <div className="bg-black text-white pt-16 pb-8 px-6 sm:px-12 relative z-10 w-full mt-[-2px]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-2">Our Trees</h3>
              <p className="text-sm text-gray-400">Education Foundation</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Social Media Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Signal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: ourtrees@gmail.com</li>
                <li>Phone: +91 7061543815</li>
                <li>MMEC, Mullana - 133207</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">
                We Accept donation through
              </h3>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/KBZ_Bank_logo.png" alt="KBZ" className="object-contain w-full h-full" />
                </div>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/AYA_Bank_Logo.png" alt="AYA" className="object-contain w-full h-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center sm:text-left">
            <p className="text-xs text-gray-500" align="center">
              © Our Trees Education Foundation . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
