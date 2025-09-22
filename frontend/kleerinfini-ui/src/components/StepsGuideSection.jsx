import React from "react";
import { Lock, Search, Send, Package } from "lucide-react";
import backgroundVideo from "../assets/comment ca marche.mp4"; 

export default function StepsGuideSection() {
  const steps = [
    {
      title: "Étape 1 – Créez votre compte",
      icon: <Lock className="w-6 h-6 text-orange-500" />,
      text: "Créez votre compte en tant qu'acheteur ou producteur.",
    },
    {
      title: "Étape 2 – Découvrez des producteurs vérifiés",
      icon: <Search className="w-6 h-6 text-orange-500" />,
      text: "Explorez des producteurs certifiés dans toutes les filières : agroalimentaire, cosmétique, technologie, etc.",
    },
    {
      title: "Étape 3 – Envoyez vos demandes",
      icon: <Send className="w-6 h-6 text-orange-500" />,
      text: "Envoyez vos demandes de devis ou contactez les fournisseurs directement.",
    },
    {
      title: "Étape 4 – Recevez des offres & exportez",
      icon: <Package className="w-6 h-6 text-orange-500" />,
      text: "Recevez des offres personnalisées, négociez et lancez votre première opération export.",
    },
  ];
  
  return (
    <section className="bg-[#f5f2eb] py-28 px-6 md:px-24 relative z-10">
      <div className="absolute inset-0 w-full h-full z-0 flex justify-center items-center pointer-events-none">
        <div className="w-[80%] h-[80%] md:h-[80%] overflow-hidden rounded-[2.5rem] shadow-2xl">
          <video
            className="w-full h-full object-cover object-bottom" 
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={backgroundVideo} type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo HTML5.
          </video>
        </div>
      </div>
      <div className="relative z-10 max-w-5xl pb-10 pt-20 mx-auto text-center text-white">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-14">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-6 sm:px-8 lg:px-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-90 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg border border-[#d2b48c] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center text-black min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] w-full max-w-[280px] sm:max-w-none mx-auto"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <button className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-6 py-3 rounded-full shadow-md transition">
            Créer mon compte
          </button>
          <button className="bg-white text-orange-600 border border-orange-600 hover:bg-orange-50 font-semibold px-6 py-3 rounded-full shadow-md transition">
            Voir les producteurs
          </button>
        </div>
      </div>
    </section>
  );
}