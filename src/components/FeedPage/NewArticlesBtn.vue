<template>
  <div class="new-articles-btn" @click="props.requestFeed">
    <span class="label">Показать</span>
    <span class="count" v-text="props.newArticles"></span>
    <span class="label" v-text="countLabel"></span>
  </div>
</template>

<script setup>
import { markRaw, computed } from "vue";
import wordDeclension from "@/utils/wordDeclension";

// props
const props = defineProps(["newArticles", "requestFeed"]);

// state
const labels = markRaw(["новую запись", "новые записи", "новых записей"]);

// computed
const countLabel = computed(() => wordDeclension(props.newArticles, labels));
</script>

<style lang="scss">
.new-articles-btn {
  margin-bottom: 30px;
  padding: 15px;
  background: var(--island-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;

  > .count {
    margin: 0 5px;
    padding: 2px 4px;
    color: #fff;
    background: var(--blue-color);
    font-size: 12px;
    font-weight: 500;
    border-radius: 4px;
  }

  > .label {
    color: var(--blue-color);
  }
}

@media (max-width: 640px) {
  .new-articles-btn {
    border-radius: 0;
  }
}
</style>