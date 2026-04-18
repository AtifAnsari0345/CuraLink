import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import curalinkLogo from '../assets/Curalink logo.jpg';

const roleCards = [
  {
    key: 'patient',
    icon: '🏥',
    title: 'Patient / Caregiver',
    subtitle: 'Turn complex medical research into clearer next steps.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    borderColor: '#c4b5fd',
    benefits: [
      'Search research personalized to your condition',
      'Find actively recruiting clinical trials',
      'Save useful studies and revisit them later'
    ]
  },
  {
    key: 'researcher',
    icon: '🔬',
    title: 'Researcher',
    subtitle: 'Search literature faster and coordinate work from one dashboard.',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    borderColor: '#93c5fd',
    benefits: [
      'Search publications across major live sources',
      'Track trials, meetings, and collaboration activity',
      'Build a research network inside the platform'
    ]
  }
];

const featureCards = [
  {
    title: 'Live Research Search',
    description: 'Curalink pulls from PubMed, OpenAlex, and ClinicalTrials.gov to keep results grounded in real data.'
  },
  {
    title: 'Role-Based Workspaces',
    description: 'Patients and researchers get tailored dashboards, filters, and workflows instead of one generic experience.'
  },
  {
    title: 'Save and Reuse',
    description: 'Bookmark publications and trials, revisit favorites, and continue work without losing context.'
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  const scrollToRoles = () => {
    document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#f8faff', color: '#0f172a', minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(148,163,184,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 40px'
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={curalinkLogo} alt="Curalink" style={{width:32,height:32,borderRadius:8,objectFit:'cover',marginRight:8}} />
            <span style={{
              fontSize: '21px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Curalink
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: isMobile ? '6px 14px' : '10px 18px',
                fontSize: isMobile ? '13px' : '14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Sign In
            </button>
            <button
              onClick={scrollToRoles}
              style={{
                padding: isMobile ? '6px 14px' : '10px 18px',
                fontSize: isMobile ? '13px' : '14px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Choose Role
            </button>
          </div>
      </nav>

      <section style={{
        background: 'linear-gradient(180deg, #f4f0ff 0%, #eef5ff 100%)',
        paddingTop: '80px',
        paddingLeft: isMobile ? '16px' : '40px',
        paddingRight: isMobile ? '16px' : '40px',
        paddingBottom: '48px'
      }}>
        <div style={{
          width: 'min(1200px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 14px',
              borderRadius: '999px',
              backgroundColor: 'rgba(124,58,237,0.08)',
              color: '#7c3aed',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '18px'
            }}>
              Powered by PubMed, OpenAlex, and ClinicalTrials.gov
            </div>
            <h1 style={{
              fontSize: 'clamp(2.3rem, 5vw, 4.2rem)',
              lineHeight: 1.08,
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '18px',
              maxWidth: '100%'
            }}>
              Your AI Medical Research Companion
            </h1>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: '#475569',
              maxWidth: '640px',
              marginBottom: '28px'
            }}>
              Curalink turns research discovery into a smoother workflow for both patients and researchers. Search live studies,
              review active trials, save favorites, and move into a role-specific dashboard that stays organized.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={scrollToRoles}
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 16px 36px rgba(124,58,237,0.22)',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                Explore Roles
              </button>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                Create Account
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(148,163,184,0.18)',
            borderRadius: '28px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(15,23,42,0.08)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '16px' : '20px',
              marginBottom: '24px'
            }}>
              {[
                ['200M+', 'Research papers indexed'],
                ['500K+', 'Clinical trials searchable'],
                ['2', 'Role-specific dashboards'],
                ['Real-time', 'AI-assisted summaries']
              ].map(([value, label]) => (
                <div key={label} style={{
                  padding: '20px 16px',
                  borderRadius: '18px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#7c3aed', marginBottom: '6px' }}>{value}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#e2e8f0',
              padding: '22px'
            }}>
              <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd', marginBottom: '8px' }}>
                Why it matters
              </div>
              <div style={{ fontSize: '15px', lineHeight: 1.8, color: '#cbd5e1' }}>
                Instead of forcing everyone through the same UI, Curalink now gives patients and researchers one clear role choice,
                then routes them into the right experience.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '24px 16px 72px' }}>
        <div style={{
          width: 'min(1200px, 100%)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '26px',
                boxShadow: '0 10px 28px rgba(15,23,42,0.04)'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#64748b' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="roles" style={{ padding: '0 16px 72px' }}>
        <div style={{ width: 'min(1200px, 100%)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '34px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Choose Your Experience
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#0f172a', fontWeight: 800, marginBottom: '10px' }}>
              One clear role selection
            </h2>
            <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '16px', lineHeight: 1.75, color: '#64748b' }}>
              The duplicate role prompts have been removed. Choose your role once here and continue directly into the right onboarding path.
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '24px'
          }}>
            {roleCards.map((card) => (
              <div
                key={card.key}
                onMouseEnter={() => setHoveredCard(card.key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/register', { state: { role: card.key } })}
                style={{
                  backgroundColor: '#ffffff',
                  border: `1px solid ${hoveredCard === card.key ? card.borderColor : '#e2e8f0'}`,
                  borderRadius: '24px',
                  padding: isMobile ? '24px' : '40px',
                  boxShadow: hoveredCard === card.key ? '0 18px 42px rgba(59,130,246,0.12)' : '0 10px 28px rgba(15,23,42,0.05)',
                  cursor: 'pointer',
                  transform: hoveredCard === card.key ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
              >
                <div style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  background: card.gradient,
                  color: '#ffffff',
                  marginBottom: '20px'
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#64748b', marginBottom: '20px' }}>{card.subtitle}</p>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                  {card.benefits.map((benefit) => (
                    <div key={benefit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '999px',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        ✓
                      </span>
                      <span style={{ fontSize: '15px', lineHeight: 1.7, color: '#334155' }}>{benefit}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: card.gradient,
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}>
                  Continue as {card.key === 'patient' ? 'Patient' : 'Researcher'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: isMobile ? '24px 16px' : '32px 16px' }}>
        <div style={{
          width: 'min(1200px, 100%)',
          margin: '0 auto',
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'space-between',
          gap: '18px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>Curalink</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>AI Medical Research Assistant</div>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Sources: PubMed • OpenAlex • ClinicalTrials.gov</div>
          <div style={{ fontSize: '13px', color: '#c4b5fd' }}>Created by Atif Ansari</div>
        </div>
      </footer>
    </div>
  );
}
