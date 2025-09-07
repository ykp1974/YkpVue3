<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <div class="quantity-control">
        <button @click="decrement" :disabled="inputValue <= 0" :class="{ 'disabled-button': inputValue <= 0 }">-</button>
        <input type="number" v-model="inputValue" @input="validateInput" class="centered-input" />
        <button @click="increment">+</button>
      </div>
      <br/>
      <button @click="handleOkClick">OK</button>
      <!-- キャンセルボタンを追加 -->
      <button @click="closeModal">キャンセル</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show', 'title', 'content', 'initialValue'],
  data() {
    return {
      inputValue: 0
    };
  },
  methods: {
    handleOkClick() {
      // 数量とステータスをHome.vueに渡す
      this.$emit('updateModalInputValues', parseInt(this.inputValue, 10));
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    },
    validateInput(event) {
      const value = event.target.value;
      if (!/^\d*$/.test(value)) {
        event.target.value = this.inputValue;
      } else {
        this.inputValue = value;
      }
    },
    increment() {
      this.inputValue = parseInt(this.inputValue, 10) + 1;
    },
    decrement() {
      if (this.inputValue > 0) {
        this.inputValue = parseInt(this.inputValue, 10) - 1;
      }
    }
  },
  watch: {
    // モーダルが表示されるたびにinputValueをリセットする
    show(newVal) {
      if (newVal) {
        this.inputValue = this.initialValue;
      }
    }
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  width: 30%;
  max-width: 300px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.quantity-control {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.quantity-control button {
  font-size: 24px;
  font-weight: bold;
  padding: 5px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  /* グレー系のグラデーションに変更 */
  background: linear-gradient(145deg, #7c838c, #4e535a);
  transition: all 0.3s ease;
  height: 45px;
  line-height: 1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.quantity-control button:active {
  transform: translateY(2px);
  box-shadow: none;
}
.quantity-control button.disabled-button {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}
.quantity-control input {
  width: 80px;
  text-align: center;
  margin: 0 10px;
  height: 45px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 18px;
  -moz-appearance: textfield;
}
.quantity-control input:focus {
  outline: none;
  border-color: #2575fc;
  box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.2);
}
/* Chrome, Safari, Edge, Operaのドリルボタンを非表示 */
.quantity-control input::-webkit-outer-spin-button,
.quantity-control input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>