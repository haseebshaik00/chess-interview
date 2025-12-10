import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const decreaseCount = () => {count.value--;};
  const increaseCount = () => {count.value++;};
  const oddOrEven = computed(() => {
    if(count.value % 2 == 0) return 'even';
    return 'odd';
  });
  return { count, decreaseCount, increaseCount, oddOrEven };
})
