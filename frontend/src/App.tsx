import React, { useState } from 'react';
import LaptopForm from './components/LaptopForm';
import ResultDisplay from './components/ResultDisplay';
import { type LaptopInput, predictPrice } from './api/laptopApi';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = ["Indexing local markets", "Analyzing hardware delta", "Calculating regional demand", "Finalizing valuation"];

  const handleSubmit = async (data: LaptopInput) => {
    setIsLoading(true);
    setLoadingStep(0);
    setError(null);
    
    // Simulate high-tech multi-stage loading
    const interval = setInterval(() => {
      setLoadingStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 600);

    try {
      const result = await predictPrice(data);
      if ((result as any).error) {
        setError((result as any).error);
      } else {
        setPrediction(result.predicted_price);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Signal lost. Please verify specifications.";
      setError(msg);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background Decorators */}
      <div className="bg-blob blob-1" style={{ opacity: 0.2 }}></div>
      <div className="bg-blob blob-2" style={{ opacity: 0.15 }}></div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <header style={{ marginBottom: '5rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 800, 
              letterSpacing: '0.2em',
              fontSize: '0.65rem',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              marginBottom: '1.25rem'
            }}
          >
            Digital Asset Valuation / v2.0
          </motion.div>

          <h1 style={{ 
            fontSize: 'max(2.5rem, 3.8vw)', 
            lineHeight: 1,
            marginBottom: '0.75rem',
            letterSpacing: '-0.04em',
            fontWeight: 800
          }}>
            Precision <span style={{ color: 'var(--primary)' }}>Pricing.</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.01em' }}>
            Real-time market analytics for a competitive regional advantage.
          </p>
        </header>

        <main className="dashboard-grid">
          <div className="dashboard-col">
            <LaptopForm onSubmit={handleSubmit} isLoading={isLoading} />
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  marginTop: '1.5rem', 
                  color: 'var(--error)', 
                  background: 'rgba(255, 77, 77, 0.05)',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 77, 77, 0.1)',
                  textAlign: 'center'
                }}
              >
                {error}
              </motion.div>
            )}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  marginTop: '1.5rem', 
                  color: 'var(--secondary)', 
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}
              >
                <span className="animate-pulse">{steps[loadingStep]}...</span>
              </motion.div>
            )}
          </div>

          <div className="dashboard-col" style={{ position: 'sticky', top: '2rem' }}>
            <ResultDisplay price={prediction} onReset={handleReset} />
          </div>
        </main>

        <footer style={{ marginTop: '8rem', color: 'var(--text-dim)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.3, borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '3rem', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
          <span>© 2024 Market Dynamics. All rights reserved.</span>
          <span>Regional Focus: South Asia (India)</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
