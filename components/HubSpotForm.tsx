import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

interface HubSpotFormProps {
  onSuccess?: () => void;
  className?: string;
  submitButtonText?: string;
}

const HubSpotForm: React.FC<HubSpotFormProps> = ({ 
  onSuccess, 
  className,
  submitButtonText = "DÉBLOQUER LE RÉSULTAT" 
}) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    message: '' // Optional project details
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Portal and Form IDs provided by you
    const PORTAL_ID = '147631066';
    const FORM_ID = '8049f85a-cd4f-4d60-862d-87ede03e6467';

    // Construct HubSpot API Payload
    const payload = {
      fields: [
        { name: 'firstname', value: formData.firstname },
        { name: 'lastname', value: formData.lastname },
        { name: 'email', value: formData.email },
        { name: 'message', value: formData.message } // Mapping generic project field
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      // Even if HubSpot returns 400/403 (CORS issues sometimes occur with direct browser calls),
      // we treat it as success for the USER EXPERIENCE to unlock the content.
      // In production, a server proxy is recommended for 100% reliability.
      
      console.log('Form submission attempted', response.status);
      
      setStatus('success');
      
      // Delay slightly to show success state before unlocking
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Submission error', error);
      // Fallback: Unlock anyway so user isn't stuck
      setStatus('success');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1000);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in bg-white/90 backdrop-blur-sm rounded-xl">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-xl font-bold text-brand-dark mb-2">C'est tout bon !</h3>
        <p className="text-gray-500">Chargement de votre résultat...</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-dark flex gap-0.5">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.firstname}
              onChange={e => setFormData({...formData, firstname: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-action-orange focus:bg-white outline-none transition-all placeholder:text-gray-400 font-sans"
              placeholder="Thomas"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-brand-dark flex gap-0.5">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.lastname}
              onChange={e => setFormData({...formData, lastname: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-action-orange focus:bg-white outline-none transition-all placeholder:text-gray-400 font-sans"
              placeholder="Dupont"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-brand-dark flex gap-0.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-action-orange focus:bg-white outline-none transition-all placeholder:text-gray-400 font-sans"
            placeholder="thomas.dupont@email.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-brand-dark flex justify-between">
            Votre projet <span className="text-gray-400 font-normal text-xs">(Facultatif)</span>
          </label>
          <textarea
            rows={2}
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-action-orange focus:bg-white outline-none transition-all placeholder:text-gray-400 resize-none font-sans"
            placeholder="Surface, type de sol actuel..."
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full group bg-brand-dark hover:bg-black text-white font-bold text-sm uppercase tracking-wide py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <>
              {submitButtonText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-4 bg-gray-50 py-2 rounded-lg">
           <Lock size={10} /> Vos données sont sécurisées et ne seront jamais revendues.
        </div>

      </form>
    </div>
  );
};

export default HubSpotForm;