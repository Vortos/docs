'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const modules = [
  { name: 'Foundation', href: '/docs/foundation', desc: 'Runner, container auto-discovery, package system' },
  { name: 'HTTP', href: '/docs/http', desc: 'Attribute routing, controllers, middleware chain' },
  { name: 'Domain', href: '/docs/domain', desc: 'Aggregates, events, value objects, collections' },
  { name: 'CQRS', href: '/docs/cqrs', desc: 'Command & query buses, idempotency, projections' },
  { name: 'Persistence', href: '/docs/persistence', desc: 'DBAL write repos, MongoDB read repos, locking' },
  { name: 'Messaging', href: '/docs/messaging', desc: 'Kafka event bus, outbox, retry, dead letter' },
  { name: 'Cache', href: '/docs/cache', desc: 'Tagged PSR-16 cache — Redis, InMemory, Array' },
  { name: 'Auth', href: '/docs/auth', desc: 'JWT, route protection, 2FA, rate limiting, quotas' },
  { name: 'Authorization', href: '/docs/authorization', desc: 'Policies, role hierarchy, scoped & temporal' },
  { name: 'Tracing', href: '/docs/tracing', desc: 'OpenTelemetry, sampling, per-module disable' },
  { name: 'Logger', href: '/docs/logger', desc: 'Monolog PSR-3, JSON in prod, line in dev' },
  { name: 'Docker', href: '/docs/docker', desc: 'FrankenPHP & PHP-FPM stubs, one command' },
];

const codeSnippet = `#[AsCommandHandler]
final class RegisterUserHandler
{
    public function __invoke(RegisterUser $cmd): User
    {
        $user = User::register(
            new Email($cmd->email),
            $cmd->name,
        );

        $this->users->save($user);
        return $user;
    }
}`;

function CodeBlock() {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (idx.current < codeSnippet.length) {
        setDisplayed(codeSnippet.slice(0, idx.current + 1));
        idx.current++;
      } else {
        clearInterval(timer);
      }
    }, 18);
    return () => clearInterval(timer);
  }, []);

  const lines = displayed.split('\n');

  return (
    <div style={{
      fontFamily: '"Berkeley Mono", "Fira Code", "JetBrains Mono", monospace',
      fontSize: '13px',
      lineHeight: '1.7',
      background: '#0a0a0a',
      border: '1px solid #1e1e1e',
      borderRadius: '2px',
      padding: '28px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #22d3ee 50%, transparent)',
        opacity: 0.6,
      }} />
      <div style={{ position: 'absolute', top: 14, left: 20, display: 'flex', gap: 6 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 20 }}>
            <span style={{ color: '#333', minWidth: 16, textAlign: 'right', userSelect: 'none', fontSize: 11 }}>
              {i + 1}
            </span>
            <span style={{ color: colorize(line) }}
              dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
            />
          </div>
        ))}
      </div>
      <span style={{
        display: 'inline-block',
        width: 2,
        height: 14,
        background: '#22d3ee',
        marginLeft: 2,
        animation: 'blink 1s step-end infinite',
        verticalAlign: 'middle',
      }} />
    </div>
  );
}

function colorize(_line: string) { return '#e2e8f0'; }

