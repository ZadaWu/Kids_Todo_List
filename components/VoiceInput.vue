<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import {iconMap} from '~/lib/iconMap'

const emit = defineEmits(['input'])
const isListening = ref(false)
const transcript = ref('')
const matchedIcon = ref('')
const iconColor = ref('')

// 语音识别
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
recognition.continuous = false
recognition.interimResults = true
recognition.lang = 'zh-CN'


// 语音识别事件处理
recognition.onstart = () => {
  isListening.value = true
  transcript.value = ''
}

recognition.onresult = (event) => {
  const current = event.resultIndex
  transcript.value = event.results[current][0].transcript
  
  // 匹配图标和颜色
  for (const [key, value] of Object.entries(iconMap)) {
    if (transcript.value.includes(key)) {
      matchedIcon.value = value.icon
      iconColor.value = value.color
      break
    }
  }
}

recognition.onend = () => {
  isListening.value = false
  emit('input', { text: transcript.value, icon: matchedIcon.value })
}

// 开始录音
const startListening = () => {
  try {
    recognition.start()
  } catch (error) {
    console.error('语音识别启动失败:', error)
  }
}

// 停止录音
const stopListening = () => {
  recognition.stop()
}
</script>

<template>
  <div class="voice-input-container">
    <div class="icon-display" v-if="matchedIcon">
      <Icon 
        :icon="matchedIcon" 
        class="text-xl" 
        :style="{ color: iconColor }"
      />
    </div>
    <button 
      @mousedown="startListening"
      @mouseup="stopListening"
      :class="{ 'recording': isListening }"
      class="mic-button"
    >
      <Icon 
        :icon="isListening ? 'mdi:microphone' : 'mdi:microphone-outline'" 
        class="text-xl"
        :style="{ color: isListening ? 'white' : '#6B7280' }"
      />
    </button>
  </div>
</template>

<style scoped>
.voice-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-display {
  position: absolute;
  right: 3.5rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  transition: all 0.3s ease;
}

.icon-display:hover {
  transform: scale(1.1);
}

.mic-button {
  padding: 0.5rem;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.mic-button.recording {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style> 