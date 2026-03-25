import React from 'react';

export default function ConfidenceMeter({ score, type, label }) {
  // Map score [0, 100] to a stroke offset [circ, 0]
  // Invert color logic based on type (ml vs overall) but generally:
  // > 70 = green
  // < 40 = red
  // 40-70 = amber
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-warning";
  if (score >= 70) colorClass = "text-success";
  if (score <= 40) colorClass = "text-danger";

  if (type === "fake-leaning") {
    // If higher score means more fake, invert colors
    if (score >= 70) colorClass = "text-danger";
    else if (score <= 40) colorClass = "text-success";
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle 
            cx="80" cy="80" r={radius}
            className="stroke-slate-700" 
            strokeWidth="12" fill="transparent" 
          />
          {/* Foreground circle */}
          <circle 
            cx="80" cy="80" r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold font-grotesk ${colorClass}`}>
            {Math.round(score)}%
          </span>
        </div>
      </div>
      <span className="mt-4 font-medium text-textMuted uppercase tracking-wider text-xs">
        {label}
      </span>
    </div>
  );
}