function highlightLine(line: string): string {
  return line
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#\[[\w:]+\(.*?\)\]|#\[\w+\])/g, '<span style="color:#22d3ee">$1</span>')
    .replace(/\b(final|class|public|function|return|new)\b/g, '<span style="color:#c084fc">$1</span>')
    .replace(/\b(User|Email|RegisterUser)\b/g, '<span style="color:#34d399">$1</span>')
    .replace(/(\$\w+)/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/(->[\w]+)/g, '<span style="color:#94a3b8">$1</span>')
    .replace(/(&gt;)/g, '<span style="color:#94a3b8">→</span>');
}

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

        .vortos-home * { box-sizing: border-box; }

        .vortos-home {
          background: #050505;
          min-height: 100vh;
          color: #e2e8f0;
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
        }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .accent-blob {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
          filter: blur(80px);
          animation: pulse 6s ease-in-out infinite;
        }

        .hero-section {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 120px 40px 80px;
        }

        .tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #22d3ee; border: 1px solid rgba(34,211,238,0.3);
          padding: 6px 14px; margin-bottom: 40px;
          animation: fadeUp 0.6s ease both;
        }

        .tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22d3ee;
          animation: pulse 2s ease-in-out infinite;
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(56px, 8vw, 96px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
          animation: fadeUp 0.6s ease 0.1s both;
        }

        .hero-title-main { color: #f8fafc; display: block; }
        .hero-title-accent { color: #22d3ee; display: block; }

        .hero-sub {
          font-family: 'Space Mono', monospace;
          font-size: 13px; color: #64748b;
          margin: 32px 0 48px;
          line-height: 1.8;
          max-width: 480px;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .hero-actions {
          display: flex; gap: 16px; flex-wrap: wrap;
          animation: fadeUp 0.6s ease 0.3s both;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: #22d3ee; color: #050505;
          font-family: 'Space Mono', monospace;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px 28px; text-decoration: none;
          border-radius: 2px; transition: all 0.2s;
          border: 1px solid #22d3ee;
        }
        .btn-primary:hover { background: #06b6d4; border-color: #06b6d4; transform: translateY(-1px); }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          background: transparent; color: #94a3b8;
          font-family: 'Space Mono', monospace;
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px 28px; text-decoration: none;
          border: 1px solid #1e293b; border-radius: 2px; transition: all 0.2s;
        }
        .btn-secondary:hover { color: #e2e8f0; border-color: #334155; }

        .stats-bar {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px 80px;
          display: flex; gap: 0;
          border-top: 1px solid #111;
          animation: fadeUp 0.6s ease 0.4s both;
        }

        .stat-item {
          flex: 1; padding: 32px 0 32px 32px;
          border-right: 1px solid #111;
        }
        .stat-item:first-child { padding-left: 0; }
        .stat-item:last-child { border-right: none; }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800;
          color: #f8fafc; line-height: 1; margin-bottom: 6px;
        }
        .stat-num span { color: #22d3ee; }

        .stat-label {
          font-size: 10px; color: #475569;
          letter-spacing: 0.15em; text-transform: uppercase;
        }

        .split-section {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px 100px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px;
          align-items: start;
        }

        .section-label {
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #22d3ee; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;
        }
        .section-label::after {
          content: ''; flex: 1; height: 1px; background: #1e293b; max-width: 60px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px; font-weight: 700; line-height: 1.1;
          color: #f8fafc; margin: 0 0 20px;
          letter-spacing: -0.02em;
        }

        .section-body {
          font-size: 13px; line-height: 1.9; color: #64748b;
          margin-bottom: 24px;
        }

        .feature-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 12px;
        }

        .feature-item {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 12px; color: #94a3b8; line-height: 1.6;
          animation: slideIn 0.4s ease both;
        }

        .feature-bullet {
          flex-shrink: 0; width: 18px; height: 18px;
          border: 1px solid rgba(34,211,238,0.4);
          display: flex; align-items: center; justify-content: center;
          color: #22d3ee; font-size: 9px; margin-top: 2px;
          border-radius: 2px;
        }

        .modules-section {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px 100px;
        }

        .modules-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid #111;
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1px;
          background: #111;
          border: 1px solid #111;
        }

        .module-card {
          background: #050505;
          padding: 28px 28px 24px;
          text-decoration: none;
          display: block;
          transition: background 0.15s;
          position: relative;
          overflow: hidden;
        }

        .module-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: #22d3ee;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.2s ease;
        }

        .module-card:hover { background: #0a0a0a; }
        .module-card:hover::before { transform: scaleX(1); }
        .module-card:hover .module-arrow { opacity: 1; transform: translate(0,0); }

        .module-num {
          font-size: 10px; color: #1e293b;
          font-family: 'Space Mono', monospace;
          margin-bottom: 16px;
          letter-spacing: 0.1em;
        }

        .module-name {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700;
          color: #e2e8f0; margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .module-desc {
          font-size: 11px; color: #475569;
          line-height: 1.7; font-family: 'Space Mono', monospace;
        }

        .module-arrow {
          position: absolute; top: 24px; right: 24px;
          color: #22d3ee; font-size: 16px;
          opacity: 0;
          transform: translate(-4px, 4px);
          transition: all 0.2s;
        }

        .cta-section {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px 120px;
        }

        .cta-inner {
          border: 1px solid #1e293b;
          padding: 64px;
          position: relative;
          overflow: hidden;
          display: flex; align-items: center; justify-content: space-between; gap: 40px;
        }

        .cta-inner::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(34,211,238,0.03) 0%, transparent 60%);
          pointer-events: none;
        }

        .cta-corner {
          position: absolute;
          width: 20px; height: 20px;
          border-color: #22d3ee; border-style: solid;
        }
        .cta-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .cta-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
        .cta-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
        .cta-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

        .cta-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px; font-weight: 800;
          color: #f8fafc; margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .cta-sub {
          font-size: 12px; color: #64748b; line-height: 1.8;
          font-family: 'Space Mono', monospace;
          max-width: 400px;
        }

        @media (max-width: 768px) {
          .hero-section { padding: 80px 24px 60px; }
          .stats-bar { padding: 0 24px 60px; flex-direction: column; gap: 0; }
          .stat-item { padding: 20px 0; border-right: none; border-bottom: 1px solid #111; }
          .split-section { grid-template-columns: 1fr; padding: 0 24px 60px; gap: 40px; }
          .modules-section { padding: 0 24px 60px; }
          .cta-section { padding: 0 24px 80px; }
          .cta-inner { padding: 40px 32px; flex-direction: column; align-items: flex-start; }
          .modules-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

      <div className="vortos-home">
        <div className="grid-bg" />
        <div className="accent-blob" style={{ width: 600, height: 600, top: -200, right: -200, background: 'rgba(34,211,238,0.04)' }} />
        <div className="accent-blob" style={{ width: 400, height: 400, bottom: 100, left: -100, background: 'rgba(139,92,246,0.04)', animationDelay: '3s' }} />

        {/* Hero */}
        <section className="hero-section">
          <div className="tag">
            <div className="tag-dot" />
            PHP Framework — v1.0.0-alpha
          </div>

          <h1 className="hero-title">
            <span className="hero-title-main">Build what</span>
            <span className="hero-title-accent">matters.</span>
          </h1>

          <p className="hero-sub">
            A PHP framework built for CQRS, domain-driven design, and event-driven architecture.
            Compile-time discovery. Zero reflection at runtime. No magic.
          </p>

          <div className="hero-actions">
            <Link href="/docs/getting-started" className="btn-primary">
              Get Started →
            </Link>
            <Link href="/docs" className="btn-secondary">
              Browse Docs
            </Link>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-bar">
          {[
            { num: '15', unit: '+', label: 'Packages' },
            { num: '377', unit: '', label: 'Tests passing' },
            { num: '939', unit: '', label: 'Assertions' },
            { num: '0', unit: 'ms', label: 'Runtime reflection' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{s.num}<span>{s.unit}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Split — code + features */}
        <div className="split-section">
          <div>
            <div className="section-label">Example</div>
            <h2 className="section-title">A handler.<br />Nothing more.</h2>
            <p className="section-body">
              Mark a class with <code style={{ color: '#22d3ee', fontSize: 12 }}>#[AsCommandHandler]</code>.
              The command bus discovers it at compile time, wraps it in a transaction,
              dispatches domain events, and marks idempotency — automatically.
            </p>
            <ul className="feature-list">
              {[
                'Compile-time handler discovery — zero runtime reflection',
                'UnitOfWork wraps every handler automatically',
                'Domain events pulled and dispatched inside the transaction',
                'Idempotency resolved at compile time via #[AsIdempotencyKey]',
              ].map((f, i) => (
                <li key={i} className="feature-item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="feature-bullet">✓</div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <CodeBlock />
          </div>
        </div>

        {/* Modules */}
        <section className="modules-section">
          <div className="modules-header">
            <div>
              <div className="section-label">Modules</div>
              <h2 className="section-title" style={{ margin: 0 }}>Everything you need.<br />Nothing you don't.</h2>
            </div>
            <Link href="/docs" className="btn-secondary">
              All Docs →
            </Link>
          </div>

          <div className="modules-grid">
            {modules.map((mod, i) => (
              <Link key={mod.name} href={mod.href} className="module-card">
                <div className="module-num">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="module-name">{mod.name}</div>
                <div className="module-desc">{mod.desc}</div>
                <div className="module-arrow">↗</div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-inner">
            <div className="cta-corner tl" />
            <div className="cta-corner tr" />
            <div className="cta-corner bl" />
            <div className="cta-corner br" />
            <div>
              <h2 className="cta-title">Start building.</h2>
              <p className="cta-sub">
                Read the getting started guide, run your first command handler,
                and understand the architecture in under 10 minutes.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexShrink: 0, flexWrap: 'wrap' }}>
              <Link href="/docs/getting-started" className="btn-primary">
                Getting Started →
              </Link>
              <Link href="/docs/domain" className="btn-secondary">
                Domain Layer
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
