import React from 'react';
import { Zap } from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  desc: string;
}

interface ProcessSectionProps {
  steps: ProcessStep[];
}

export function ProcessSection({ steps }: ProcessSectionProps) {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="text-center mb-20">
          <div className="section-tag mx-auto w-fit">
            <Zap className="w-3 h-3" /> Our Process
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            How We <span className="text-gradient-primary">Deliver</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto font-light text-lg leading-relaxed">
            A transparent, agile delivery framework — from first conversation to long-term success.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(20,184,166,0.25) 20%, rgba(99,102,241,0.25) 80%, transparent)',
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                <div className="relative w-20 h-20 rounded-2xl glass flex items-center justify-center mb-5 z-10 cursor-default">
                  <span className="font-display text-2xl font-bold text-gradient-primary">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[130px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

