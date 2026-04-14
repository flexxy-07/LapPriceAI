import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCcw, IndianRupee, AlertCircle, ShoppingCart, TrendingUp, ShieldCheck } from 'lucide-react';

interface ResultDisplayProps {
  price: number | null;
  onReset: () => void;
}

const USD_TO_INR = 83;
const MARKET_ADJUSTMENT = 0.48; // Radical reduction (52%) for high-volume market alignment

const getMarketInsight = (priceInInr: number) => {
  if (priceInInr < 20000) return "Aggressive budget entry. Exceptional value for basic educational use.";
  if (priceInInr < 45000) return "Mainstream sweet spot. Reliable performance for professional productivity.";
  if (priceInInr < 80000) return "High-tier professional workstation. Optimized for heavy creative workloads.";
  if (priceInInr < 130000) return "Enthusiast-grade flagship. Exceptional long-term performance and build.";
  return "Ultimate workstation. Specialized hardware for extreme computational needs.";
};

const getLaptopGrade = (priceInInr: number) => {
  if (priceInInr < 20000) return { label: 'Value King', color: 'var(--secondary)' };
  if (priceInInr < 50000) return { label: 'Pro Choice', color: 'var(--primary)' };
  if (priceInInr < 100000) return { label: 'Premium', color: '#ffb3ba' };
  return { label: 'Ultimate', color: '#ffd1dc' };
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ price, onReset }) => {
  if (price === null) {
    return (
      <div className="placeholder-container">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ opacity: 0.1 }}
        >
          <Sparkles size={64} />
        </motion.div>
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Ready for Analysis</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '240px', margin: '0 auto', lineHeight: 1.5 }}>Adjust specifications on the left to see <br /> localized market valuations.</p>
        </div>
      </div>
    );
  }

  const priceInInr = Math.round(price * USD_TO_INR * MARKET_ADJUSTMENT);
  const grade = getLaptopGrade(priceInInr);
  const confidence = Math.min(98, Math.max(82, 95 - (priceInInr / 50000))); // Dynamic simulated confidence

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card"
      style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative Glow */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: grade.color, filter: 'blur(80px)', opacity: 0.1, pointerEvents: 'none' }}></div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px', 
          borderRadius: '100px', 
          background: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          color: grade.color,
          fontSize: '0.65rem',
          fontWeight: 800,
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '1.25rem'
        }}>
          <ShieldCheck size={12} /> {grade.label}
        </div>
        
        <h2 style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600 }}>
          Estimated Valuation
        </h2>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="price-pulse"
          style={{ 
            fontSize: 'max(4rem, 5vw)', 
            color: 'var(--text-primary)', 
            margin: '0.25rem 0',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.05em',
            gap: '0.3rem'
          }}
        >
          <span style={{ fontSize: '0.45em', opacity: 0.2, fontWeight: 300 }}>₹</span>
          <span>{priceInInr.toLocaleString('en-IN')}</span>
        </motion.div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
          <TrendingUp size={14} /> MARKET PULSE: STABLE
        </div>
      </div>

      {/* Analysis Metrics */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '3rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em' }}>VALUATION CONFIDENCE</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{confidence.toFixed(1)}%</span>
        </div>
        <div className="confidence-bar">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            className="confidence-fill"
          ></motion.div>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.25rem', lineHeight: 1.6, fontWeight: 500 }}>
          {getMarketInsight(priceInInr)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          onClick={onReset}
          className="glow-btn-primary"
          style={{ 
            flex: 1,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.4rem',
            padding: '1rem',
            fontSize: '0.8rem',
            borderRadius: '14px'
          }}
        >
          <RefreshCcw size={14} /> New Search
        </button>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
;
