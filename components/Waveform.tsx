import React, { useEffect, useRef } from 'react';

interface WaveformProps {
  isActive: boolean;
  volume: number; // 0 to 1
  color: string;
}

const Waveform: React.FC<WaveformProps> = ({ isActive, volume, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const bars = 30;
    const barWidth = rect.width / bars;
    const centerY = rect.height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (!isActive) {
        // Draw a flat line if inactive
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(rect.width, centerY);
        ctx.strokeStyle = '#e5e7eb'; // Gray-200
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      for (let i = 0; i < bars; i++) {
        // Create a randomized wave effect based on volume
        const baseHeight = 4;
        const volatility = isActive ? (Math.random() * 0.5 + 0.5) : 0;
        // Amplify the volume for visual effect, cap at max height
        const height = baseHeight + (volume * 150 * volatility); 
        
        // Smooth sine wave distribution
        const waveShape = Math.sin((i / bars) * Math.PI);
        const finalHeight = height * waveShape;

        const x = i * barWidth;
        const y = centerY - finalHeight / 2;

        ctx.fillStyle = color;
        
        // Rounded bars
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, finalHeight, 4);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, volume, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-24 rounded-lg bg-white/50"
    />
  );
};

export default Waveform;