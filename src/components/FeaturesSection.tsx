import React from "react";
import { 
  Target, BookOpen, BarChart3, Users, Star, Wrench, Headset, ShieldCheck 
} from "lucide-react";

const features = [
  { icon: Target, title: "Tailored for Nepali Students" },
  { icon: BookOpen, title: "Comprehensive University Database" },
  { icon: BarChart3, title: "Smart Comparison Tool" },
  { icon: Users, title: "Connect with Nepali Students" },
  { icon: Star, title: "Scholarship Hub" },
  { icon: Wrench, title: "Step-by-Step Guidance" },
  { icon: Headset, title: "Dedicated Support Team" },
  { icon: ShieldCheck, title: "Verified Information" },
];

const FeaturesSection = () => {
  return (
    <section className="py-4 px-2 bg-gray-50 pb-6">
      <div className="container-custom text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Why ScholarEU?</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <feature.icon className="text-blue-500" size={24} />
              <span className="text-sm font-normal text-gray-700 mt-3 text-center">{feature.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeaturesSection;
