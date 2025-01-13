"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import * as THREE from "three";
import { motion } from "framer-motion";
import Image from 'next/image';

export function Hero() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 23,
    minutes: 4,
    seconds: 47,
  });

  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    // Create Squid Game shapes for both sides
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.CircleGeometry(0.8, 32),          // Circle
      new THREE.BoxGeometry(1.2, 1.2, 0.1),       // Square
      new THREE.ConeGeometry(0.8, 1.2, 3)         // Triangle
    ];

    const materials = [
      new THREE.MeshBasicMaterial({ 
        color: 0xFF1493,  // Pink
        wireframe: true,
        transparent: true,
        opacity: 0.6
      }),
      new THREE.MeshBasicMaterial({ 
        color: 0x00FF00,  // Green
        wireframe: true,
        transparent: true,
        opacity: 0.6
      })
    ];

    // Create shapes for left and right sides
    for (let side = -1; side <= 1; side += 2) { // -1 for left, 1 for right
      for (let i = 0; i < 5; i++) {
        const geometryIndex = i % geometries.length;
        const materialIndex = i % materials.length;
        
        const shape = new THREE.Mesh(geometries[geometryIndex], materials[materialIndex]);
        
        // Position shapes on sides
        shape.position.x = side * (8 + Math.random() * 2); // Spread on X axis
        shape.position.y = (i - 2) * 3; // Spread vertically
        shape.position.z = -5 + Math.random() * 2; // Vary depth

        // Add animation properties
        shape.userData = {
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          floatSpeed: 0.005 + Math.random() * 0.005,
          floatOffset: Math.random() * Math.PI * 2,
          originalY: shape.position.y
        };

        shapes.push(shape);
        scene.add(shape);
      }
    }

    camera.position.z = 15;

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      shapes.forEach((shape) => {
        // Rotation animation
        shape.rotation.x += shape.userData.rotationSpeed;
        shape.rotation.y += shape.userData.rotationSpeed;

        // Floating animation
        shape.position.y = shape.userData.originalY + Math.sin(time + shape.userData.floatOffset) * 1.5;
        
        // Subtle scale pulse
        shape.scale.setScalar(1 + Math.sin(time * 2 + shape.userData.floatOffset) * 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      shapes.forEach(shape => {
        scene.remove(shape);
        shape.geometry.dispose();
        if (Array.isArray(shape.material)) {
          shape.material.forEach(m => m.dispose());
        } else {
          shape.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="container mx-auto px-4 py-4 md:py-8 relative overflow-hidden min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8)), url('/bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Three.js Background */}
      {/* <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0"></div> */}

      {/* Left Side Decorative Elements */}
      <div className="absolute left-0 inset-y-0 w-32 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"
            style={{ left: `${i * 12}px` }}
          />
        ))}
      </div>

      {/* Right Side Decorative Elements */}
      <div className="absolute right-0 inset-y-0 w-32 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-pink-500/20 to-transparent"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"
            style={{ right: `${i * 12}px` }}
          />
        ))}
      </div>

      {/* Left Side Guards */}
      {/* <div className="absolute left-10 inset-y-0 flex flex-col justify-center gap-8 pointer-events-none">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-48 h-48 md:w-64 md:h-64"
        >
          <div className="absolute inset-0 bg-[#FF1493] rounded-full opacity-20 blur-lg animate-pulse"></div>
          <div className="relative w-full h-full">
            <Image
              src="/gaurd.png"
              alt="Squid Game Guards"
              width={256}
              height={256}
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </div> */}

      {/* Right Side Guards */}
      {/* <div className="absolute right-10 inset-y-0 flex flex-col justify-center gap-8 pointer-events-none">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-48 h-48 md:w-64 md:h-64"
        >
          <div className="absolute inset-0 bg-[#FF1493] rounded-full opacity-20 blur-lg animate-pulse"></div>
          <div className="relative w-full h-full">
            <Image
              src="/gaurd.png"
              alt="Squid Game Guards"
              width={256}
              height={256}
              className="w-full h-full object-contain transform scale-x-[-1]"
            />
          </div>
        </motion.div>
      </div> */}

      {/* Add floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              y: [null, Math.random() * -500],
              scale: [0, 1, 0],
            }}
            transition={{ 
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? '#FF1493' : '#00FF00',
              opacity: 0.3,
              filter: 'blur(2px)'
            }}
          />
        ))}
      </div>

      {/* Logo and Timer Container */}
      <div className="  scale-125 flex flex-col items-center z-10 mt-16 md:mt-20">
        {/* Logo Image */}
        <div className="relative group">
          <div className="absolute inset-0 animate-pulse bg-pink-500/20 blur-3xl -z-10"></div>
          <img
            src="/newele.png"
            alt="Event Logo"
            className="w-[500px] md:w-[600px] lg:w-[800px] mx-auto hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          />
        </div>

        {/* Timer */}
        <div className="flex gap-4 md:gap-8 text-white -mt-20 md:-mt-28 lg:-mt-12">
          {[
            { value: countdown.days, label: "DAYS" },
            { value: countdown.hours, label: "HOURS" },
            { value: countdown.minutes, label: "MINUTES" },
            { value: countdown.seconds, label: "SECONDS" },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-pink-500/5 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold font-mono tracking-wider group-hover:text-pink-500 transition-colors animate-[pulse_1s_ease-in-out_infinite]">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-[10px] md:text-xs lg:text-sm text-pink-200">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <button 
        className="relative bg-pink-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-pink-600 transition-all hover:scale-105 shadow-[0_0_15px_rgba(236,72,153,0.5)] group overflow-hidden z-10 mt-8 md:mt-12"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
        <Play className="h-4 w-4 md:h-5 md:w-5" />
        JOIN THE GAME
        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;

export default Hero;
