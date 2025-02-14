import React, { useRef, useEffect, useState } from 'react';
import { initializeGame } from './gameEngine';

export default function Game() {
  const mountRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const cleanup = initializeGame(mountRef.current, setScore, score);
    return cleanup;
  }, [score]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-screen"></div>
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
        Score: {score}
      </div>
      <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
        <a
          href="https://www.zapt.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="underline cursor-pointer"
        >
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}