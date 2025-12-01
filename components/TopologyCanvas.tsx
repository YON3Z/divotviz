import React, { useRef, useEffect } from 'react';

const TopologyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;
    let animationFrameId: number;

    const render = () => {
      // Resize logic
      const width = canvas.parentElement?.clientWidth || 300;
      const height = canvas.parentElement?.clientHeight || 200;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#4f46e5'; // Indigo 600
      ctx.lineWidth = 1;

      const cols = 20;
      const rows = 20;
      const cellW = width / (cols * 1.5);
      const cellH = height / (rows * 1.5);
      const offsetX = width / 2;
      const offsetY = height / 3;

      // Draw geometric "Tiled Valley"
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          // Isometric projection logic
          const xx = (x - cols / 2);
          const yy = (y - rows / 2);
          
          // The math from the python script: Z = np.sin(X*3) * np.cos(Y*3)
          // Scaled and animated
          const z = Math.sin(xx * 0.3 + t) * Math.cos(yy * 0.3 + t) * 20;
          
          const isoX = (xx - yy) * cellW * 0.8 + offsetX;
          const isoY = (xx + yy) * cellH * 0.4 - z + offsetY;

          // Draw horizontal lines
          if (x < cols) {
            const nextZ = Math.sin((xx + 1) * 0.3 + t) * Math.cos(yy * 0.3 + t) * 20;
            const nextIsoX = ((xx + 1) - yy) * cellW * 0.8 + offsetX;
            const nextIsoY = ((xx + 1) + yy) * cellH * 0.4 - nextZ + offsetY;
            
            ctx.beginPath();
            ctx.moveTo(isoX, isoY);
            ctx.lineTo(nextIsoX, nextIsoY);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 + (z + 20)/80})`; // Dynamic opacity based on height
            ctx.stroke();
          }

          // Draw vertical lines
          if (y < rows) {
            const nextZ = Math.sin(xx * 0.3 + t) * Math.cos((yy + 1) * 0.3 + t) * 20;
            const nextIsoX = (xx - (yy + 1)) * cellW * 0.8 + offsetX;
            const nextIsoY = (xx + (yy + 1)) * cellH * 0.4 - nextZ + offsetY;

            ctx.beginPath();
            ctx.moveTo(isoX, isoY);
            ctx.lineTo(nextIsoX, nextIsoY);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 + (z + 20)/80})`; // Purple/Magenta
            ctx.stroke();
          }
        }
      }

      t += 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
};

export default TopologyCanvas;