'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, FileText, BarChart3, Search, Activity, Cpu, ArrowRight, BookOpen, Lock } from 'lucide-react';
import { VerificationResult, Claim } from '../lib/risk-engine';

export default function Home() {
    const [output, setOutput] = useState('');
    const [domain, setDomain] = useState('legal');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VerificationResult | null>(null);

    const handleVerify = async () => {
        if (!output) return;
        setLoading(true);
        try {
            const resp = await fetch('/api/risk-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ output, domain })
            });
            const data = await resp.json();
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container">
            <div className="background-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <header className="header animate-fade-in">
                <div className="logo">
                    <div className="logo-icon glass glow-heavy">
                        <Shield size={20} className="stroke-primary" />
                    </div>
                    <span className="logo-text text-gradient font-bold">TrustShield AI</span>
                </div>
                <nav className="nav-desktop">
                    <span className="nav-link active">Risk Engine</span>
                    <span className="nav-link">Audit Trace</span>
                    <span className="nav-link">Compliance</span>
                    <div className="nav-divider"></div>
                    <button className="btn-ghost">
                        <Lock size={14} />
                        <span>Enterprise Gateway</span>
                    </button>
                </nav>
            </header>

            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="badge-wrapper">
                        <span className="status-badge glass">
                            <span className="dot animate-pulse"></span>
                            EU AI Act Compliant Ready
                        </span>
                    </div>
                    <h1>The Governance Layer for <br /><span className="text-gradient">Generative AI</span></h1>
                    <p className="subtitle">
                        Extract factual claims, identify evidence, and calculate cross-model variance <br />
                        to ensure legally defensible AI outputs in regulated industries.
                    </p>
                </motion.div>
            </section>

            <div className="dashboard-grid">
                <div className="input-section">
                    <motion.div
                        className="card glass p-6"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="card-header">
                            <div className="icon-box primary">
                                <FileText size={18} />
                            </div>
                            <h3>Analyze Output</h3>
                        </div>
                        <p className="card-desc">Paste the AI-generated response to verify factual accuracy and risk.</p>

                        <textarea
                            className="custom-textarea"
                            placeholder="Ex: 'The EU AI Act classifies many enterprise AI uses as high-risk systems...'"
                            value={output}
                            onChange={(e) => setOutput(e.target.value)}
                        />

                        <div className="controls">
                            <div className="select-wrapper">
                                <BookOpen size={16} className="select-icon" />
                                <select value={domain} onChange={(e) => setDomain(e.target.value)}>
                                    <option value="legal">Legal Opinion</option>
                                    <option value="financial">Financial Analysis</option>
                                    <option value="medical">Biotech / Diagnostics</option>
                                    <option value="compliance">Corporate Governance</option>
                                </select>
                            </div>
                            <button
                                className={`btn-action ${loading ? 'loading' : ''}`}
                                onClick={handleVerify}
                                disabled={loading || !output}
                            >
                                {loading ? (
                                    <>
                                        <Cpu className="animate-spin" size={18} />
                                        <span>Processing Layer...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Execute Verification</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="visual-section">
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="empty-state glass"
                            >
                                <Search size={48} strokeWidth={1} />
                                <p>Awaiting risk telemetry input...</p>
                                <div className="shimmer-lines">
                                    <div className="line"></div>
                                    <div className="line short"></div>
                                </div>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="loading-state glass"
                            >
                                <div className="scanner"></div>
                                <h3>Extracting Claims</h3>
                                <p>NLI Validation & Cross-Model Verification in progress.</p>
                            </motion.div>
                        )}

                        {result && !loading && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="results-view"
                            >
                                <div className="stats-row">
                                    <div className="stat-card glass flex-1">
                                        <span className="stat-label">Risk Score</span>
                                        <div className={`stat-value risk-${result.overallRisk > 0.6 ? 'high' : result.overallRisk > 0.3 ? 'medium' : 'low'}`}>
                                            {(result.overallRisk * 100).toFixed(0)}%
                                        </div>
                                        <div className="progress-bg">
                                            <motion.div
                                                className="progress-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${result.overallRisk * 100}%` }}
                                                transition={{ duration: 1 }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                    <div className="stat-card glass flex-1">
                                        <span className="stat-label">Variance</span>
                                        <div className="stat-value secondary">
                                            {(result.crossModelVariance * 100).toFixed(0)}%
                                        </div>
                                        <p className="stat-subtext">Epistemic Uncertainty</p>
                                    </div>
                                </div>

                                <div className="claims-container glass">
                                    <div className="claims-header">
                                        <BarChart3 size={16} />
                                        <span>Claim-Level Risk Map</span>
                                    </div>
                                    <div className="claims-scroll">
                                        {result.claims.map((claim, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="claim-item"
                                            >
                                                <div className="claim-text-content">
                                                    <p className="claim-body">{claim.text}</p>
                                                    <div className="claim-tags">
                                                        <span className={`tag-risk risk-${claim.riskScore > 0.5 ? 'high' : 'low'}`}>
                                                            {claim.riskScore > 0.5 ? 'High Risk' : 'Verified'}
                                                        </span>
                                                        {claim.speculativeKeywords.length > 0 && (
                                                            <span className="tag-hedge">Hedged Language</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="claim-score">
                                                    {(claim.riskScore * 100).toFixed(0)}%
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="audit-footer glass">
                                    <Activity size={14} />
                                    <span>Audit Code: TR-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                                    <div className="flex-grow"></div>
                                    <button className="btn-text">Download Report</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
        .container {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          z-index: 10;
        }

        .background-blobs {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
          filter: blur(80px);
          opacity: 0.3;
        }

        .blob-1 { top: -100px; right: -100px; }
        .blob-2 { bottom: -100px; left: -100px; background: radial-gradient(circle, #8b5cf644 0%, transparent 70%); }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .logo-text {
          font-size: 1.25rem;
          letter-spacing: -0.01em;
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          font-size: 0.9rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-link:hover, .nav-link.active { color: white; }

        .nav-divider {
          width: 1px;
          height: 24px;
          background: var(--card-border);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--card-border);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.05);
        }

        .hero {
          text-align: center;
          margin-bottom: 5rem;
        }

        .badge-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
        }

        h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 1.25rem;
          line-height: 1.6;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .p-6 { padding: 1.5rem; }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .icon-box {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary);
        }

        h3 { font-size: 1.25rem; font-weight: 600; }
        .card-desc { color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem; }

        .custom-textarea {
          width: 100%;
          height: 280px;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 1.25rem;
          color: white;
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.6;
          resize: none;
          transition: border-color 0.2s;
          margin-bottom: 1.5rem;
        }

        .custom-textarea:focus {
          outline: none;
          border-color: var(--primary);
        }

        .controls {
          display: flex;
          gap: 1rem;
        }

        .select-wrapper {
          position: relative;
          flex: 1;
        }

        .select-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        }

        select {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--card-border);
          color: white;
          border-radius: 10px;
          appearance: none;
          cursor: pointer;
        }

        .btn-action {
          flex: 1.5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .btn-action:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 0 20px var(--primary-glow);
        }

        .btn-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .visual-section {
          min-height: 500px;
          display: flex;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #475569;
          gap: 1.5rem;
          border-style: dashed;
        }

        .shimmer-lines {
          width: 150px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .line { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; }
        .line.short { width: 60%; }

        .loading-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .scanner {
          width: 100%;
          height: 2px;
          background: var(--primary);
          position: absolute;
          top: 0;
          left: 0;
          box-shadow: 0 0 15px var(--primary);
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .results-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .stats-row {
          display: flex;
          gap: 1rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-label { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-value { font-size: 2.5rem; font-weight: 800; }
        .stat-value.secondary { color: var(--accent); }
        .stat-subtext { font-size: 0.85rem; color: #64748b; }

        .progress-bg { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; margin-top: 0.5rem; }
        .progress-fill { height: 100%; background: var(--primary); border-radius: 10px; }

        .claims-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          overflow: hidden;
        }

        .claims-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #e2e8f0;
        }

        .claims-scroll {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
          max-height: 250px;
          padding-right: 0.5rem;
        }

        .claim-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: background 0.2s;
        }

        .claim-item:hover { background: rgba(255,255,255,0.05); }

        .claim-text-content { flex: 1; }
        .claim-body { font-size: 0.9rem; line-height: 1.5; margin-bottom: 0.5rem; }

        .claim-tags { display: flex; gap: 0.5rem; }
        .tag-risk { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 4px; background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .tag-risk.risk-high { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .tag-hedge { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 4px; background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        .claim-score { font-weight: 700; font-size: 1.1rem; color: #94a3b8; }

        .audit-footer {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: #64748b;
        }

        .btn-text {
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .flex-grow { flex-grow: 1; }
        .flex-1 { flex: 1; }

        .risk-low { color: var(--success); }
        .risk-medium { color: var(--warning); }
        .risk-high { color: var(--error); }

        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          h1 { font-size: 3rem; }
        }
      `}</style>
        </main>
    );
}
