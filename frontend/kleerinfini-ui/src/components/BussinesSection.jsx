import React from "react";
import guy from "../assets/guy.jpeg";
import video from "../assets/carte.mp4";
import third from "../assets/3thing.mp4";

export default function EmpowerSection() {
  return (
    <section className="bg-[#f5f2eb] py-16 px-4 ">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#42210b]">
          Autonomiser les entreprises grâce au commerce mondial
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto mt-4 text-base md:text-lg">
          Nous proposons des solutions B2B tout-en-un pour aider les petites et moyennes entreprises à se développer et à réussir à l’échelle mondiale grâce au commerce numérique.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
       
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={guy}
            alt="Équipe"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
            <p className="text-sm uppercase text-white font-semibold">Notre mission</p>
            <h3 className="text-xl font-bold mt-1">Faciliter les affaires partout dans le monde.</h3>
          </div>
        </div>

        
        <div className="grid grid-rows-2 gap-6">
         
          <div className="relative rounded-xl overflow-hidden">
            
       <video
  className="absolute top-0 left-0 w-full h-full object-cover"
  autoPlay
  muted
  loop
  playsInline
>
  <source src={video} type="video/mp4" />
  Votre navigateur ne supporte pas la lecture de vidéos.
</video>

<div className="absolute inset-0 bg-black/60" />

<div className="relative p-6 text-white">
  <p className="text-xs uppercase text-orange-500 font-semibold">
    Présence mondiale
  </p>
  <h3 className="text-xs font-bold mt-1">
    Nous opérons à l’échelle internationale avec un vaste réseau de partenaires.
  </h3>
</div>

         
          </div>

      
         
        <div className="relative rounded-xl overflow-hidden">
              <video
  className="absolute top-0 left-0 w-full h-full object-cover"
  autoPlay
  muted
  loop
  playsInline
>
  <source src={third} type="video/mp4" />
  Votre navigateur ne supporte pas la lecture de vidéos.
</video>
             
<div className="absolute inset-0 " />

<div className="relative p-6 text-white">
  <p className="text-sm uppercase text-orange-500 font-semibold">
    presence
  </p>
  {/* <h3 className="text-lg font-bold mt-1">
    Nous opérons à l’échelle internationale avec un vaste réseau de partenaires.
  </h3> */}
</div>

         
          </div>

          </div>
        </div>
   
     
    </section>
  );
}
