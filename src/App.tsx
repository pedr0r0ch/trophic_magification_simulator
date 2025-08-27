import { useState } from 'react';

//import { ThemeProvider } from './contexts/ThemeContext';
import type { SearchItem } from './components/SearchBar';
import SearchBar from './components/SearchBar'
import ItemListWithSliders from './components/ItemListWithSliders';
// Para o theme switcher (da conversa anterior)
//import ThemeSwitcher  from './components/ThemeSwitcher'; // Adicione as chaves {}import './themes.css';

// Dados de exemplo
const mockItems: SearchItem[] = [
  { id: 'maca', name: 'Maçã' },
  { id: 'banana', name: 'Banana' },
  { id: 'laranja', name: 'Laranja' },
  { id: 'morango', name: 'Morango' },
  { id: 'abacaxi', name: 'Abacaxi' },
];

// O estado dos valores dos sliders será um objeto
// Ex: { maca: 75, banana: 20 }
type SliderValuesState = {
  [key: string | number]: number;
}

function App() {
  // O App agora controla os itens selecionados e os valores dos sliders
  const [selectedItems, setSelectedItems] = useState<SearchItem[]>([]);
  const [sliderValues, setSliderValues] = useState<SliderValuesState>({});

  // Função para ser chamada pelo SearchBar quando um item for selecionado/removido
  const handleSelectionChange = (newSelectedItems: SearchItem[]) => {
    setSelectedItems(newSelectedItems);

    // Opcional: Remover valores de sliders para itens que foram des-selecionados
    const newValues: SliderValuesState = {};
    newSelectedItems.forEach(item => {
      newValues[item.id] = sliderValues[item.id] || 50; // Mantém o valor antigo ou define 50
    });
    setSliderValues(newValues);
  };

  // Função para atualizar o valor de um slider específico
  const handleSliderValueChange = (itemId: string | number, newValue: number) => {
    setSliderValues(prevValues => ({
      ...prevValues,
      [itemId]: newValue,
    }));
  };

  return (
    //<ThemeProvider>
    <div className='sidebar'>
      <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <h1>Controle de Itens</h1>
          
          <SearchBar 
            items={mockItems} 
            placeholder="Pesquisar Poluentes"
            // Passamos a função de callback para o SearchBar
            onSelectionChange={handleSelectionChange}
          />

          <ItemListWithSliders 
            items={selectedItems} 
            values={sliderValues}
            onValueChange={handleSliderValueChange}
          />

          {/* Opcional: Exibir o estado atual para debug */}
          <pre style={{ marginTop: '20px', backgroundColor: '#eee', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify({ selectedItems, sliderValues }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
    //</ThemeProvider>
  );
}

export default App;