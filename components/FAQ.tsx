import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Le devis est-il vraiment gratuit ?",
    answer: "Oui, à 100%. Que vous utilisiez notre simulateur en ligne ou que vous demandiez le passage d'un artisan, vous ne paierez jamais pour obtenir un chiffrage. C'est notre engagement."
  },
  {
    question: "Mon parquet a pris l'eau, est-ce réparable ?",
    answer: "Oui, dans 90% des cas. Nous sommes spécialistes du sauvetage après dégât des eaux (séchage, dépose partielle, raccord invisible). Ne tardez pas : plus vous attendez, plus le bois se déforme. Nous fournissons le devis pour votre assurance."
  },
  {
    question: "Quels sont les délais d'intervention sur Paris ?",
    answer: "Pour les urgences (dégâts des eaux, vente immobilière), nous pouvons intervenir sous 48h. Pour les chantiers classiques, comptez en moyenne 5 à 10 jours après validation du devis."
  },
  {
    question: "Les travaux sont-ils garantis ?",
    answer: "Absolument. Tous nos artisans partenaires sont vérifiés et possèdent une assurance décennale à jour. Vos sols sont couverts pendant 10 ans contre tout défaut de pose."
  },
  {
    question: "Le prix du simulateur est-il définitif ?",
    answer: "Notre simulateur vous donne une fourchette précise à 95% basée sur les prix du marché. Le prix final est validé lors de la visite technique gratuite pour s'assurer qu'il n'y a pas de surprises (support abîmé, etc.)."
  }
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left group"
      >
        <span className={`font-bold text-base md:text-lg transition-colors pr-4 ${isOpen ? 'text-brand-blue' : 'text-brand-dark group-hover:text-brand-blue'}`}>
          {question}
        </span>
        <div className={`p-1 rounded-full shrink-0 ${isOpen ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-500'}`}>
           {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 leading-relaxed pr-8 text-sm md:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const handleScrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            
            <div className="md:w-1/3">
                <div className="sticky top-24">
                    <div className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-xs mb-3">
                        <HelpCircle size={16} />
                        <span>Aide & Conseils</span>
                    </div>
                    <h2 className="text-3xl font-sans font-bold text-brand-dark mb-4">
                        Questions Fréquentes
                    </h2>
                    <p className="text-gray-500 mb-6 text-sm md:text-base">
                        Vous avez des doutes ? Voici les réponses aux questions les plus courantes de nos clients parisiens.
                    </p>
                    <a 
                      href="#calculator" 
                      onClick={handleScrollToCalculator}
                      className="text-action-orange font-bold hover:underline text-sm md:text-base cursor-pointer"
                    >
                        Poser une autre question
                    </a>
                </div>
            </div>

            <div className="md:w-2/3">
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;