import { defineStore } from 'pinia';

export const useButtonStore = defineStore('buttonStore', {
  state: () => ({
    outputTexts: []
  }),
  actions: {
    toggleButton(text) {
      const index = this.outputTexts.findIndex(item => item.text === text);
      if (index !== -1) {
        this.outputTexts[index].status = this.outputTexts[index].status === 'ON' ? 'OFF' : 'ON';
      } else {
        this.outputTexts.push({ text, status: 'ON' });
      }
    },
    setOutputTexts(outputTexts) {
      this.outputTexts = outputTexts;
    }
  }
});