import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from 'chart.js';
import './Plot.css';

// Registrar os módulos do Chart.js
ChartJS.register(
  CategoryScale, LinearScale, LogarithmicScale, PointElement,
  LineElement, Title, Tooltip, Legend
);

// --- TIPOS PARA OS DADOS QUE O COMPONENTE RECEBE ---

// A estrutura de um único organismo (uma linha no gráfico)
interface OrganismData {
  organismName: string;
  concentrations: number[];
}

// A estrutura de um único poluente (um gráfico inteiro)
interface PollutantData {
  pollutantName: string;
  organisms: OrganismData[];
}

// O tipo final da prop que o App irá passar: uma lista de dados de poluentes
type PlotData = PollutantData[];

// Define que o componente Plot espera receber uma prop chamada 'plotData'
interface PlotProps {
  plotData: PlotData;
}


const Plot: React.FC<PlotProps> = ({ plotData }) => {
  // --- FUNÇÃO AUXILIAR PARA ESTILIZAR OS GRÁFICOS ---
  const getChartOptions = (poluenteNome: string) => ({
    responsive: true,
    aspectRatio: 1.1,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `Concentração de ${poluenteNome}`, font: { size: 18 } },
    },
    scales: {
      y: { type: 'logarithmic' as const, //se nao da erro
           title: { display: true, text: 'Concentração (µg/g)' },
           min: 0, 
           max: 100 },
      x: { title: { display: true, text: 'Tempo (Anos)' } },
    },
    
  });

  // --- LÓGICA DE RENDERIZAÇÃO ---

  // Se não houver dados para exibir, mostra uma mensagem
  if (!plotData || plotData.length === 0) {
    return (
      <div className="plot-placeholder">
        Selecione poluentes e organismos para gerar os gráficos.
      </div>
    );
  }

  // Se houver dados, renderiza os gráficos
  return (
    <div className="plot-container">
      {plotData.map((pollutantData, index) => {
        
        // Mapeia os dados recebidos para o formato que o Chart.js espera ('datasets')
        const chartDatasets = pollutantData.organisms.map((org, orgIndex) => {
          const colors = ['#008d8dff', '#014877ff', '#b41538ff', '#c38e08ff', '#5632a0ff'];
          const color = colors[orgIndex % colors.length];
          return {
            label: org.organismName,
            data: org.concentrations,
            borderColor: color,
            backgroundColor: color + '80', // Adiciona transparência
            tension: 0.8,
          };
        });

        // Prepara o objeto de dados final para o componente <Line>
        const finalChartData = {
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], // 10 pontos de dados
          datasets: chartDatasets,
        };

        return (
          <div key={index} className="plot-item">
            <Line 
              options={(getChartOptions(pollutantData.pollutantName))} 
              data={finalChartData} 
            />
          </div>
        );
      })}
    </div>
  );
};

export default Plot;