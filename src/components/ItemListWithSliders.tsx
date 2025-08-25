import React from 'react';
import type { SearchItem } from './SearchBar';
import CustomSlider from './CustomSlider';
import './ItemListWithSliders.css';

// --- Tipos para as Props ---
interface ItemListProps {
  items: SearchItem[];
  values: { [key: string | number]: number }; // Objeto com id do item e valor do slider
  onValueChange: (itemId: string | number, newValue: number) => void;
}

const ItemListWithSliders: React.FC<ItemListProps> = ({ items, values, onValueChange }) => {
  if (items.length === 0) {
    return null; // Não renderiza nada se não houver itens
  }

  return (
    <div className="item-list-container">
      <h2 className="list-title">Itens Selecionados</h2>
      <div className="sliders-list">
        {items.map(item => (
          <CustomSlider
            key={item.id}
            label={item.name}
            value={values[item.id] || 50} // O valor vem do estado do App, com um padrão de 50
            onChange={(newValue) => onValueChange(item.id, newValue)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemListWithSliders;