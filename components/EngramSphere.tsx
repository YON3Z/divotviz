import React, { useRef, useEffect } from 'react';

const EngramSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate points on a sphere
    const points: { x: number; y: number; z: number; color: string; size: number }[] = [];
    const numPoints = 200;
    
    // Background dots
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.8;
      points.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        color: '#06b6d4', // Cyan
        size: 1.5
      });
    }

    // The "New Memory" star
    points.push({ x: 0.5, y: 0.5, z: 0.5, color: '#84cc16', size: 6 }); // Lime

    let angleX = 0;
    let angleY = 0;
    let animationFrameId: number;

    const render = () => {
      const width = canvas.parentElement?.clientWidth || 300;
      const height = canvas.parentElement?.clientHeight || 200;
      const scale = Math.min(width, height) * 0.4;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      
      // Sort points by Z for depth buffer simulation
      const projectedPoints = points.map(p => {
        // Rotate Y
        let x1 = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
        let z1 = p.z * Math.cos(angleY) + p.x * Math.sin(angleY);
        
        // Rotate X
        let y2 = p.y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + p.y * Math.sin(angleX);

        return {
          x: x1 * scale + width / 2,
          y: y2 * scale + height / 2,
          z: z2,
          color: p.color,
          size: p.size
        };
      }).sort((a, b) => a.z - b.z);

      projectedPoints.forEach(p => {
        const alpha = (p.z + 1) / 2; // Fade out back points
        if (alpha < 0.1) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#84cc16' ? p.color : `rgba(6, 182, 212, ${alpha})`;
        ctx.fill();
        
        // Glow for the main memory
        if (p.size > 4) {
           ctx.shadowBlur = 15;
           ctx.shadowColor = p.color;
           ctx.stroke();
           ctx.shadowBlur = 0;
        }
      });

      angleY += 0.01;
      angleX += 0.005;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
};

export default EngramSphere;