import React from 'react';

export const TreeBorder = () => {
  const treeUrl = 'url("https://raw.githubusercontent.com/Khunnaingpyaehtun/Ourtrees/main/Trees%20shiloutte.svg")';

  return (
    <div className="absolute bottom-[-10vh] left-0 w-full z-0 pointer-events-none" style={{ height: '35vh', minHeight: '260px', maxHeight: '400px' }}>
      
      {/* Layer 1: Base Forest Layer */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: '#B9C17E', 
          maskImage: treeUrl,
          maskSize: 'auto 100%',
          maskPosition: 'bottom center',
          maskRepeat: 'repeat-x',
          WebkitMaskImage: treeUrl,
          WebkitMaskSize: 'auto 100%',
          WebkitMaskPosition: 'bottom center',
          WebkitMaskRepeat: 'repeat-x',
        }}
      />
      {/* Layer 2: Density Layer (Fully solid color, offset and flipped) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: '#B9C17E', 
          maskImage: treeUrl,
          maskSize: 'auto 90%', 
          maskPosition: 'bottom left 30px',
          maskRepeat: 'repeat-x',
          WebkitMaskImage: treeUrl,
          WebkitMaskSize: 'auto 90%',
          WebkitMaskPosition: 'bottom left 30px',
          WebkitMaskRepeat: 'repeat-x',
          transform: 'scaleX(-1)', 
        }}
      />
    </div>
  );
};
