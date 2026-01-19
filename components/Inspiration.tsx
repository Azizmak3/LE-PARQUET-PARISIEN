import React, { useState } from 'react';
    import { Wand2, Loader2, Download } from 'lucide-react';
    import { generateInspiration } from '../services/geminiService';

    const Inspiration: React.FC = () => {
      const [prompt, setPrompt] = useState("Un salon haussmannien luxueux avec parquet en point de Hongrie, murs blancs, cheminée en marbre, lumière naturelle.");
      const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
      const [generatedImage, setGeneratedImage] = useState<string | null>(null);
      const [isGenerating, setIsGenerating] = useState(false);

      const handleGenerate = async () => {
        setIsGenerating(true);
        const result = await generateInspiration(prompt, size);
        setGeneratedImage(result);
        setIsGenerating(false);
      };

      return (
        <section className="py-24 bg-surface-gray font-sans">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-8">
                <div>
                  <span className="text-action-orange font-sans italic text-2xl">Studio de Création</span>
                  <h2 className="text-4xl font-sans font-bold text-brand-dark mt-2">Générez Votre Intérieur de Rêve</h2>
                  <p className="text-gray-600 mt-4">
                    Utilisez notre IA générative (Pro) pour visualiser des concepts. Choisissez votre résolution et décrivez votre vision.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Votre Vision</label>
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-brand-dark h-32 focus:ring-2 focus:ring-action-orange outline-none resize-none font-sans"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-brand-dark mb-2">Qualité du Rendu</label>
                      <div className="flex gap-4">
                        {['1K', '2K', '4K'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSize(s as any)}
                            className={`flex-1 py-2 rounded-lg font-medium transition-all ${size === s ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full py-4 bg-action-orange hover:bg-action-hover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" /> : <Wand2 />}
                      Générer le Concept
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <div className="aspect-square bg-white rounded-2xl shadow-2xl overflow-hidden relative flex items-center justify-center border-8 border-white">
                  {generatedImage ? (
                    <img src={generatedImage} alt="Generated Inspiration" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8">
                      <Wand2 size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-400 font-sans text-xl">Le résultat apparaîtra ici</p>
                    </div>
                  )}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 size={48} className="mx-auto text-action-orange animate-spin mb-4" />
                        <p className="text-brand-dark font-medium">Création en cours...</p>
                      </div>
                    </div>
                  )}
                  {generatedImage && (
                     <a href={generatedImage} download="inspiration.png" className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition-transform text-brand-dark">
                       <Download size={20} />
                     </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };

    export default Inspiration;