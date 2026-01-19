import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const RECENT_BOOKINGS = [
  { name: "Marie L. (11ème)", action: "vient de demander un devis", time: "à l'instant" },
  { name: "Thomas B. (Le Marais)", action: "a réservé une visite", time: "il y a 2 min" },
  { name: "Sophie D. (Boulogne)", action: "a terminé sa simulation", time: "il y a 5 min" },
  { name: "Laurent P. (17ème)", action: "vient de demander un devis", time: "il y a 12 min" }
];

const SocialProofToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Show first notification after 10 seconds (as per requirement)
    const initialTimeout = setTimeout(() => {
        showBooking();
    }, 10000);

    const interval = setInterval(() => {
        showBooking();
    }, 25000); // Periodic updates

    return () => {
        clearTimeout(initialTimeout);
        clearInterval(interval);
    };
  }, [currentIndex]);

  const showBooking = () => {
    setVisible(true);
    setTimeout(() => {
        setVisible(false);
        // Advance index for next time
        setCurrentIndex(prev => (prev + 1) % RECENT_BOOKINGS.length);
    }, 5000);
  };

  const booking = RECENT_BOOKINGS[currentIndex];

  if (!visible) return null;

  return (
    <div 
        className="fixed bottom-20 left-4 z-[100] animate-slide-in-left max-w-xs w-full"
    >
      <div className="bg-white backdrop-blur-md text-brand-dark px-4 py-3 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setVisible(false)}>
        
        {/* Icon */}
        <div className="relative shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                {booking.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                <CheckCircle2 size={10} className="text-white" />
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-brand-dark truncate">{booking.name}</p>
            <p className="text-xs text-gray-600 truncate">{booking.action}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                Il y a {booking.time}
            </p>
        </div>

        {/* Dismiss Button */}
        <button 
            onClick={(e) => { e.stopPropagation(); setVisible(false); }}
            className="text-gray-300 hover:text-gray-500 p-1"
        >
            <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default SocialProofToast;