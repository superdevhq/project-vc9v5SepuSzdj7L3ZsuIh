
import { useEffect, useRef } from 'react';
import p5 from 'p5';

const Index = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new p5 instance
    const sketch = (p: p5) => {
      let cubes: Cube[] = [];
      const numCubes = 20;
      
      class Cube {
        x: number;
        y: number;
        z: number;
        size: number;
        rotX: number;
        rotY: number;
        rotZ: number;
        rotSpeed: number;
        color: p5.Color;
        
        constructor() {
          this.x = p.random(-300, 300);
          this.y = p.random(-300, 300);
          this.z = p.random(-500, 200);
          this.size = p.random(20, 60);
          this.rotX = p.random(p.TWO_PI);
          this.rotY = p.random(p.TWO_PI);
          this.rotZ = p.random(p.TWO_PI);
          this.rotSpeed = p.random(0.005, 0.02);
          this.color = p.color(
            p.random(100, 255),
            p.random(100, 255),
            p.random(100, 255),
            p.random(150, 220)
          );
        }
        
        update(mouseX: number, mouseY: number) {
          // Rotate based on mouse position
          const targetRotX = p.map(mouseY, 0, p.height, -0.1, 0.1);
          const targetRotY = p.map(mouseX, 0, p.width, -0.1, 0.1);
          
          this.rotX += this.rotSpeed + targetRotX * 0.05;
          this.rotY += this.rotSpeed + targetRotY * 0.05;
          this.rotZ += this.rotSpeed * 0.5;
        }
        
        display() {
          p.push();
          p.translate(this.x, this.y, this.z);
          p.rotateX(this.rotX);
          p.rotateY(this.rotY);
          p.rotateZ(this.rotZ);
          p.fill(this.color);
          p.stroke(255);
          p.strokeWeight(1);
          p.box(this.size);
          p.pop();
        }
      }
      
      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        p.colorMode(p.RGB, 255, 255, 255, 255);
        
        // Create cubes
        for (let i = 0; i < numCubes; i++) {
          cubes.push(new Cube());
        }
      };
      
      p.draw = () => {
        p.background(10, 20, 30);
        p.ambientLight(60, 60, 60);
        p.pointLight(255, 255, 255, 0, 0, 300);
        
        // Add some camera movement
        const camX = p.map(p.mouseX, 0, p.width, -100, 100);
        const camY = p.map(p.mouseY, 0, p.height, -100, 100);
        p.camera(camX, camY, 500, 0, 0, 0, 0, 1, 0);
        
        // Update and display cubes
        cubes.forEach(cube => {
          cube.update(p.mouseX, p.mouseY);
          cube.display();
        });
      };
      
      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    // Create new p5 instance
    const p5Instance = new p5(sketch, canvasRef.current);

    // Cleanup function
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <div ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white bg-black/50 p-3 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Interactive 3D Cubes</h1>
        <p>Move your mouse to interact with the 3D space</p>
      </div>
    </div>
  );
};

export default Index;
