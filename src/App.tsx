import React, { useEffect, useState } from 'react';
import type { SearchItem } from './components/SearchBar';
import SearchBar from './components/SearchBar';
import ItemListWithSliders from './components/ItemListWithSliders';
import Plot from './components/Plot.tsx';
import './components/Plot.css'; // Importe também o CSS
import ufrjLogo from './ufrj-vertical-cor-rgb-completa-telas.svg'


// Dados de exemplo (sem alterações)
const poluentes: SearchItem[] = [
  { id: 'dioxina', name: 'Dioxina' },
  { id: 'octocrileno', name: 'Octocrileno' },
  { id: 'benzofenonas', name: 'Benzofenonas' },
  { id: 'metilparabeno', name: 'Metilparabeno' },
  { id: 'propilparabeno', name: 'Propilparabeno' },
  { id: 'mercurio', name: 'Mercurio' },
  { id: 'chumbo', name: 'Chumbo' },
  { id: 'polifluoroalquil', name: 'Polifluoroalquil' },
];

const organismos: SearchItem[] = [
  { id: 'golfinho', name: 'Golfinho' },
  { id: 'plancton', name: 'Plancton' },
  { id: 'tubarão', name: 'Tubarão' },
  { id: 'baleia', name: 'Baleia' },
  { id: 'tartaruga', name: 'Tartaruga' },
  { id: 'peixes', name: 'Peixes de pequeno porte' },

];

type SliderValuesState = {
  [key: string | number]: number;
}

interface OrganismData {
  organismName: string;
  concentrations: number[];
}
interface PollutantData {
  pollutantName: string;
  organisms: OrganismData[];
}
type PlotData = PollutantData[];

function App() {
  // --- ESTADO PARA POLUENTES ---
  const [selectedPollutants, setSelectedPollutants] = useState<SearchItem[]>([]);
  const [sliderValues, setSliderValues] = useState<SliderValuesState>({});
  const [selectedOrganisms, setSelectedOrganisms] = useState<SearchItem[]>([]);
  const [plotData, setPlotData] = useState<PlotData>([]); 
  const [exampleText, setExampleText] = useState<string>("");

  //useEffect das mensagens
  useEffect(() => {
    const messageForDioxina: string = "(Texto-exemplo gerado por IA) - As maiores preocupações com os impactos da dioxina na vida marinha centram-se em sua alta toxicidade e sua capacidade de funcionar como um potente desregulador endócrino. Essa substância, parte do grupo dos Poluentes Orgânicos Persistentes (POPs), interfere diretamente nos sistemas hormonais ao se ligar a receptores celulares, desregulando processos vitais como a reprodução, o desenvolvimento embrionário e a função imunológica. Em diversas espécies marinhas, desde peixes a mamíferos como focas e golfinhos, a exposição à dioxina está comprovadamente ligada a falhas reprodutivas, deformidades em filhotes, supressão do sistema imunológico e um aumento no risco de desenvolvimento de tumores.";
    const messageForOctocrileno: string = "(Texto-exemplo gerado por IA) - As principais preocupações em relação aos efeitos do octocrileno em animais marinhos derivam de seu potencial para atuar como um desregulador endócrino. Produtos químicos desreguladores endócrinos podem interferir nos sistemas hormonais dos animais, que regulam uma ampla gama de funções corporais, incluindo reprodução, desenvolvimento e metabolismo. Em várias espécies marinhas, o octocrileno tem sido associado à toxicidade reprodutiva e a anormalidades no desenvolvimento.";
    const messagesToShow: string[] = [];  
    
    const octocrilenoValue = sliderValues['octocrileno'];
    const dioxinaValue = sliderValues['dioxina'];
    
    if (dioxinaValue > 65) {
      messagesToShow.push(messageForDioxina);
    }
    
    if (octocrilenoValue > 65) {
      messagesToShow.push(messageForOctocrileno);
    }

    //mensagem final
    if (messagesToShow.length > 0) {
      setExampleText(messagesToShow.join('\n\n'));
    } else {
      setExampleText("A título de exemplo, esta mensagem mudará quando as concentrações de dioxina e/ou octocrileno atingirem o limiar superior de 65 µm.");
    }
    
  }, [selectedPollutants, selectedOrganisms, sliderValues]);

  //UseEffect para gerar dados para o app plot
  useEffect(() => {
    const newPlotData = selectedPollutants.map((pollutant, pollutantIndex) => {
    const sliderValue = sliderValues[pollutant.id] || 100;
    const organismDataForPlot: OrganismData[] = selectedOrganisms.map((organism, organismIndex) => {
        
        const timePoints = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const baseConcentrations = timePoints.map(t => 
          Math.log(t + 1) * (organismIndex + 1) * (pollutantIndex + 1) * 5
        );

        const finalConcentrations = baseConcentrations.map(c => c * (sliderValue / 100));
        return {
          organismName: organism.name as string,
          concentrations: finalConcentrations,
        };
      });

      return {
        pollutantName: pollutant.name as string,
        organisms: organismDataForPlot,
      };
    });
    setPlotData(newPlotData);
    
  }, [selectedPollutants, selectedOrganisms, sliderValues]); // Gatilhos do efeito


  // Handler que será chamado pelo SearchBar de Poluentes
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

  // ---HANDLER PARA ORGANISMOS ---
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
    plotsWrapper: { 
      flex: 1,
      minHeight: 0, 
      position: 'relative'
    },
    scrollingPlotsArea: { 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      overflowY: 'auto', 
      padding: '0 1rem 1rem 1rem' 
    },
    gradientOverlay: { 
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: '40px', 
      background: `linear-gradient(to top, #f0f2f5, transparent)`, 
      pointerEvents: 'none' 
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
        <div style={styles.plotsWrapper}>
          <div style={styles.scrollingPlotsArea}>
            <Plot plotData={plotData} />
          </div>
          <div style={styles.gradientOverlay} />
        </div>

        {/* Container Inferior: Texto Explicativo */}
        <aside style={styles.textContainer}>

          <h3>Informações Adicionais (Textos-exemplos) - (Ainda em Idealização)</h3>
           <p style={{ whiteSpace: 'pre-line' }}>
              {exampleText}
          </p>
        </aside>
      </div>
    </div>
  );

  
}

export default App;