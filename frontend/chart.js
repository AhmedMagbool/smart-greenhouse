import { currentLang, toArabicNumber } from './ui.js';

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: currentLang === 'ar' ? 'الإضاءة' : 'Light',
        data: [],
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
        pointRadius: 2
      },
      {
        label: currentLang === 'ar' ? 'درجة الحرارة (°C)' : 'Temperature (°C)',
        data: [],
        borderColor: '#FFA726',
        backgroundColor: 'rgba(255,167,38,0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
        pointRadius: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8
        }
      },
      y: {
        position: 'left',
        title: {
          display: true,
          text: currentLang === 'ar' ? 'الإضاءة' : 'Light'
        }
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: currentLang === 'ar' ? 'الحرارة' : 'Temperature (°C)'
        }
      }
    }
  }
});

const url = "http://127.0.0.1:5000/api/sensors";

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (!data || !Array.isArray(data)) return;

    const recent = data.slice(-30);
    const labels = [], lightData = [], tempData = [];

    recent.forEach(item => {
      const time = new Date(item.timestamp).toLocaleTimeString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: '2-digit', minute: '2-digit'
      });

      labels.push(currentLang === 'ar' ? toArabicNumber(time) : time);
      lightData.push(item.light ?? 0);
      tempData.push(item.temperature ?? 0);
    });

    chart.data.labels = labels;
    chart.data.datasets[0].data = lightData;
    chart.data.datasets[1].data = tempData;
    chart.update();
  });
