import { useEffect, useState } from "react";

export default function Animation1() {
  const [cycle, setCycle] = useState(0);
  const CYCLE_DURATION = 3000;

  // Inject keyframes once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes flyOut-A { to { transform: translate(-600px, -800px) rotate(45deg); opacity: 0; } }
      @keyframes flyOut-B { to { transform: translate(800px, -500px) rotate(-30deg); opacity: 0; } }
      @keyframes flyOut-C { to { transform: translate(-700px, 700px) rotate(-60deg); opacity: 0; } }
      @keyframes flyOut-D { to { transform: translate(600px, 800px) rotate(20deg); opacity: 0; } }
      @keyframes flyOut-E { to { transform: translate(0px, -900px) rotate(10deg); opacity: 0; } }
      @keyframes flyOut-F { to { transform: translate(-900px, 0px) rotate(-10deg); opacity: 0; } }
      @keyframes flyOut-G { to { transform: translate(900px, 0px) rotate(15deg); opacity: 0; } }
      @keyframes flyOut-H { to { transform: translate(0px, 900px) rotate(-20deg); opacity: 0; } }
      @keyframes flyOut-I { to { transform: translate(700px, 700px) rotate(30deg); opacity: 0; } }
      @keyframes flyOut-J { to { transform: translate(-700px, -700px) rotate(-45deg); opacity: 0; } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Loop animation
  useEffect(() => {
    const timer = setTimeout(() => setCycle(c => c + 1), CYCLE_DURATION);
    return () => clearTimeout(timer);
  }, [cycle]);

  const parcels = [
    { key: "A", delay: 0 },
    { key: "B", delay: 100 },
    { key: "C", delay: 200 },
    { key: "D", delay: 300 },
    { key: "E", delay: 400 },
    { key: "F", delay: 500 },
    { key: "G", delay: 600 },
    { key: "H", delay: 700 },
    { key: "I", delay: 800 },
    { key: "J", delay: 900 },
  ];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center opacity-35">
        <div key={cycle}>
          {parcels.map(p => (
            <div
              key={p.key}
              className="absolute text-4xl"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                animation: `flyOut-${p.key} 2s cubic-bezier(0.25,0.46,0.45,0.94) ${p.delay}ms forwards`,
              }}
            >
              📦
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
