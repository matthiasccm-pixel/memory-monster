import React from 'react';
import { useFeatureGate } from '../../core/licensing/useFeatureGate.js';

const SettingRow = ({ title, description, checked, onChange, isPremium = false }) => {
  const { isFree } = useFeatureGate();
  
  // Determine if this feature should be locked
  const isLocked = isPremium && isFree;
  const displayChecked = isLocked ? false : checked; // Force pro features to show as off for free users
  
  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label style={{
      position: 'relative',
      display: 'inline-block',
      width: '48px',
      height: '28px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        position: 'absolute',
        cursor: disabled ? 'not-allowed' : 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#7209b7' : 'rgba(107, 114, 128, 0.3)',
        transition: 'all 0.3s ease',
        borderRadius: '28px',
        boxShadow: checked ? '0 4px 12px rgba(114, 9, 183, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          height: '20px',
          width: '20px',
          left: checked ? '24px' : '4px',
          bottom: '4px',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
        }} />
      </span>
    </label>
  );

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid rgba(107, 114, 128, 0.1)',
      opacity: isLocked ? 0.6 : 1
    }}>
      <div style={{ flex: 1, paddingRight: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {title}
          </div>
          {isPremium && (
            <div style={{
              background: 'linear-gradient(135deg, #7209b7 0%, #533483 100%)',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              PRO
            </div>
          )}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.4'
        }}>
          {description}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>
        <ToggleSwitch 
          checked={displayChecked} 
          onChange={isLocked ? () => {} : onChange} 
          disabled={isLocked}
        />
      </div>
    </div>
  );
};

export default SettingRow;