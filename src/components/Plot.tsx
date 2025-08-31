import React, { useState, useEffect } from 'react';
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
import type { SearchItem } from './SearchBar'; // Assumindo que o tipo está em SearchBar
import './Plot.css';

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale, LinearScale, LogarithmicScale, PointElement,
  LineElement, Title, Tooltip, Legend
);

// --- TIPOS PARA AS PROPS DO COMPONENTE ---
interface PlotProps {
  selectedOrganisms: SearchItem[];
  selectedPollutants: SearchItem[];
  sliderValues: { [key: string | number]: number };
}

// --- DADOS BASE DA SIMULAÇÃO (COM ESCALA DE TEMPO LOGARÍTMICA) ---
const baseSimulationData: { [key: string]: any[] } = {
  'mercurio': [
    { label: 'Fitoplâncton', data: [0.5, 0.8, 1.5, 2.5, 3.5], color: 'rgb(75, 192, 192)' },
    { label: 'Sardinha', data: [5, 8, 15, 25, 35], color: 'rgb(54, 162, 235)' },
    { label: 'Tubarão', data: [50, 80, 150, 250, 350], color: 'rgb(255, 99, 132)' },
  ],
  'pcb': [
    { label: 'Fitoplâncton', data: [0.2, 0.4, 0.9, 1.8, 2.5], color: 'rgb(75, 192, 192)' },
    { label: 'Sardinha', data: [2, 4, 9, 18, 25], color: 'rgb(54, 162, 235)' },
    { label: 'Tubarão', data: [40, 70, 130, 200, 250], color: 'rgb(255, 99, 132)' },
  ],
  'ddt': [
    { label: 'Algas', data: [0.8, 1.2, 2.0, 3.0, 4.0], color: 'rgb(153, 102, 255)' },
    { label: 'Ostra', data: [4, 6, 10, 15, 20], color: 'rgb(255, 159, 64)' },
    { label: 'Golfinho', data: [50, 80, 140, 210, 250], color: 'rgb(255, 205, 86)' },
  ],
  'chumbo': [
    { label: 'Zooplâncton', data: [2, 4, 5.5, 6.5, 7.2], color: 'rgb(75, 192, 192)' },
    { label: 'Anchova', data: [20, 40, 55, 65, 72], color: 'rgb(54, 162, 235)' },
    { label: 'Leão-marinho', data: [250, 450, 580, 660, 710], color: 'rgb(255, 99, 132)' },
  ],
};

const Plot: React.FC<PlotProps> = ({ selectedPollutants, sliderValues, selectedOrganisms}) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const newChartData = selectedPollutants.map(pollutant => {
      const baseDataSets = baseSimulationData[pollutant.id] || [];
      const sliderValue = sliderValues[pollutant.id] || 100;

      const updatedDataSets = baseDataSets.map(dataSet => {
        const multipliedData = dataSet.data.map(point => point * (sliderValue / 100));
        return {
          ...dataSet,
          data: multipliedData,
          borderColor: dataSet.color,
          backgroundColor: dataSet.color.replace(')', ', 0.5)').replace('rgb', 'rgba'),
          tension: 0.4,
        };
      });

      return {
        poluenteNome: pollutant.name,
        chartData: {
          labels: ['1 Ano', '2 Anos', '5 Anos', '10 Anos', '20 Anos'],
          datasets: updatedDataSets,
        },
      };
    });

    setChartData(newChartData);
  }, [selectedPollutants, sliderValues, selectedOrganisms]);

  const getChartOptions = (poluenteNome: string) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `Concentração de ${poluenteNome}`, font: { size: 18 } },
    },
    scales: {
      y: { type: 'logarithmic' as const, title: { display: true, text: 'Concentração (µg/g)' } },
      x: { title: { display: true, text: 'Tempo (Anos)' } },
    },
  });
  
  if (selectedPollutants.length === 0) {
    return <div className="plot-placeholder"> Selecione ao menos um poluente para visualizar o gráfico.</div>;
  }

  return (
  <div>
    {Array.from({ length: Math.ceil(chartData.length / 4) }, (_, pageIndex) => {
      const start = pageIndex * 4;
      const end = start + 4;
      const pageCharts = chartData.slice(start, end);

      return (
        <div key={pageIndex} className="plot-container">
          {pageCharts.map((data, i) => (
            <div key={i} className="plot-item">
              <Line options={getChartOptions(data.poluenteNome)} data={data.chartData} />
            </div>
          ))}
        </div>
      );
    })}
  </div>
);
};

export default Plot;
