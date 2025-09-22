import React from "react";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";
const categories = [
      {
    name: "Agroalimentaire",
    image: image1,
  },
  {
    name: "Produits laitiers",
    image: image2,
  },
  {
    name: "Fruits et légumes",
    image: image3,
  },
  {
    name: "Produits en conserve",
    image: image4,
  },
  {
    name: "Boissons",
  image: image2,
  },
  {
    name: "Céréales et grains",
    image: image2,
  },
  {
    name: "Suite",
  image: image2,
  },
];

export default function CategorySection() {
  return (
    <section className="bg-gradient-to-b bg-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Categorie de Produit</h2>
        <p className="text-center text-gray-500 mb-10">Découvrez les produits par catégories</p>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 group hover:scale-105 transition">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:opacity-80"
                />
              </div>
              <p className="text-sm text-center text-gray-700 font-medium w-24">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
