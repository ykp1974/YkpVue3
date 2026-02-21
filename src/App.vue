<template>
  <div id="app-container">
    <div id="nav">
      <div class="nav-content">
        <!-- 左端：オーダー画面 -->
        <router-link 
          :to="{ name: 'ListComp', params: { message: message, outputTexts: outputTexts } }"
          class="nav-item"
        >
          オーダー画面
        </router-link>
        
        <!-- 右端：Home -->
        <div class="nav-right">
          <router-link to="/" class="nav-item">Home</router-link>
        </div>
      </div>
    </div>

    <!-- コンテンツ表示エリア。背景色が適用されるメインコンテナ -->
    <main class="main-content">
      <router-view 
        @updateMessage="updateMessage" 
        @updateOutputTexts="updateOutputTexts" 
      />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      message: "", 
      outputTexts: [] 
    };
  },
  methods: {
    updateMessage(newMessage) {
      this.message = newMessage;
    },
    updateOutputTexts(newOutputTexts) {
      console.log('this.outputTexts@@-->' + JSON.stringify(newOutputTexts));
      // OFFの場合は削除してテキストのみの配列にするロジックを維持
      this.outputTexts = newOutputTexts
        .filter(item => item.status !== 'OFF')
        .map(item => item.text);
    }
  }
};
</script>

<style>
/* 全体共通のベース設定（scopedを外してbodyに近い部分まで適用） */
body {
  margin: 0;
  padding: 0;
  /* ほんの少しだけダークな背景色 */
  background-color: #f5f7f9; 
}

#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
/* ナビゲーションのレイアウト調整 */
#nav {
  display: flex;
  align-items: center;
  padding: 25px 30px;
  background-color: dimgray;
  border-bottom: 1px solid #eaeaea;
}

.nav-content {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  gap: 80px; 
}

/* 右側の要素を端へ押し出す */
.nav-right {
  margin-left: auto;
}

/* リンクの共通フォントスタイル */
.nav-item {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s;
  color: white;
}

.order-link {
  color: #42b983;
}

.home-link {
  color: #2c3e50;
}

/* アクティブ（現在地）のリンク色 */
.nav-item.router-link-exact-active {
  color: #42b983;
}

.nav-item:hover {
  color: #42b983;
  text-decoration: none;
}
.main-content {
  flex: 1;
  /* ここでも念のため背景色を保証 */
  background-color: #f5f7f9;
}

@media (max-width: 600px) {
  .nav-content {
    gap: 30px;
    justify-content: center;
  }
}
</style>