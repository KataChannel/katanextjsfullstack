export default function TargetIcon() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring - Light Blue */}
      <circle cx="200" cy="200" r="180" fill="#5eb3e8" opacity="0.9"/>
      
      {/* Second ring - Medium Blue */}
      <circle cx="200" cy="200" r="145" fill="#4a9ad8" opacity="0.95"/>
      
      {/* Third ring - Darker Blue */}
      <circle cx="200" cy="200" r="110" fill="#3681c8" opacity="0.95"/>
      
      {/* Fourth ring - Deep Blue */}
      <circle cx="200" cy="200" r="75" fill="#2c5eb8" opacity="0.95"/>
      
      {/* Purple section (bottom) */}
      <path 
        d="M 200 200 L 200 275 A 75 75 0 0 1 130 230 Z" 
        fill="#6b4fb8" 
        opacity="0.95"
      />
      
      {/* Center circle - Bright Blue */}
      <circle cx="200" cy="200" r="40" fill="#3498db"/>
      
      {/* Inner white circle */}
      <circle cx="200" cy="200" r="20" fill="white"/>
      
      {/* Arrow hitting the target */}
      <g transform="translate(-20, -100)">
        {/* Arrow shaft */}
        <line 
          x1="350" 
          y1="120" 
          x2="220" 
          y2="290" 
          stroke="#4a5fb8" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        
        {/* Arrow head */}
        <polygon 
          points="220,290 230,275 215,280" 
          fill="#4a5fb8"
        />
        
        {/* Arrow fletching */}
        <path 
          d="M 340 130 L 355 115 L 350 120 L 345 125 Z" 
          fill="#5d8dd9" 
          opacity="0.8"
        />
        <path 
          d="M 345 135 L 360 125 L 355 130 L 350 135 Z" 
          fill="#5d8dd9" 
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
