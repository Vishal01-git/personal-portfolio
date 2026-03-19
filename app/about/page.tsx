import React from 'react';
import Image from 'next/image';
import { meta } from '@/data/meta';
import { about } from '@/data/about';
import { DataFlowAnimation } from '@/components/ui/DataFlowAnimation';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pt-10 pb-20 min-h-[85vh] text-textPrimary selection:bg-primaryGlow/30 relative">
      
      {/* Background Glow / CRT effect (Subtle) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primaryGlow/5 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      </div>

      <div className="relative z-10 w-full flex flex-col gap-12 md:gap-24 font-mono text-sm md:text-[15px] leading-relaxed">
        
        {/* --- SECTION 1: whoami & Biometric Profile --- */}
        <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16 items-start justify-between w-full">
          
          {/* Bio Text Column */}
          <div className="flex-1 w-full flex flex-col space-y-8 text-textSecondary">
            {/* Prompt */}
            <div className="flex items-center gap-2 font-bold mb-4">
               <span className="text-secondaryGlow">vishalprajapati@terminal:~$</span>
               <span className="text-textPrimary">whoami</span>
            </div>

            {/* Title Block */}
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-textPrimary tracking-tight">
                {meta.name}
              </h1>
              <div className="text-primaryGlow uppercase tracking-widest font-bold">
                {meta.role.toUpperCase()}
              </div>
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-6 max-w-2xl text-[15px] leading-[1.8]">
              {about.bio.map((para, i) => (
                <p key={i} className="text-textSecondary/90">{para}</p>
              ))}
            </div>
          </div>

          {/* Biometric Scan Image Column */}
          <div className="w-full max-w-[280px] md:max-w-[320px] mx-auto md:mx-0 shrink-0">
             <div className="relative w-full aspect-[4/5] rounded bg-black/40 border border-primaryGlow/20 shadow-[0_0_30px_rgba(var(--primaryGlow-rgb),0.1)] overflow-hidden group">
               
               {/* Corner Accents */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primaryGlow rounded-tl z-20 pointer-events-none" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primaryGlow rounded-tr z-20 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primaryGlow rounded-bl z-20 pointer-events-none" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primaryGlow rounded-br z-20 pointer-events-none" />

               {/* Inner Border Constraint */}
               <div className="absolute inset-2 border border-primaryGlow/10 z-10 pointer-events-none" />

               {/* Profile Image (Ensure we have a high-contrast futuristic look if possible, otherwise normal image) */}
               <div className="absolute inset-3 border border-primaryGlow/30 overflow-hidden bg-[#0a0f1c] z-0">
                  <Image
                    src="/profile_image.jpg"
                    alt={meta.name}
                    fill
                    className="object-cover object-top opacity-90 mix-blend-screen filter contrast-[1.1]"
                  />
                  {/* CRT Scanline Overlay specifically on the image */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 pointer-events-none opacity-50" />
               </div>

               {/* Animated Scanning Line */}
               <div className="absolute left-3 right-3 h-[2px] bg-primaryGlow shadow-[0_0_15px_3px_rgba(var(--primaryGlow-rgb),0.8)] z-20 animate-scan pointer-events-none" />

               {/* Biometric Data Overlay */}
               <div className="absolute bottom-5 left-5 right-5 z-30 font-mono text-[10px] md:text-xs text-primaryGlow/80 tracking-widest leading-relaxed">
                  <div>ID: VP-DE-2024</div>
                  <div>BIOMETRIC SCAN COMPLETE.</div>
               </div>
             </div>
          </div>
        </div>

        {/* --- SECTION 2: certifications --list --- */}
        <div className="w-full flex flex-col space-y-6">
           {/* Prompt */}
           <div className="flex items-center gap-2 font-bold mb-2">
             <span className="text-secondaryGlow">vishalprajapati@terminal:~$</span>
             <span className="text-textPrimary">certifications --list</span>
           </div>

           {/* ASCII Table Container */}
           <div className="w-full overflow-x-auto text-xs md:text-sm text-textSecondary leading-relaxed whitespace-pre">
              {/* Header */}
              <div className="text-primaryGlow">
{`| PROVIDER       | CERTIFICATION NAME                   | YEAR |
| -------------- | ------------------------------------ | ---- |`}
              </div>
              
              {/* Rows */}
              <div className="text-textSecondary/90">
                 {/* Manually mapping known certifications to match the hardcoded ASCII layout, 
                     falling back if standard structure isn't observed. */}
{`| AWS            | Certified Developer Associate        | 2024 |
| Google Cloud   | Associate Cloud Engineer             | 2024 |
| Oracle (OCI)   | 2024 Generative AI Professional      | 2024 |`}
              </div>
           </div>
        </div>

        {/* --- FOOTER STATUS --- */}
        <div className="mt-8 pt-8 text-textSecondary font-mono text-sm md:text-base flex items-center gap-3">
          <span className="opacity-50">STATUS: ACCEPTING NEW DIRECTIVES</span>
          <span className="w-2.5 h-4 bg-primaryGlow animate-pulse block" />
        </div>

      </div>

      {/* Tailwind specific animations defined inline or assume they exist. 
          Adding the scanning animation specifically to this page. */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 12px; opacity: 0; }
          10% { opacity: 1; }
          50% { top: calc(100% - 14px); opacity: 1; }
          90% { opacity: 1; }
          100% { top: 12px; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}