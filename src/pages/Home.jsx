import React, { useState, useEffect } from 'react';

// --- Custom Keyframes for the animation ---
// Note: Increased translate values (500px+) to push parcels far off-screen.
const customKeyframes = `
  /* Keyframe for the main box - remains static and visible */
  @keyframes popOpen {
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  /* Keyframes for the parcels flying out to the edge of the screen */
  /* Keyframes use 'to' (100%) to define the final, exploded state */
  @keyframes flyOut-A { to { transform: translate(-600px, -800px) rotate(45deg); opacity: 0; } }
  @keyframes flyOut-B { to { transform: translate(800px, -500px) rotate(-30deg); opacity: 0; } }
  @keyframes flyOut-C { to { transform: translate(-700px, 700px) rotate(-60deg); opacity: 0; } }
  @keyframes flyOut-D { to { transform: translate(600px, 800px) rotate(20deg); opacity: 0; } }
  @keyframes flyOut-E { to { transform: translate(0px, -800px) rotate(10deg); opacity: 0; } }
  @keyframes flyOut-F { to { transform: translate(-800px, 0px) rotate(-10deg); opacity: 0; } }
`;

// Helper component for a single flying parcel (emoji based, now using 📦)
const FlyingParcel = ({ animationKey, delay }) => (
  <div
    // We use a simple utility class for positioning and size
    className="absolute text-4xl" // Slightly larger for more visual impact
    style={{
      // Center the parcel initially over the main box
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', 
      
      // Apply the animation based on the keyframe
      animation: `flyOut-${animationKey} 2.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms forwards`, // Increased duration for the longer travel
      opacity: 1, 
    }}
  >
    {/* Using the 📦 parcel box emoji for the flying parcels */}
    📦
  </div>
);


export default function Home() {
  const [animationCycle, setAnimationCycle] = useState(0);

  // The duration for one full cycle: Increased to 2.8s to match the longer animation time (2.0s + 0.6s max delay + buffer)
  const CYCLE_DURATION = 2800; // 2.8 seconds

  // Inject Custom Keyframes on Component Mount
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Use useEffect to manage the continuous looping
  useEffect(() => {
    const loopTimer = setTimeout(() => {
      // Increment the cycle counter to trigger a re-render of the FlyingParcels
      setAnimationCycle(prevCycle => prevCycle + 1);
    }, CYCLE_DURATION);

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(loopTimer);
  }, [animationCycle]); // Re-run effect every time a cycle completes

  // Array of parcel definitions to easily map over them
  const parcels = [
    { key: "A", delay: 100 },
    { key: "B", delay: 200 },
    { key: "C", delay: 300 },
    { key: "D", delay: 400 },
    { key: "E", delay: 500 },
    { key: "F", delay: 600 },
  ];

  return (
    <div className="p-8 min-h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      
      {/* --- Header Section --- */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-teal-700 mb-4">Welcome to Campus Order Guard</h1>
        <p className="text-xl text-gray-600">Manage student registrations and dashboards seamlessly.</p>
      </div>

      {/* --- Animation Container --- */}
      {/* Added overflow-visible to the container and overflow-hidden to the screen div to better control boundaries */}
      <div className="relative w-80 h-80 flex items-center justify-center overflow-visible">
        
        {/* The flying parcels: keying by the animationCycle forces a remount/restart of the CSS animation */}
        <div key={animationCycle}>
          {parcels.map(parcel => (
            <FlyingParcel 
              key={parcel.key} 
              animationKey={parcel.key} 
              delay={parcel.delay} 
            />
          ))}
        </div>

        {/* Main Parcel Box (Emoji) - Static and always visible */}
        <div
          className={`text-8xl shadow-2xl rounded-lg transform transition-transform duration-500`}
        >
          📦
        </div>

      </div>
      {/* --- End Animation Container --- */}

      
    </div>
  );
}