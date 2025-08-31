import React from 'react';
import './CustomSlider.css';

// --- Tipos para as Props ---
interface CustomSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (newValue: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) => {

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Converte o valor do evento (que é string) para número
    onChange(Number(event.target.value));
  };

  return (
    <div className="slider-wrapper">
      <label className="slider-label">{label}</label>
      <div className="slider-controls">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="slider-input"
        />
        <span className="slider-value">{value + ' µg/g'}</span>
      </div>
    </div>
  );
};

export default CustomSlider;