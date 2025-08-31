// src/components/ThemeSwitcher.tsx
//import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { toggleTheme } = useTheme();

  return (
    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
      <button onClick={() => toggleTheme('theme-light')}>Claro</button>
      <button onClick={() => toggleTheme('theme-dark')}>Escuro</button>
      <button onClick={() => toggleTheme('theme-high-contrast')}>Alto Contraste</button>
    </div>
  );
};

export default ThemeSwitcher;