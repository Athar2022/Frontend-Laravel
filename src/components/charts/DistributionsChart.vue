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
  if (chartRef.value) {
    initChart(chartRef.value, {
      type: 'bar',
      data: {
        labels: Object.keys(props.data),
        datasets: [{
          label: 'Distributions',
          data: Object.values(props.data),
          backgroundColor: '#3B82F6'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
})

watch(() => props.data, (newData) => {
  if (chartRef.value && newData) {
    updateChart(chartRef.value, {
      labels: Object.keys(newData),
      datasets: [{
        data: Object.values(newData)
      }]
    })
  }
}, { deep: true })
</script>