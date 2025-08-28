// Common styles used across the application

export const containerStyle = {
  height: '100vh',
  background: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 20%, #16213e 40%, #0f3460 60%, #533483 80%, #7209b7 100%)`,
  backgroundSize: '400% 400%',
  animation: 'gradientShift 20s ease-in-out infinite',
  overflow: 'hidden',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  position: 'relative'
};

export const mainContentStyle = {
  height: '100vh',
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  overflow: 'hidden',
  position: 'relative'
};

export const sidebarStyle = {
  background: `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.10) 50%, rgba(255, 255, 255, 0.05) 100%)`,
  backdropFilter: 'blur(24px) saturate(180%)',
  borderRight: '1px solid rgba(255, 255, 255, 0.2)',
  padding: '40px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 0 40px rgba(0, 0, 0, 0.3) inset'
};

export const sidebarItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 20px',
  borderRadius: '16px',
  color: 'rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  fontSize: '15px',
  fontWeight: '600',
  position: 'relative',
  overflow: 'hidden'
};

export const activeSidebarItemStyle = {
  ...sidebarItemStyle,
  background: `linear-gradient(135deg, rgba(114, 9, 183, 0.4) 0%, rgba(83, 52, 131, 0.3) 100%)`,
  color: 'white',
  boxShadow: `0 8px 32px rgba(114, 9, 183, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`
};

export const contentAreaStyle = {
  padding: '40px',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: '40px',
  height: '100vh' // Fixed height
};

export const cardStyle = {
  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.90) 100%)`,
  backdropFilter: 'blur(32px) saturate(180%)',
  borderRadius: '20px',
  padding: '32px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
  position: 'relative',
  overflow: 'hidden'
};

export const premiumCardStyle = {
  ...cardStyle,
  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)`,
  boxShadow: `0 32px 64px rgba(114, 9, 183, 0.3), 0 16px 32px rgba(83, 52, 131, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(114, 9, 183, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.3) inset`
};

export const byteCardStyle = {
  ...cardStyle,
  background: `linear-gradient(135deg, rgba(114, 9, 183, 0.08) 0%, rgba(255, 255, 255, 0.95) 20%, rgba(255, 255, 255, 0.90) 100%)`,
  border: '2px solid rgba(114, 9, 183, 0.2)',
  boxShadow: `0 24px 48px rgba(114, 9, 183, 0.25), 0 12px 24px rgba(83, 52, 131, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(114, 9, 183, 0.15) inset, 0 1px 0 rgba(255, 255, 255, 0.3) inset`
};