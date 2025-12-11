<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { defineAsyncComponent } from "vue";
import FOG from "vanta/dist/vanta.fog.min";
import { useWindowSize } from "@vueuse/core";

const vantaRef = ref(null);
let vantaEffect: any = null;

const { width } = useWindowSize();
// Cek apakah Desktop? (Lebar > 768px)
const isDesktop = computed(() => width.value > 768);

onMounted(() => {
  try {
    if (isDesktop.value) {
      vantaEffect = FOG({
        el: vantaRef.value,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,

        // --- CUSTOM COLOR CONFIGURATION ---
        highlightColor: 0x34d399, // Hijau Muda (Emerald 400)
        midtoneColor: 0x065f46, // Hijau Tua (Emerald 800)
        lowlightColor: 0x022c22, // Hijau Sangat Tua (Emerald 950)
        baseColor: 0xe2e8f0, // Putih Gelap / Abu-abu (Slate 200)

        blurFactor: 0.6,
        speed: 1.5,
        zoom: 0.8,
      });
    }
  } catch (error) {
    console.error("Vanta JS Error:", error);
  }
});

onBeforeUnmount(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
  }
});
</script>

<template>
  <div ref="vantaRef" class="absolute inset-0 z-0 w-full h-full"></div>
</template>
