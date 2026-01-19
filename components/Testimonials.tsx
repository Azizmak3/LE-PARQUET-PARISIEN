import React from 'react';
import { Star, Quote, ArrowRight, ArrowLeftRight } from 'lucide-react';

const REVIEWS = [
  {
    name: "Thomas & Marie L.",
    loc: "Paris 3ème (Marais)",
    type: "Rénovation Point de Hongrie",
    date: "Décembre 2024",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    text: "On ne reconnaît plus notre salon. Le parquet du 19ème siècle brille comme au premier jour. L'équipe a été d'une discrétion absolue et le chantier a duré exactement les 3 jours annoncés. Un sans faute."
  },
  {
    name: "Sophie D.",
    loc: "Boulogne-Billancourt",
    type: "Pose Parquet Chêne Massif",
    date: "Janvier 2025",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    text: "J'avais peur de la poussière mais ils ont utilisé des machines aspirantes ultra-efficaces. Le rendu est magnifique et le prix était 20% moins cher que les autres devis que j'avais reçus."
  },
  {
    name: "Marc-Olivier P.",
    loc: "Paris 17ème",
    type: "Vitrification Mate",
    date: "Novembre 2024",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    text: "Le calculateur en ligne m'a donné un prix quasi exact. L'artisan est venu valider le lendemain et les travaux ont commencé la semaine suivante. Efficacité redoutable pour Paris."
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-gray-50 border-t border-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
           <h2 className="text-3xl md:text-5xl font-sans font-bold text-brand-dark mb-4">Ils nous ont fait confiance</h2>
           <p className="text-xl text-gray-500">Note moyenne de <span className="text-action-orange font-bold">4.9/5</span> sur plus de 500 chantiers.</p>
        </div>

        {/* MOBILE: Hint for scrolling */}
        <div className="md:hidden flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
            <ArrowLeftRight size={14} /> Glissez pour lire les avis
        </div>

        <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            {REVIEWS.map((review, i) => (
                <div key={i} className="min-w-[85vw] md:min-w-0 snap-center bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
                    <Quote size={40} className="absolute top-6 right-6 text-gray-100 group-hover:text-orange-100 transition-colors" />
                    
                    <div className="flex items-center gap-1 text-yellow-400 mb-6">
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                        <Star size={18} fill="currentColor" />
                    </div>

                    <p className="text-gray-600 mb-8 leading-relaxed italic flex-1">
                        "{review.text}"
                    </p>

                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                        <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                        <div>
                            <div className="font-bold text-brand-dark">{review.name}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase">{review.loc}</div>
                            <div className="text-xs text-action-orange mt-0.5">{review.type}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* CLOSING CTA */}
        <div className="mt-8 md:mt-16 text-center">
            <a href="#calculator" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white font-bold rounded-xl shadow-lg hover:bg-black transition-colors transform hover:-translate-y-1 text-sm md:text-base">
                Rejoindre les clients satisfaits à Paris <ArrowRight size={18} />
            </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;