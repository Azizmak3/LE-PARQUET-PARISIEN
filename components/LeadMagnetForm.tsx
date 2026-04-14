import React, { useState } from 'react';
import { CheckCircle2, BookOpen } from 'lucide-react';
import { subscribeToNewsletter } from '../services/newsletterService';

interface Props {
  source: string;
  theme?: 'light' | 'dark';
}

const LeadMagnetForm: React.FC<Props> = ({ source, theme = 'light' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    const success = await subscribeToNewsletter(email, source);
    if (success) {
      setStatus('success');
    } else {
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className={`border rounded-xl p-6 text-center animate-fade-in ${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'}`}>
          <CheckCircle2 className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
        </div>
        <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-brand-dark'}`}>C'est envoyé !</h4>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Vérifiez votre boîte mail (et vos spams). Votre guide PDF vous attend.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email..." 
          className={`w-full px-4 py-3.5 rounded-xl border focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-brand-dark'}`}
        />
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className="w-full bg-action-orange hover:bg-action-hover text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {status === 'submitting' ? 'Envoi en cours...' : (
            <>
              <BookOpen size={18} /> Recevoir le guide
            </>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">
        Aucun spam. Désabonnement en 1 clic.
      </p>
    </form>
  );
};

export default LeadMagnetForm;
