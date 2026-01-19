import React from 'react';
import { Play } from 'lucide-react';

const VideoSection: React.FC = () => {
  return (
    <section className="bg-black py-0 relative overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
      
      <div className="container mx-auto px-0 md:px-4 max-w-6xl relative z-10">
        <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden md:rounded-b-3xl shadow-2xl">
            {/* Simulated Video Background using a High Quality GIF/Image */}
            <img 
                src="https://i.postimg.cc/gjH4j0kK/Generated-Image-January-19-2026-12-34AM.jpg" 
                alt="Transformation Parquet"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/20">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <Play size={32} className="text-white ml-1 fill-white" />
                </div>
                
                <h3 className="text-4xl md:text-6xl font-sans font-bold text-white mb-2 tracking-tight">
                    48 Heures. 1 Parquet. <br/>Une Transformation.
                </h3>
                <p className="text-gray-300 text-lg md:text-xl font-light">
                    Regardez comment nous redonnons vie à un sol haussmannien abîmé.
                </p>
                
                <div className="mt-8 flex gap-2">
                    <div className="bg-action-orange text-white px-3 py-1 text-xs font-bold rounded uppercase">Avant: Rayé</div>
                    <div className="text-white opacity-50">→</div>
                    <div className="bg-green-500 text-white px-3 py-1 text-xs font-bold rounded uppercase">Après: Neuf</div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;