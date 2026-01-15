'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const BrainVisualization = dynamic(() => import('./components/BrainVisualization'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60 text-lg">Loading 3D visualization...</div>
    </div>
  ),
});

type Emotion = 'happy' | 'sad' | 'angry' | 'fearful' | 'excited' | 'calm';

const emotions: { id: Emotion; label: string; description: string; gradient: string }[] = [
  { 
    id: 'happy', 
    label: 'Happy', 
    description: 'Joy & Pleasure',
    gradient: 'from-yellow-400 to-orange-500'
  },
  { 
    id: 'sad', 
    label: 'Sad', 
    description: 'Melancholy & Grief',
    gradient: 'from-blue-400 to-blue-600'
  },
  { 
    id: 'angry', 
    label: 'Angry', 
    description: 'Rage & Frustration',
    gradient: 'from-red-500 to-red-700'
  },
  { 
    id: 'fearful', 
    label: 'Fearful', 
    description: 'Anxiety & Threat',
    gradient: 'from-purple-400 to-purple-700'
  },
  { 
    id: 'excited', 
    label: 'Excited', 
    description: 'Arousal & Anticipation',
    gradient: 'from-green-400 to-green-600'
  },
  { 
    id: 'calm', 
    label: 'Calm', 
    description: 'Peace & Relaxation',
    gradient: 'from-teal-400 to-cyan-500'
  },
];

export default function BrainVisualizer() {
  const [activeEmotions, setActiveEmotions] = useState<Emotion[]>(['happy']);

  const toggleEmotion = (emotion: Emotion) => {
    setActiveEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Brain Activity Visualizer
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Explore neural patterns across different emotional states
          </p>
        </div>
      </header>

      {/* 3D Visualization */}
      <div className="absolute inset-0 pt-32 pb-32 md:pb-40">
        <BrainVisualization activeRegions={activeEmotions} />
      </div>

      {/* Emotion Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {emotions.map((emotion) => {
              const isActive = activeEmotions.includes(emotion.id);
              return (
                <button
                  key={emotion.id}
                  onClick={() => toggleEmotion(emotion.id)}
                  className={`
                    relative overflow-hidden rounded-xl p-4 md:p-5 transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-br ${emotion.gradient} shadow-lg shadow-${emotion.gradient.split('-')[1]}-500/50 scale-105` 
                      : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                    }
                  `}
                >
                  <div className="relative z-10">
                    <div className={`text-lg md:text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-white/90'}`}>
                      {emotion.label}
                    </div>
                    <div className={`text-xs md:text-sm ${isActive ? 'text-white/90' : 'text-white/60'}`}>
                      {emotion.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Info text */}
          <div className="mt-4 text-center text-white/50 text-xs md:text-sm">
            Click emotions to see active brain regions • Drag to rotate • Scroll to zoom
          </div>
        </div>
      </div>
    </div>
  );
}

