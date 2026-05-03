import React from 'react';
import { Mail, Globe, ChevronRight } from 'lucide-react';

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

export default function OrbisLanding() {
  return (
    <div className="relative w-full bg-background font-mono text-cream selection:bg-neon selection:text-background overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="texture-overlay"></div>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen w-full flex flex-col items-center rounded-b-[32px] overflow-hidden pb-12 lg:pb-0">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4"
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        
        {/* Header */}
        <header className="w-full max-w-[1831px] px-6 lg:px-12 pt-8 flex justify-between items-center z-10">
          <div className="font-grotesk text-[16px] uppercase tracking-wide">Orbis.Nft</div>
          
          <nav className="hidden lg:flex liquid-glass rounded-[28px] px-[52px] py-[24px] gap-8">
            {['Homepage', 'Gallery', 'Buy NFT', 'FAQ', 'Contact'].map((item) => (
              <a key={item} href="#" className="font-grotesk text-[13px] uppercase hover:text-neon transition-colors">
                {item}
              </a>
            ))}
          </nav>
          
          <div className="hidden lg:flex flex-col gap-3">
            {[MailIcon, TwitterIcon, GithubIcon].map((Icon, i) => (
              <button key={i} className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
                <Icon />
              </button>
            ))}
          </div>
        </header>

        {/* Hero Content */}
        <div className="flex-1 w-full max-w-[1831px] px-6 lg:px-12 flex flex-col justify-center mt-16 lg:mt-0 z-10">
          <div className="relative lg:ml-32 max-w-[780px]">
            <h1 className="font-grotesk text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] uppercase leading-[1.05] sm:leading-[1]">
              Beyond earth<br />and ( its ) familiar boundaries
            </h1>
            <span className="font-condiment absolute right-0 top-0 md:-right-8 md:-top-4 text-neon text-[24px] sm:text-[36px] md:text-[48px] -rotate-1 mix-blend-exclusion opacity-90 normal-case">
              Nft collection
            </span>
          </div>

          {/* Mobile Socials */}
          <div className="flex lg:hidden justify-center gap-4 mt-12">
            {[MailIcon, TwitterIcon, GithubIcon].map((Icon, i) => (
              <button key={i} className="liquid-glass w-[56px] h-[56px] rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors">
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT / INTRO */}
      <section className="relative min-h-screen w-full flex items-center justify-center py-[64px] lg:py-[96px] overflow-hidden">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4"
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
        
        <div className="w-full max-w-[1831px] px-6 lg:px-12 z-10 flex flex-col justify-between h-full min-h-[60vh]">
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
            <div className="relative">
              <h2 className="font-grotesk text-[32px] sm:text-[48px] lg:text-[60px] uppercase leading-none">
                Hello!<br />I'm orbis
              </h2>
              <span className="font-condiment text-neon absolute bottom-0 -right-12 md:-right-24 text-[36px] sm:text-[52px] lg:text-[68px] mix-blend-exclusion -rotate-3 normal-case translate-y-1/2">
                Orbis
              </span>
            </div>
            <p className="font-mono text-[14px] sm:text-[16px] uppercase max-w-[266px]">
              A digital object fixed beyond time and place. An exploration of distance, form, and silence in space
            </p>
          </div>

          {/* Bottom Row (Decorative Text) */}
          <div className="flex justify-between items-end mt-24">
            <div className="flex flex-col gap-4 text-[#010828] lg:text-cream opacity-10">
              <p className="font-mono text-[14px] sm:text-[16px] uppercase max-w-[266px]">A digital object fixed beyond time and place. An exploration of distance, form, and silence in space</p>
              <p className="font-mono text-[14px] sm:text-[16px] uppercase max-w-[266px]">A digital object fixed beyond time and place. An exploration of distance, form, and silence in space</p>
            </div>
            <div className="hidden lg:flex flex-col gap-4 text-cream opacity-10">
              <p className="font-mono text-[14px] sm:text-[16px] uppercase max-w-[266px]">A digital object fixed beyond time and place. An exploration of distance, form, and silence in space</p>
              <p className="font-mono text-[14px] sm:text-[16px] uppercase max-w-[266px]">A digital object fixed beyond time and place. An exploration of distance, form, and silence in space</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NFT COLLECTION GRID */}
      <section className="w-full bg-background py-24 flex justify-center">
        <div className="w-full max-w-[1831px] px-6 lg:px-12">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h2 className="font-grotesk text-[32px] sm:text-[48px] lg:text-[60px] uppercase leading-[1.1]">
              Collection of<br />
              <div className="ml-12 sm:ml-24 lg:ml-32 flex items-center gap-3 sm:gap-4">
                <span className="font-condiment text-neon normal-case">Space</span>
                <span>objects</span>
              </div>
            </h2>
            
            <div className="group cursor-pointer">
              <div className="flex items-end gap-3 sm:gap-4">
                <span className="font-grotesk text-[32px] sm:text-[48px] lg:text-[60px] uppercase leading-none">SEE</span>
                <div className="flex flex-col font-grotesk text-[20px] sm:text-[28px] lg:text-[36px] uppercase leading-[0.9]">
                  <span>ALL</span>
                  <span>CREATORS</span>
                </div>
              </div>
              <div className="w-full h-[6px] lg:h-[10px] bg-neon mt-2 origin-left transition-transform duration-300 group-hover:scale-x-110"></div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {[
              { score: '8.7/10', vid: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4' },
              { score: '9/10', vid: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4' },
              { score: '8.2/10', vid: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4' }
            ].map((item, index) => (
              <div key={index} className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors duration-500">
                <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden mb-4">
                  <video src={item.vid} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="liquid-glass rounded-[20px] px-5 py-4 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] text-cream/70 uppercase leading-none">RARITY SCORE:</span>
                    <span className="font-mono text-[16px] uppercase leading-none">{item.score}</span>
                  </div>
                  <button className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform">
                    <ChevronRight className="text-white w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA / FINAL */}
      <section className="relative w-full bg-background overflow-hidden">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4"
          autoPlay loop muted playsInline
          className="w-full h-auto block"
        />
        
        <div className="absolute inset-0 w-full max-w-[1831px] mx-auto pointer-events-none">
          {/* Text Content */}
          <div className="absolute top-[15%] sm:top-[20%] right-6 lg:right-0 lg:pr-[20%] lg:pl-[15%] text-right">
            <div className="relative inline-block text-left">
              <span className="font-condiment text-neon mix-blend-exclusion absolute -top-6 -left-6 sm:-top-10 sm:-left-12 lg:-top-16 lg:-left-20 text-[17px] sm:text-[34px] lg:text-[68px] normal-case -rotate-2">
                Go beyond
              </span>
              <h2 className="font-grotesk text-[16px] sm:text-[32px] lg:text-[60px] uppercase leading-[1.1] text-right pointer-events-auto">
                <div className="mb-4 sm:mb-8 lg:mb-12">JOIN US.</div>
                <div>REVEAL WHAT'S HIDDEN.</div>
                <div>DEFINE WHAT'S NEXT.</div>
                <div>FOLLOW THE SIGNAL.</div>
              </h2>
            </div>
          </div>

          {/* Social Block */}
          <div className="absolute left-[8%] bottom-[12%] sm:bottom-[15%] lg:bottom-[20%] pointer-events-auto">
            <div className="liquid-glass flex flex-col rounded-[0.5rem] sm:rounded-[1.25rem]">
              {[MailIcon, TwitterIcon, GithubIcon].map((Icon, i) => (
                <button 
                  key={i} 
                  className={`flex items-center justify-center w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem] aspect-square sm:aspect-auto sm:h-[4rem] lg:h-[5.5rem] hover:bg-white/10 transition-colors ${
                    i !== 2 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
