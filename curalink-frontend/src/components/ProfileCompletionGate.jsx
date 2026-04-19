/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import curalinkLogo from '../assets/Curalink logo.jpg';

export default function ProfileCompletionGate({ children }) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    location: user?.profile?.location || '',
    conditions: user?.profile?.conditions || [],
    institution: user?.profile?.institution || '',
    specialties: user?.profile?.specialties || [],
    researchInterests: user?.profile?.researchInterests || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  const BASE_URL = import.meta.env.VITE_API_URL || 'https://curalink-9la1.onrender.com';

  const conditionOptions = [
    'Diabetes', 'Cancer', 'Heart Disease', "Parkinson's Disease", "Alzheimer's Disease",
    'Lung Cancer', 'Hypertension', 'Asthma', 'Arthritis', 'Depression', 'Anxiety',
    'Multiple Sclerosis', 'Epilepsy', 'Stroke', 'Obesity', 'Breast Cancer',
    'Prostate Cancer', 'Kidney Disease', 'Liver Disease', 'Thyroid Disease'
  ];
  const specialtyOptions = [
    'Oncology', 'Neurology', 'Cardiology', 'Endocrinology', 'Immunology', 'Genetics',
    'Pulmonology', 'Psychiatry', 'Radiology', 'Pharmacology', 'Infectious Disease',
    'Pediatrics', 'Geriatrics', 'Surgery', 'Internal Medicine'
  ];
  const interestOptions = [
    'Clinical Trials', 'Drug Discovery', 'Immunotherapy', 'Gene Therapy', 'AI in Medicine',
    'Precision Medicine', 'Epidemiology', 'Biomarkers', 'Neurodegeneration', 'Cancer Research',
    'Mental Health', 'Rare Diseases', 'Vaccine Development', 'Stem Cell Research'
  ];

  const isComplete = user?.profile?.firstName && user?.profile?.lastName &&
    (user?.role === 'researcher'
      ? user?.profile?.institution
      : user?.profile?.conditions?.length > 0);

  if (isComplete) return children;

  const progress = useMemo(() => {
    let filled = 0;
    let total = 0;

    // First & last name are always required
    total += 2;
    if (formData.firstName.trim()) filled++;
    if (formData.lastName.trim()) filled++;

    if (user?.role === 'patient') {
      total += 1;
      if (formData.conditions.length > 0) filled++;
    } else {
      total += 1;
      if (formData.institution.trim()) filled++;
    }

    return { filled, total, percentage: Math.round((filled / total) * 100) };
  }, [formData, user?.role]);

  async function handleSave() {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }
    if (user?.role === 'patient' && formData.conditions.length === 0) {
      setError('Please select at least one condition.');
      return;
    }
    if (user?.role === 'researcher' && !formData.institution.trim()) {
      setError('Institution is required for researchers.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('curalink_token');
      await axios.put(`${BASE_URL}/api/auth/profile`, { profile: formData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await updateProfile({ profile: formData });
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function toggleArrayItem(arr, item) {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  }

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '24px'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    width: isMobile ? 'calc(100vw - 32px)' : '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
    WebkitFontSmoothing: 'antialiased',
    padding: isMobile ? '20px' : '0'
  };

  const headerStyle = {
    padding: isMobile ? '20px 20px 16px' : '28px 32px 20px',
    textAlign: 'center',
    borderBottom: '1px solid #f1f5f9'
  };

  const progressBarStyle = {
    marginTop: '16px',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '999px',
    overflow: 'hidden'
  };

  const progressFillStyle = {
    height: '100%',
    background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
    width: `${progress.percentage}%`,
    borderRadius: '999px',
    transition: 'width 0.4s ease'
  };

  const bodyStyle = {
    padding: isMobile ? '16px 20px 20px' : '24px 32px 32px',
    overflowY: 'auto',
    flex: 1
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
    background: 'white',
    boxSizing: 'border-box'
  };

  const tagContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px'
  };

  const tagStyle = (selected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: isMobile ? '5px 10px' : '7px 14px',
    borderRadius: '999px',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '2px solid',
    transition: 'all 0.15s ease',
    userSelect: 'none',
    background: selected ? '#7c3aed' : 'white',
    color: selected ? 'white' : '#374151',
    borderColor: selected ? '#7c3aed' : '#e2e8f0'
  });

  const scrollableTagsStyle = {
    ...tagContainerStyle,
    maxHeight: '160px',
    overflowY: 'auto',
    padding: '4px 0',
    position: 'relative'
  };

  const errorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '13px',
    marginBottom: '16px'
  };

  const btnStyle = {
    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '0 32px',
    height: '46px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px rgba(124,58,237,0.3)'
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <img
            src={curalinkLogo}
            alt="Curalink"
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              objectFit: 'cover',
              margin: '0 auto 14px',
              display: 'block',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <h2 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#1e293b',
            margin: '0 0 6px'
          }}>
            Complete Your Profile
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Please set up your profile to get personalized research insights
          </p>

          <div style={progressBarStyle}>
            <div style={progressFillStyle} />
          </div>
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            marginTop: '8px',
            fontWeight: 600
          }}>
            {progress.filled}/{progress.total} required fields
          </div>
        </div>

        <div style={bodyStyle}>
          {error && (
            <div style={errorStyle}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '14px',
            marginBottom: '16px'
          }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input
                style={inputStyle}
                value={formData.firstName}
                onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input
                style={inputStyle}
                value={formData.lastName}
                onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Smith"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Location</label>
            <input
              style={inputStyle}
              value={formData.location}
              onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
              placeholder="City, Country"
            />
          </div>

          {user?.role === 'patient' && (
            <div style={{ marginBottom: '8px' }}>
              <label style={labelStyle}>Your Medical Conditions *</label>
              <div style={scrollableTagsStyle}>
                {conditionOptions.map(c => (
                  <span
                    key={c}
                    style={tagStyle(formData.conditions.includes(c))}
                    onClick={() => setFormData(p => ({ ...p, conditions: toggleArrayItem(p.conditions, c) }))}
                  >
                    {formData.conditions.includes(c) ? '✓ ' : ''}{c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user?.role === 'researcher' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Institution *</label>
                <input
                  style={inputStyle}
                  value={formData.institution}
                  onChange={e => setFormData(p => ({ ...p, institution: e.target.value }))}
                  placeholder="Harvard Medical School"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Specialties</label>
                <div style={scrollableTagsStyle}>
                  {specialtyOptions.map(s => (
                    <span
                      key={s}
                      style={tagStyle(formData.specialties.includes(s))}
                      onClick={() => setFormData(p => ({ ...p, specialties: toggleArrayItem(p.specialties, s) }))}
                    >
                      {formData.specialties.includes(s) ? '✓ ' : ''}{s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={labelStyle}>Research Interests</label>
                <div style={scrollableTagsStyle}>
                  {interestOptions.map(i => (
                    <span
                      key={i}
                      style={tagStyle(formData.researchInterests.includes(i))}
                      onClick={() => setFormData(p => ({ ...p, researchInterests: toggleArrayItem(p.researchInterests, i) }))}
                    >
                      {formData.researchInterests.includes(i) ? '✓ ' : ''}{i}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            style={btnStyle}
            onClick={handleSave}
            disabled={saving}
            onMouseEnter={e => {
              if (!saving) e.currentTarget.style.transform = 'translateY(-1px)';
              if (!saving) e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.3)';
            }}
          >
            {saving ? 'Saving...' : 'Complete Setup & Enter Dashboard →'}
          </button>
        </div>
      </div>
    </div>
  );
}
