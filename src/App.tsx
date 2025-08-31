import React, { useState } from 'react';
import type { SearchItem } from './components/SearchBar';
import SearchBar from './components/SearchBar';
import ItemListWithSliders from './components/ItemListWithSliders';
import Plot from './components/Plot.tsx';
import './components/Plot.css'; // Importe também o CSS
import ufrjLogo from './ufrj-vertical-cor-rgb-completa-telas.svg'


// Dados de exemplo (sem alterações)
const poluentes: SearchItem[] = [
  { id: 'dioxinas', name: 'Dioxinas' },
  { id: 'furanos', name: 'Furanos' },
  // ... resto dos poluentes
];

const organismos: SearchItem[] = [
  { id: 'fitoplancton', name: 'Baleia' },
  { id: 'zooplancton', name: 'Zooplâncton' },
  // ... resto dos organismos
];

type SliderValuesState = {
  [key: string | number]: number;
}

function App() {
  // --- ESTADO PARA POLUENTES ---
  // Renomeado para maior clareza
  const [selectedPollutants, setSelectedPollutants] = useState<SearchItem[]>([]);
  const [sliderValues, setSliderValues] = useState<SliderValuesState>({});

  // --- NOVO: ESTADO APENAS PARA ORGANISMOS ---
  const [selectedOrganisms, setSelectedOrganisms] = useState<SearchItem[]>([]);

  // --- HANDLERS PARA POLUENTES ---

  // Handler que será chamado APENAS pelo SearchBar de Poluentes
  const handlePollutantSelectionChange = (newSelectedItems: SearchItem[]) => {
    setSelectedPollutants(newSelectedItems);

    const newValues: SliderValuesState = {};
    newSelectedItems.forEach(item => {
      newValues[item.id] = sliderValues[item.id] || 50; // Mantém o valor antigo ou define 50
    });
    setSliderValues(newValues);
  };

  // Handler para os sliders (só se aplica aos poluentes)
  const handleSliderValueChange = (itemId: string | number, newValue: number) => {
    setSliderValues(prevValues => ({
      ...prevValues,
      [itemId]: newValue,
    }));
  };

  // --- NOVO: HANDLER APENAS PARA ORGANISMOS ---
  // Uma versão mais simples que só atualiza a lista de organismos selecionados.
  const handleOrganismSelectionChange = (newSelectedItems: SearchItem[]) => {
    setSelectedOrganisms(newSelectedItems);
  };


  // --- ESTILOS PARA O LAYOUT ---
  const styles: { [key: string]: React.CSSProperties } = {
    // Container Pai que organiza as duas colunas principais
    mainContainer: {
      display: 'flex',
      height: '100vh', // Força a altura total da tela
      backgroundColor: '#f0f2f5'
    },
    // COLUNA 1: Controles (Sidebar)
    controlsColumn: {
      color: '#ffffffff',
      width: '400px',
      flexShrink: 0, // Impede que a coluna encolha
      padding: '20px',
      backgroundColor: '#2c2c2cff',
      borderRight: '1px solid #e0e0e0',
      overflowY: 'auto', // Adiciona rolagem se os controles excederem a altura
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
    },
    // COLUNA 2: Conteúdo Principal (Gráficos + Texto)
    contentColumn: {
      flex: 1, // Faz esta coluna ocupar todo o espaço restante
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${ufrjLogo})`,
      backgroundSize: '150%', // 'contain' garante que o logo inteiro apareça
      backgroundPosition: '40% 20%', // Centraliza a imagem no container
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column', // Empilha os containers de gráficos e texto
      overflow: 'hidden', // Importante para o scroll interno funcionar
      padding: '20px',
      gap: '20px', // Espaçamento entre o container de gráficos e de texto
    },
    // Container dos Gráficos (Dentro da Coluna 2)
    plotsContainer: {
      flex: 1, // Faz este container crescer para ocupar o espaço disponível
      overflowY: 'auto', // Adiciona sua própria barra de rolagem
      minHeight: 0, // Truque de CSS para o flexbox calcular a altura corretamente
      paddingRight: '10px', // Espaço para a barra de rolagem
    },
    // Container do Texto (Dentro da Coluna 2)
    textContainer: {
      flexShrink: 0, // Impede que este container encolha
      height: '250px', // Altura base para o container de texto
      overflowY: 'auto', // Adiciona sua própria barra de rolagem
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      //box-shadow: 0 4px 20px rgba(0, 0, 0, 0.511)
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.59)',
    },
    section: {
      color: '#000000ff',
      padding: '20px',
      backgroundColor: '#e3e2e2ff',
      borderRadius: '8px',
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* --- COLUNA 1: CONTROLES --- */}
      <aside style={styles.controlsColumn}>
        <h1 style={{marginTop: 0}}>Parâmetros</h1>
        <section style={styles.section}>
          <h2>1. Organismos</h2>
          <SearchBar 
            items={organismos} 
            placeholder="Pesquisar organismos..."
            // Conectado ao handler de organismos
            onSelectionChange={handleOrganismSelectionChange}
          />

          {selectedOrganisms.length > 0 && (
            <div style={{ marginTop: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <strong>Organismos Selecionados:</strong>
              <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                {selectedOrganisms.map(org => <li key={org.id}>{org.name}</li>)}
              </ul>
            </div>
          )}
          
        </section>
        <section style={styles.section}>
          <h2>2. Poluentes e Concentrações</h2>
          <SearchBar 
            items={poluentes} 
            placeholder="Pesquisar por poluentes..."
            // Conectado ao handler de poluentes
            onSelectionChange={handlePollutantSelectionChange}
          />          
          
          <ItemListWithSliders 
            items={selectedPollutants} 
            values={sliderValues}
            onValueChange={handleSliderValueChange}
          />        </section>
      <section style={styles.section}>
        <h2>Outras opções poderão ser incluidas aqui</h2>
      </section>
      </aside>
      

      {/* --- COLUNA 2: CONTEÚDO --- */}
      <div style={styles.contentColumn}>
        {/* Container Superior: Gráficos */}
        <main style={styles.plotsContainer}>
          <Plot 
          selectedPollutants={selectedPollutants}
          sliderValues={sliderValues}
        />
        </main>

        {/* Container Inferior: Texto Explicativo */}
        <aside style={styles.textContainer}>

          <h3>Informações Adicionais (texto-exemplo) - (poderá ser oculto)</h3>
          <p>
            A magnificação trófica da dioxina é o aumento progressivo da sua concentração ao longo da cadeia alimentar, devido à sua bioacumulação nos organismos. Sendo uma substância lipossolúvel (solúvel em gordura), as dioxinas acumulam-se no tecido adiposo dos animais e, como a sua eliminação do corpo é lenta, passam de um nível trófico para outro, concentrando-se cada vez mais em predadores no topo da cadeia, incluindo os humanos através da ingestão de alimentos contaminados, principalmente carne e laticínios. 
Como a magnificação trófica da dioxina ocorre:
1. Dispersão ambiental: As dioxinas são libertadas no ambiente através de processos industriais e queimadas, e espalham-se pela atmosfera e solo. 
2. Contaminação de organismos: Organismos aquáticos e terrestres, como plantas e animais, absorvem as dioxinas presentes no meio ambiente. 
3. Bioacumulação: Devido à sua natureza lipofílica (afinidade por gorduras), as dioxinas não são facilmente excretadas e acumulam-se nos tecidos gordos dos animais. 
4. Transferência na cadeia alimentar: Quando um organismo é consumido por outro, as dioxinas presentes nos seus tecidos são transferidas e acumulam-se ainda mais. 
5. Concentração no topo da cadeia: Ao longo da cadeia alimentar, a concentração de dioxinas aumenta a cada nível trófico, atingindo os níveis mais elevados em predadores de topo, como os humanos, que consomem alimentos de origem animal contaminados. 
Impacto na saúde humana:
A exposição humana às dioxinas ocorre maioritariamente através da ingestão de alimentos contaminados, sendo que mais de 90% da exposição se dá por esta via. 
As dioxinas são substâncias químicas persistentes e bioacumulativas, que podem causar graves problemas de saúde, incluindo perturbações nos sistemas nervoso, imunológico, reprodutivo e endócrino, e são classificadas como carcinógenos humanos. 
          </p>
        </aside>
      </div>
    </div>
  );

  
}

export default App;