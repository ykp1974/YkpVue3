<template>
  <div class="about-container">
    <div class="header-section">
      <h2 class="page-title">注文履歴</h2>
      <button class="refresh-button" @click="fetchHistory" :disabled="isLoading">
        {{ isLoading ? '取得中...' : '履歴を更新' }}
      </button>
    </div>

    <!-- 簡易デバッグログ（画面確認用） -->
    <div v-if="statusMessage" class="status-banner" :class="{ 'error-bg': isError }">
      {{ statusMessage }}
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>スプレッドシートからデータを取得しています...</p>
    </div>

    <div v-else-if="history.length > 0" class="table-wrapper">
      <table class="history-table">
        <thead>
          <tr>
            <th class="col-time">オーダー日時</th>
            <th class="col-content">オーダー内容</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in history" :key="index">
            <td class="time-cell">{{ record['オーダー日時'] || '不明' }}</td>
            <td class="content-cell">{{ record['オーダー'] || 'データなし' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <p>表示できる履歴がありません。「履歴を更新」を押すか、コンソールログを確認してください。</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AboutView',
  data() {
    return {
      history: [],
      isLoading: false,
      statusMessage: '',
      isError: false
    };
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory() {
      const url = process.env.VUE_APP_GAS_ORDER_URL;
      this.statusMessage = '';
      this.isError = false;

      if (!url) {
        this.isError = true;
        this.statusMessage = '環境変数 VUE_APP_GAS_ORDER_URL が見つかりません。';
        return;
      }

      this.isLoading = true;
      console.log('--- 履歴取得開始 ---');
      console.log('Request URL:', url);

      try {
        // console.log('Response Status:', response.status);
        // console.log('Response Data:', response.data);

        // if (Array.isArray(response.data)) {
        //   // 最新を上に表示
        //   this.history = [...response.data].reverse();
        //   this.statusMessage = `${response.data.length}件のデータを取得しました。`;
        // } else {
        //   this.isError = true;
        //   this.statusMessage = 'GASからの応答が配列形式ではありません。';
        //   console.error('Unexpected data structure:', response.data);
        // }
        // GASのdoGetへアクセス
       const response = await axios.get(url);
        
        if (Array.isArray(response.data)) {
          // 1. 有効なデータのみ抽出
          let filteredData = response.data.filter(item => {
            return Object.values(item).some(val => val !== "" && val !== null);
          });

          // 2. 「オーダー日時」で降順（新しい順）にソート
          // 文字列比較ですが、yyyy/MM/dd 形式なのでそのまま比較で最新が上になります
          filteredData.sort((a, b) => {
            const dateA = a['オーダー日時'] || "";
            const dateB = b['オーダー日時'] || "";
            return dateB.localeCompare(dateA);
          });

          this.history = filteredData;
        }
      } catch (error) {
        this.isError = true;
        console.error('Fetch Error:', error);
        
        if (error.response) {
          this.statusMessage = `サーバーエラー: ${error.response.status}`;
        } else if (error.request) {
          this.statusMessage = 'サーバーから応答がありません（CORS制限やURL不備の可能性があります）。';
        } else {
          this.statusMessage = `エラー: ${error.message}`;
        }
      } finally {
        this.isLoading = false;
        console.log('--- 履歴取得終了 ---');
      }
    }
  }
};
</script>

<style scoped>
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-weight: bold;
  color: #2c3e50;
  border-left: 6px solid #42b983;
  padding-left: 15px;
  margin: 0;
}

.status-banner {
  background-color: #f0fff4;
  color: #2f855a;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  border: 1px solid #c6f6d5;
}

.status-banner.error-bg {
  background-color: #fff5f5;
  color: #c53030;
  border-color: #fed7d7;
}

.refresh-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background-color: #38a171;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  background-color: #f8fafc;
  padding: 15px 20px;
  text-align: left;
  color: #718096;
  font-size: 0.85rem;
  border-bottom: 2px solid #edf2f7;
}

.history-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
  font-size: 0.95rem;
  line-height: 1.5;
}

.col-time { width: 30%; }
.time-cell { color: #718096; font-family: monospace; }
.content-cell { font-weight: 500; }

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #a0aec0;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin { 100% { transform: rotate(360deg); } }
</style>