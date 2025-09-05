import { defineStore } from 'pinia';

export const useButtonStore = defineStore('buttonStore', {
  state: () => ({
    outputTexts: [],
    modalInputValues: [] // 新しいプロパティを追加
  }),
  actions: {
    toggleButton(text) {
      const item = this.outputTexts.find(item => item.text === text);
      if (item) {
        item.status = item.status === 'ON' ? 'OFF' : 'ON';
        // 既存の要素のstatusを切り替え
      } else {
        // 新しい要素を追加
        this.outputTexts.push({ text: text, status: 'ON', inputValue: 1 });
      }
    },
    // 新しいアクションを追加
    updateItemQuantity(text, quantity) {
      const item = this.outputTexts.find(item => item.text === text);
      if (item) {
        item.inputValue = quantity;
      }
    },
    setOutputTexts(outputTexts) {
      this.outputTexts = outputTexts;
    }
  }
});
