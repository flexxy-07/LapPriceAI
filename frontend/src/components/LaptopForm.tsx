import React, { useState, useEffect } from 'react';
import { type LaptopInput, fetchMetadata, type LaptopMetadata } from '../api/laptopApi';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LaptopFormProps {
  onSubmit: (data: LaptopInput) => void;
  isLoading: boolean;
}

const LaptopForm: React.FC<LaptopFormProps> = ({ onSubmit, isLoading }) => {
  const [metadata, setMetadata] = useState<LaptopMetadata | null>(null);
  const [showPPIHelper, setShowPPIHelper] = useState(false);
  const [ppiInputs, setPPIInputs] = useState({ width: 1920, height: 1080, inches: 15.6 });
  
  const [formData, setFormData] = useState<LaptopInput>({
    Company: 'Apple',
    Product: 'MacBook Pro',
    TypeName: 'Ultrabook',
    Ram: 8,
    OpSys: 'macOS',
    Weight: 1.37,
    Touchscreen: 0,
    IPS: 1,
    PPI: 226.98,
    Cpu_Brand: 'Intel Core i5',
    Gpu_Brand: 'Intel',
    SSD: 256,
    HDD: 0
  });

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const data = await fetchMetadata();
        setMetadata(data);
        if (data.companies.length > 0) {
          setFormData(prev => ({ ...prev, Company: data.companies[0] }));
        }
      } catch (error) {
        console.error("Failed to load metadata", error);
      }
    };
    getMetadata();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const handleToggle = (name: 'Touchscreen' | 'IPS') => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name] === 1 ? 0 : 1
    }));
  };

  const calculatePPI = () => {
    const { width, height, inches } = ppiInputs;
    if (width > 0 && height > 0 && inches > 0) {
      const ppi = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / inches;
      setFormData(prev => ({ ...prev, PPI: parseFloat(ppi.toFixed(2)) }));
      setShowPPIHelper(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!metadata) {
    return (
      <div className="glass-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="animate-pulse" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>Gathering market metadata...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card">
      <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>Hardware Parameters</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 500 }}>Specify the core configuration for valuation.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Row 1: Brand & Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">Company</label>
            <div style={{ position: 'relative' }}>
              <select className="input-field" name="Company" value={formData.Company} onChange={handleChange}>
                {metadata.companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.2 }} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Type</label>
            <div style={{ position: 'relative' }}>
              <select className="input-field" name="TypeName" value={formData.TypeName} onChange={handleChange}>
                {metadata.types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Row 2: Processor & GPU */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label className="input-label">CPU Brand</label>
            <div style={{ position: 'relative' }}>
              <select className="input-field" name="Cpu_Brand" value={formData.Cpu_Brand} onChange={handleChange}>
                {metadata.cpu_brands.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.2 }} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">GPU Brand</label>
            <div style={{ position: 'relative' }}>
              <select className="input-field" name="Gpu_Brand" value={formData.Gpu_Brand} onChange={handleChange}>
                {metadata.gpu_brands.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.2 }} />
            </div>
          </div>
        </div>

        {/* Row 3: RAM Chip Selection */}
        <div className="input-group">
          <label className="input-label">Memory (RAM GB)</label>
          <div className="chip-group">
            {[4, 8, 16, 32, 64].map(size => (
              <motion.button
                key={size}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`spec-chip ${formData.Ram === size ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, Ram: size }))}
              >
                {size}GB
              </motion.button>
            ))}
          </div>
        </div>

        {/* Row 4: Storage Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">SSD Capacity</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{formData.SSD}GB</span>
            </div>
            <input 
              type="range" 
              min="0" max="2048" step="128"
              className="aether-slider" 
              name="SSD" 
              value={formData.SSD} 
              onChange={handleChange} 
            />
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">HDD Capacity</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>{formData.HDD}GB</span>
            </div>
            <input 
              type="range" 
              min="0" max="2048" step="128"
              className="aether-slider" 
              name="HDD" 
              value={formData.HDD} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Row 5: Display & Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">Screen PPI</label>
              <button 
                type="button" 
                onClick={() => setShowPPIHelper(!showPPIHelper)}
                style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em' }}
              >
                AUTO-CALC
              </button>
            </div>
            <input type="number" step="0.01" className="input-field" style={{ padding: '0.9rem' }} name="PPI" value={formData.PPI} onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button" 
              onClick={() => handleToggle('Touchscreen')}
              className={`spec-chip ${formData.Touchscreen ? 'active' : ''}`}
              style={{ flex: 1, height: '48px' }}
            >
              Touch
            </button>
            <button 
              type="button" 
              onClick={() => handleToggle('IPS')}
              className={`spec-chip ${formData.IPS ? 'active' : ''}`}
              style={{ flex: 1, height: '48px' }}
            >
              IPS
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPPIHelper && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              overflow: 'hidden', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 'var(--radius-md)', 
              marginTop: '2rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.6rem' }}>Width</label>
                <input type="number" className="input-field" style={{ padding: '0.75rem' }} value={ppiInputs.width} onChange={(e) => setPPIInputs(p => ({ ...p, width: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.6rem' }}>Height</label>
                <input type="number" className="input-field" style={{ padding: '0.75rem' }} value={ppiInputs.height} onChange={(e) => setPPIInputs(p => ({ ...p, height: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.6rem' }}>Diag</label>
                <input type="number" step="0.1" className="input-field" style={{ padding: '0.75rem' }} value={ppiInputs.inches} onChange={(e) => setPPIInputs(p => ({ ...p, inches: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <button type="button" onClick={calculatePPI} className="glow-btn-secondary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.7rem', borderRadius: '12px' }}>
              Set PPI
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        type="submit" 
        className="glow-btn-primary" 
        disabled={isLoading}
        style={{ width: '100%', marginTop: '3.5rem', padding: '1.1rem', fontSize: '0.9rem', borderRadius: '16px' }}
      >
        {isLoading ? 'Crunching Markets...' : 'Estimate Fair Value'}
      </button>
    </form>
  );
};

export default LaptopForm;
