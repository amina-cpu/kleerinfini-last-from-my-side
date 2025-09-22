import React from "react";
import signup from "../assets/signup.jpg";

export default function CTASection() {
  return (
    <section
      className="relative bg-blend-multiply"
      style={{
        backgroundImage: `url(${signup})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom", // Show more of the bottom of the image
      }}
    >
      {/* Overlay with dark orange tint */}
      <div className="bg-orange-900/60 py-20 px-4">
        <div className="text-center max-w-xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-base md:text-lg mb-6">
            Découvrez des millions de produits de fournisseurs de confiance en vous inscrivant dès aujourd’hui !
          </p>
          <a
            href="#"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            S'inscrire
          </a>
        </div>
      </div>
    </section>
  );
}
