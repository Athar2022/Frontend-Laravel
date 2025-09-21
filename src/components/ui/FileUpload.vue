<template>
  <div class="file-upload">
    <input
      type="file"
      ref="fileInput"
      :multiple="multiple"
      :accept="accept"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <div
      @click="triggerFileInput"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer transition-colors duration-200"
      :class="{
        'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging,
        'border-red-500': error
      }"
    >
      <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span class="text-blue-600 dark:text-blue-400 font-medium">Click to upload</span>
        or drag and drop
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-500">
        {{ acceptDescription }} (Max {{ maxSize }}MB per file)
      </p>
      
      <p v-if="error" class="text-sm text-red-600 dark:text-red-400 mt-2">
        {{ error }}
      </p>
    </div>

    <!-- Selected files preview -->
    <div v-if="files.length > 0" class="mt-4 space-y-2">
      <div v-for="(file, index) in files" :key="file.id || index" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ file.name }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-500">{{ formatFileSize(file.size) }}</span>
        </div>
        <button
          @click="removeFile(index)"
          class="text-red-500 hover:text-red-700 dark:hover:text-red-400"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '.jpg,.jpeg,.png,.pdf,.doc,.docx'
  },
  maxSize: {
    type: Number,
    default: 10
  },
  maxFiles: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['files-updated'])

const fileInput = ref(null)
const files = ref([])
const isDragging = ref(false)
const error = ref('')

const acceptDescription = computed(() => {
  const types = props.accept.split(',').map(type => {
    if (type === '.jpg') return 'JPG'
    if (type === '.jpeg') return 'JPEG'
    if (type === '.png') return 'PNG'
    if (type === '.pdf') return 'PDF'
    if (type === '.doc') return 'DOC'
    if (type === '.docx') return 'DOCX'
    return type
  })
  return types.join(', ')
})

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileSelect(event) {
  const selectedFiles = Array.from(event.target.files)
  processFiles(selectedFiles)
  event.target.value = ''
}

function handleDrop(event) {
  event.preventDefault()
  isDragging.value = false
  
  const droppedFiles = Array.from(event.dataTransfer.files)
  processFiles(droppedFiles)
}

function handleDragOver(event) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function processFiles(selectedFiles) {
  error.value = ''
  
  if (!props.multiple && selectedFiles.length > 1) {
    error.value = 'Only one file is allowed'
    return
  }
  
  if (files.value.length + selectedFiles.length > props.maxFiles) {
    error.value = `Maximum ${props.maxFiles} files allowed`
    return
  }
  
  for (const file of selectedFiles) {
    if (file.size > props.maxSize * 1024 * 1024) {
      error.value = `File ${file.name} exceeds ${props.maxSize}MB limit`
      continue
    }
    
    if (!isFileTypeValid(file)) {
      error.value = `File ${file.name} is not a valid type`
      continue
    }
    
    files.value.push(file)
  }
  
  emit('files-updated', props.multiple ? files.value : files.value[0])
}

function isFileTypeValid(file) {
  const acceptedTypes = props.accept.split(',')
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
  return acceptedTypes.includes(fileExtension)
}

function removeFile(index) {
  files.value.splice(index, 1)
  emit('files-updated', props.multiple ? files.value : files.value[0] || null)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function clearFiles() {
  files.value = []
  emit('files-updated', null)
}

defineExpose({
  clearFiles
})
</script>