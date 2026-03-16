import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  BrainCircuit,
  MessageSquareText,
  Workflow,
  Users,
  ClipboardList,
  BarChart3,
  Database } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
export function SolutionsPage() {
  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Advanced <span className="text-gradient">Solutions</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Leverage the power of AI and intelligent systems to automate your
            business and gain a competitive edge.
          </p>
        </div>

        {/* AI & Automation Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-white">AI & Automation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    AI Chatbots & Assistants
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Intelligent chatbots for your website or WhatsApp that can
                    answer customer queries, book appointments, and qualify
                    leads 24/7.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      • Customer Support Automation
                    </li>
                    <li className="flex items-center gap-2">
                      • Lead Generation & Qualification
                    </li>
                    <li className="flex items-center gap-2">
                      • Booking & Reservations
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Workflow className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Workflow Automation
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Connect your favorite apps and automate repetitive tasks.
                    From data entry to document processing, let AI handle the
                    busy work.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      • Document Processing & Extraction
                    </li>
                    <li className="flex items-center gap-2">
                      • Automated Email & SMS Sequences
                    </li>
                    <li className="flex items-center gap-2">
                      • Social Media Auto-Posting
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Management Systems Section */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-lg bg-violet-500/20 text-violet-400">
              <Database className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Management Systems
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-violet-500/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Employee & HR Systems
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Comprehensive platforms to manage your workforce, track
                    attendance, handle payroll, and monitor performance.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      • Time Tracking & Attendance
                    </li>
                    <li className="flex items-center gap-2">
                      • Leave Management
                    </li>
                    <li className="flex items-center gap-2">
                      • Performance Reviews
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="border-violet-500/30">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Business Intelligence Dashboards
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Visualize your business data in real-time. Custom dashboards
                    that pull data from multiple sources to give you actionable
                    insights.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300 mb-6">
                    <li className="flex items-center gap-2">
                      • Sales & Revenue Tracking
                    </li>
                    <li className="flex items-center gap-2">
                      • KPI Monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      • Custom Reporting Tools
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link to="/quote">
            <Button size="lg">Build Your Custom Solution</Button>
          </Link>
        </div>
      </div>
    </div>);

}