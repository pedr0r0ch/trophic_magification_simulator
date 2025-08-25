// src/components/SearchBar.tsx

import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';


interface SearchBarProps {
  items: SearchItem[];
  placeholder?: string;
  onSelectionChange: (selectedItems: SearchItem[]) => void; // NOVA PROP
}


// --- Ícones como componentes SVG ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`arrow-icon ${isOpen ? 'open' : ''}`}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// --- Definição dos Tipos (TypeScript) ---
export interface SearchItem {
  id: string | number;
  name: string;
}

interface SearchBarProps {
  items: SearchItem[]; // Lista completa de itens para pesquisar
  placeholder?: string;
}


// --- O Componente Principal ---
const SearchBar: React.FC<SearchBarProps> = ({ items, placeholder = "Pesquisar...", onSelectionChange }) => {
  // ... todos os seus hooks e lógica existentes

  const [selectedItems, setSelectedItems] = useState<SearchItem[]>([]);

  // NOVO useEffect para notificar o componente pai
  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isSelectedMenuOpen, setIsSelectedMenuOpen] = useState(false);

  const searchBarRef = useRef<HTMLDivElement>(null);

  // Filtra os itens com base no termo de pesquisa
  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const results = items.filter(item => 
        item.name.toLowerCase().includes(lowercasedTerm) &&
        !selectedItems.find(selected => selected.id === item.id)
      );
      setFilteredItems(results);
      setIsResultsOpen(true);
    } else {
      setIsResultsOpen(false);
    }
  }, [searchTerm, items, selectedItems]);

  // Efeito para fechar os menus ao clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsResultsOpen(false);
        setIsSelectedMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectItem = (item: SearchItem) => {
    setSelectedItems(prev => [...prev, item]);
    setSearchTerm('');
    setIsResultsOpen(false);
  };

  const handleRemoveItem = (itemToRemove: SearchItem) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemToRemove.id));
  };

  const toggleSelectedMenu = () => {
    setIsSelectedMenuOpen(prev => !prev);
    setIsResultsOpen(false); // Fecha o outro menu
  };

  return (
    <div className="search-bar-container" ref={searchBarRef}>
      <div className="search-input-wrapper">
        <div className="search-icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsResultsOpen(true)}
        />
        <button type="button" className="arrow-button" onClick={toggleSelectedMenu}>
          <ArrowIcon isOpen={isSelectedMenuOpen} />
        </button>
      </div>

      {/* Menu de Resultados da Pesquisa */}
      {isResultsOpen && filteredItems.length > 0 && (
        <ul className="results-dropdown">
          {filteredItems.map(item => (
            <li key={item.id} onClick={() => handleSelectItem(item)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}

      {/* Menu de Itens Selecionados */}
      {isSelectedMenuOpen && (
        <div className="selected-dropdown">
          {selectedItems.length > 0 ? (
            <ul>
              {selectedItems.map(item => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <button onClick={() => handleRemoveItem(item)}>×</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-message">Nenhum item selecionado</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;