import React, { useEffect, useState } from 'react';
import { Progress } from "./progress";

export const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // Fast at first, then slower as it approaches 100
        const remaining = 100 - oldProgress;
        const increment = Math.max(0.5, (remaining / 100) * 15);
        const newProgress = Math.min(oldProgress + increment, 99.9);
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Progress value={progress} className="w-[30%]" />
    </div>
  );
};
