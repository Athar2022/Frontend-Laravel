import { ref } from 'vue'

export function useChart() {
  const chartInstance = ref(null)

  const initChart = (canvas, config) => {
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }
    
    chartInstance.value = new Chart(canvas, config)
  }

  const updateChart = (canvas, data) => {
    if (chartInstance.value) {
      chartInstance.value.data = data
      chartInstance.value.update()
    }
  }

  const destroyChart = () => {
    if (chartInstance.value) {
      chartInstance.value.destroy()
      chartInstance.value = null
    }
  }

  return {
    initChart,
    updateChart,
    destroyChart
  }
}