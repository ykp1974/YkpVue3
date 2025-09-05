<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <input type="number" v-model="inputValue" @input="validateInput" class="centered-input" />
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
  border-radius: 5px;
  text-align: center;
  width: 30%;
  max-width: 300px;
}
.centered-input {
  text-align: center;
}
</style>
