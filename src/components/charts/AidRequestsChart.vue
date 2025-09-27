<template>
  <div class="w-full h-64">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useChart } from '@/composables/useChart'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const chartRef = ref(null)
const { initChart, updateChart } = useChart()

onMounted(() => {
  console.log('AidRequestsChart mounted with data:', props.data)
  if (chartRef.value) {
    const chartData = {
      labels: Object.keys(props.data),
      datasets: [{
        data: Object.values(props.data),
        backgroundColor: [
          '#10B981', // green
          '#EF4444', // red
          '#F59E0B', // yellow
          '#3B82F6'  // blue
        ]
      }]
    }
    
    console.log('Chart data prepared:', chartData)
    
    initChart(chartRef.value, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    })
  }
})

watch(() => props.data, (newData) => {
  console.log('AidRequestsChart data changed:', newData)
  if (chartRef.value && newData && Object.keys(newData).length > 0) {
    updateChart(chartRef.value, {
      labels: Object.keys(newData),
      datasets: [{
        data: Object.values(newData),
        backgroundColor: [
          '#10B981', // green
          '#EF4444', // red
          '#F59E0B', // yellow
          '#3B82F6'  // blue
        ]
      }]
    })
  }
}, { immediate: true, deep: true })
</script>