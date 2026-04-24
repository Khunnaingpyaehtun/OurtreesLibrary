import React, { useState, useEffect } from "react";
import { Star, Trash2, Eye } from "lucide-react";
import { Book } from "../types";
import { COLORS, DDC_CATEGORIES } from "../constants";

interface BookCardProps {
  book: Book;
  isAdmin: boolean;
  onClick: (book: Book) => void;
  onDelete: (id: number) => void;
}

const BookCoverSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 291 396" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.15))' }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M290.452 340.188C290.447 345.086 290.864 350.299 290.31 355.165C289.401 363.157 279.802 371.364 270.65 372.013C265.458 372.38 260.07 372.142 254.855 372.136L117.659 372.115C117.671 372.254 117.694 372.375 117.733 372.464L31.8476 372.273C25.0189 372.267 20.0474 372.712 14.2001 368.676C6.59749 361.492 4.49487 350.312 10.4179 341.279C15.5595 333.44 23.8017 332.59 32.2851 332.576L44.2011 332.589L103.038 332.615C103.038 332.588 103.038 332.56 103.038 332.532L117.51 332.547L153.494 332.475L265.29 332.493C274.951 332.528 284.809 334.779 289.414 323.853C289.806 322.924 289.971 321.921 290.372 321L290.452 340.188Z" fill="#2E3946"/>
    <path d="M195 393.298V332.242V329H232V396L216.951 380.898L195 393.298Z" fill={color}/>
    <path d="M195 337V329H232V337H195Z" fill="black" fillOpacity="0.2"/>
    <path d="M14.4047 369C3.95625 367.439 0.25104 353.539 0.195741 344.875L0.118269 39.8202C0.0969849 36.237 -0.222208 32.3688 0.286829 28.8301C2.14409 15.9332 14.5418 3.45712 27.3803 0.743492C32.8892 -0.420896 39.3711 0.13225 45 0.125246L44.9294 332.973L32.7241 332.898C24.1305 332.911 15.7812 333.761 10.5727 341.601C4.57254 350.635 6.70306 361.816 14.4047 369Z" fill={color}/>
    <path d="M14.4047 369C3.95625 367.439 0.25104 353.539 0.195741 344.875L0.118269 39.8202C0.0969849 36.237 -0.222208 32.3688 0.286829 28.8301C2.14409 15.9332 14.5418 3.45712 27.3803 0.743492C32.8892 -0.420896 39.3711 0.13225 45 0.125246L44.9294 332.973L32.7241 332.898C24.1305 332.911 15.7812 333.761 10.5727 341.601C4.57254 350.635 6.70306 361.816 14.4047 369Z" fill="black" fillOpacity="0.2"/>
    <path d="M44.1488 0.0799874L269.209 0C279.142 0.00694221 287.962 1.31452 290.719 13.4632C291.181 15.5004 290.933 17.9451 290.939 20.0361L290.929 320.705L290.664 321.118C290.204 322.086 290.047 323.158 289.63 324.146C285.025 335.072 275.167 332.82 265.506 332.786L153.71 332.767L117.725 332.84L44 332.766L44.1488 0.0799874Z" fill={color}/>
  </svg>
);

const BookCard: React.FC<BookCardProps> = ({
  book,
  isAdmin,
  onClick,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [book.coverUrl]);

  const getBookCoverColor = (ddc: string) => {
    const category = DDC_CATEGORIES.find((c) => c.code === ddc);
    return category ? category.color : COLORS.primary;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this book?")) {
      onDelete(book.id);
    }
  };

  const baseColor = getBookCoverColor(book.ddc);

  return (
    <div
      className="flex flex-col items-center group cursor-pointer w-full text-center"
      onClick={() => onClick(book)}
    >
      <div className="relative w-full aspect-[291/396] max-w-[144px] sm:max-w-[160px] mx-auto transition-transform duration-300 transform group-hover:-translate-y-2 mb-4">
         <div className="absolute inset-0">
           <BookCoverSVG color={baseColor} />
         </div>
         
         <div className="absolute inset-0 z-10 flex flex-col p-2 text-white">
            <span className="absolute left-[18%] top-[5%] text-[10px] font-semibold tracking-wide drop-shadow-sm opacity-95">ID- {book.id}</span>
            
            <div className="absolute top-[35%] left-[20%] right-[5%] flex items-center justify-center">
               <h4 className="text-[11px] sm:text-[12px] font-semibold line-clamp-4 leading-snug drop-shadow-md text-center text-white/95">
                 {book.title}
               </h4>
            </div>
         </div>
      </div>

      <div className="mt-2 px-1 w-full group-hover:text-indigo-600 transition-colors">
        <h5 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
          {book.title}
        </h5>
        <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1 line-clamp-2">
          {book.author}
        </p>
      </div>

      {isAdmin && (
        <button
          onClick={handleDelete}
          className="mt-2 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
          aria-label="Delete book"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default BookCard;
