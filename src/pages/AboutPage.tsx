import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Target, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
export function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-gradient">NextWave Digital</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We are a next-generation digital solutions studio focused on
            building scalable systems, custom platforms, and intelligent
            automation.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Who We Are</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                NextWave Digital is not just another web design agency. We are a
                technology partner for businesses that want to grow, automate,
                and lead in their industries.
              </p>
              <p>
                Founded with a vision to bring enterprise-grade technology to
                African businesses, we specialize in solving complex problems
                through code. We don't believe in cookie-cutter templates or
                one-size-fits-all solutions.
              </p>
              <p>
                Our team consists of expert developers, designers, and system
                architects who are passionate about building digital assets that
                deliver real ROI.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/contact">
                <Button>Work With Us</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur-xl opacity-20"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Team working together"
                className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity duration-500" />

            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <GlassCard className="p-8 border-cyan-500/30">
            <div className="p-3 bg-cyan-500/10 rounded-lg w-fit mb-6">
              <Target className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-slate-400">
              To empower businesses with custom digital tools that replace
              manual processes, improve productivity, and enable scalable
              growth.
            </p>
          </GlassCard>

          <GlassCard className="p-8 border-violet-500/30">
            <div className="p-3 bg-violet-500/10 rounded-lg w-fit mb-6">
              <Lightbulb className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-slate-400">
              To be the leading digital solutions provider in Africa, known for
              building world-class software that solves real-world problems.
            </p>
          </GlassCard>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            'Innovation First',
            'Quality Over Quantity',
            'Transparent Process',
            'Long-term Partnership'].
            map((value, i) =>
            <div
              key={i}
              className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">

                <CheckCircle2 className="w-8 h-8 text-cyan-500 mb-4" />
                <h4 className="text-lg font-bold text-white">{value}</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

}