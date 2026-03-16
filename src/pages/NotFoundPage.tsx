import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-cyan-400 uppercase mb-4">
          404 — Page Not Found
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Looks like you&apos;re off course.
        </h1>
        <p className="text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to somewhere familiar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/services"
            className="px-6 py-3 rounded-xl border border-white/10 text-slate-200 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}

