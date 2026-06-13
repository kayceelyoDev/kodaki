import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Image as ImageIcon, ArrowRight, LayoutGrid } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans overflow-y-auto">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/kodaki_logo.png" alt="Kodaki Logo" className="h-8 object-contain" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">Kodaki</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
        </nav>
        <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
          Open App
        </button>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold text-sm mb-6 flex items-center gap-2 justify-center mx-auto">
            <Sparkles size={16} /> 100% Free & Customizable
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Design and customise your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">selfie frame.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Without a hassle. Choose from aesthetic presets like Studio Noir, Social App, or Vintage Stamp. Strike a pose and download instantly.
          </p>
          <button onClick={onStart} className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto shadow-xl">
            Select your template <ArrowRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-16 text-slate-900">How it works.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 text-blue-600">
                <LayoutGrid size={40} />
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">Select a template</h3>
              <p className="text-slate-500 text-sm">Choose from dozens of highly aesthetic presets and dynamic layouts.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 text-pink-500">
                <Camera size={40} />
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">Strike a pose</h3>
              <p className="text-slate-500 text-sm">Our advanced camera injects you directly into the frame as you take pictures.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 text-yellow-500">
                <ImageIcon size={40} />
              </div>
              <h3 className="font-bold text-xl mb-2 text-slate-800">Customize & Save</h3>
              <p className="text-slate-500 text-sm">Add stickers, filters, and easily save your masterpiece to your device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-6 text-slate-900">About the Creator</h2>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            Hey! I'm <strong className="text-slate-900">Kent Clarence Evangelista</strong>, an IT student from Cebu. 
            I made Kodaki just for fun to combine my love for programming, modern UI design, and aesthetic photobooths. 
            I hope you enjoy creating beautiful moments with it!
          </p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200">
        © {new Date().getFullYear()} Kodaki by Kent Clarence Evangelista. All rights reserved.
      </footer>
    </div>
  );
}
