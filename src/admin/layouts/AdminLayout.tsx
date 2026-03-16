import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function AdminLayout() {
  const { user, role, signOut } = useAuth();

  const navLinkClass =
    'block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/60';

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <aside className="w-64 border-r border-white/10 bg-slate-950/80 hidden md:flex flex-col">
        <div className="px-4 py-4 border-b border-white/10">
          <Link to="/admin" className="block">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-teal-400">
              NextWave
            </p>
            <p className="text-sm font-semibold text-white">Admin Dashboard</p>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-6 text-sm">
          <div>
            <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Overview
            </p>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Dashboard
            </NavLink>
          </div>
          <div>
            <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Content
            </p>
            <NavLink
              to="/admin/content/portfolio"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Portfolio
            </NavLink>
            <NavLink
              to="/admin/content/blog"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/admin/content/services"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Services & Offers
            </NavLink>
            <NavLink
              to="/admin/content/testimonials"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Testimonials
            </NavLink>
            <NavLink
              to="/admin/content/faqs"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/admin/content/home"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Home & Footer
            </NavLink>
          </div>
          <div>
            <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Operations
            </p>
            <NavLink
              to="/admin/operations/leads"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Leads
            </NavLink>
            <NavLink
              to="/admin/operations/clients"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Clients
            </NavLink>
            <NavLink
              to="/admin/operations/projects"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/admin/operations/tasks"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Tasks
            </NavLink>
          </div>
          <div>
            <p className="px-3 mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Settings
            </p>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `${navLinkClass} ${isActive ? 'bg-slate-900 text-white' : ''}`
              }
            >
              Site & Security
            </NavLink>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-white/10 bg-slate-950/70 flex items-center justify-between px-4 md:px-6">
          <div className="md:hidden">
            <Link to="/admin" className="text-sm font-semibold text-white">
              Admin
            </Link>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-xs">
            {user && (
              <div className="text-right">
                <p className="text-slate-100 font-medium">{user.email}</p>
                {role && (
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {role}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => signOut()}
              className="rounded-md border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-900/80"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 bg-slate-950/70">
          <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

