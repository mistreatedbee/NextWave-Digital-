import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceCardData {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: 'teal' | 'blue' | 'indigo' | 'violet' | 'emerald' | 'cyan';
}

interface ServicesOverviewSectionProps {
  services: ServiceCardData[];
}

export function ServicesOverviewSection({ services }: ServicesOverviewSectionProps) {
  return (
    <section className="py-28 relative">
      <div
        className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full blur-[100px] -translate-y-1/2"
        style={{ background: 'rgba(59,130,246,0.05)' }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="mb-16">
          <div className="section-tag">
            <Sparkles className="w-3 h-3" /> Our Capabilities
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              Solutions That
              <br />
              <span className="text-gradient-primary">Drive Real Results</span>
            </h2>
            <Link to="/services">
              <button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors font-medium">
                All services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, index) => (
            <ServiceCard key={s.title} {...s} delay={index * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  color,
  delay,
}: ServiceCardData & { delay: number }) {
  const [hovered, setHovered] = React.useState(false);

  const colorStyles = {
    teal: { badge: 'text-teal-400 bg-teal-400/10 border-teal-400/25' },
    blue: { badge: 'text-blue-400 bg-blue-400/10 border-blue-400/25' },
    indigo: { badge: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/25' },
    emerald: { badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' },
    violet: { badge: 'text-violet-400 bg-violet-400/10 border-violet-400/25' },
    cyan: { badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25' },
  } as const;

  const c = colorStyles[color] || colorStyles.teal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={
          hovered
            ? { y: -6, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }
            : { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }
        }
        transition={{ duration: 0.3 }}
        className="rounded-2xl p-6 cursor-default h-full"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <motion.div
          animate={hovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.25 }}
          className={`inline-flex p-3 rounded-xl border mb-4 ${c.badge}`}
        >
          {icon}
        </motion.div>
        <h3 className="font-display text-base font-bold text-white mb-2">{title}</h3>
        <AnimatePresence>
          {hovered ? (
            <motion.p
              key="desc"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-slate-300 leading-relaxed overflow-hidden"
            >
              {desc}
            </motion.p>
          ) : (
            <motion.p
              key="short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-slate-500 leading-relaxed"
            >
              {desc.slice(0, 55)}…
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

