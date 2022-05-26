<template>
  <div class="notifications-content__item">
    <div class="item__avatar">
      <div class="avatar" :style="avatarItemStyleObj"></div>
      <div class="icon" :class="itemIconClassObj">
        <MessageIcon v-if="props.item.type === 32" />
        <VoteIcon v-if="props.item.type === 2 || props.item.type === 65536" />
        <ReplyIcon v-if="props.item.type === 4" />
        <CheckIcon v-if="props.item.type === 4096" />
        <MentionIcon v-if="props.item.type === 1024" />
      </div>
    </div>

    <component :is="itemContent" />

    <component class="item__url" :is="{ template: '' + itemUrl + '' }" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import DateTime from "@/components/DateTime.vue";
import ReplyIcon from "@/assets/logos/reply_icon.svg?inline";
import MessageIcon from "@/assets/logos/message2_icon.svg?inline";
import CheckIcon from "@/assets/logos/check_icon.svg?inline";
import VoteIcon from "@/assets/logos/vote_icon.svg?inline";
import MentionIcon from "@/assets/logos/mention_icon.svg?inline";

// props
const props = defineProps({
  item: Object,
});

// computed
const avatarItemStyleObj = computed(() => ({
  "background-image": `url(${props.item.users[0].avatar_url}/-/scale_crop/100x100/-/format/webp/)`,
}));

const itemContent = computed(() => {
  let html = props.item.markdown
    .replace(/(?:\*)\*(.+?)\*(?:\*)/g, "<b>$1</b>")
    .replace(
      /(\[(.+?)\])\((https?\:\/\/.+?)\)/g,
      '<a href="$3" target="_blank">$2</a>'
    )
    .concat(
      "&nbsp " +
        `<span class="date-time"><date-time :date="date" type="1" /></span>`
    );

  return {
    template: "<div class='item__content'>" + html + "</div>",
    props: {
      date: {
        type: null,
        default: () => {
          return props.item.date * 1000;
        },
      },
    },
    components: {
      DateTime,
    },
  };
});

const itemEntryId = computed(() => {
  let matched1 = /https:\/\/.+?\/(\w{2,})\/(\d+)/g.exec(props.item.url);
  let matched2 = /https:\/\/.+?\/(s|u)\/.+?\/(\d+)/g.exec(props.item.url);

  if (matched1?.length) {
    return matched1[2];
  } else if (matched2?.length) {
    return matched2[2];
  }
});

const itemCommentId = computed(() => {
  return /\?comment=(\d+)/g.exec(props.item.url)[1];
});

const itemUrl = computed(() => {
  if (
    props.item.type === 2 ||
    props.item.type === 4 ||
    props.item.type === 32 ||
    props.item.type === 1024
  ) {
    return `<router-link :to="{ path: '/${itemEntryId.value}', query: { comment: ${itemCommentId.value} } }"></router-link>`;
  } else if (props.item.type === 4096) {
    return `<router-link :to="{ path: '/u/${props.item.users[0].id}' }"></router-link>`;
  } else if (props.item.type === 8192 || props.item.type === 65536) {
    return `<router-link :to="{ path: '/${itemEntryId.value}' }"></router-link>`;
  }
});

const itemIconClassObj = computed(() => {
  if (
    props.item.type === 4 ||
    props.item.type === 32 ||
    props.item.type === 1024
  ) {
    return "icon_other";
  } else if (props.item.type === 2 && props.item.icon === "like_up" || props.item.type === 65536 && props.item.icon === "like_up") {
    return "icon_like";
  } else if (props.item.type === 2 && props.item.icon === "like_down" || props.item.type === 65536 && props.item.icon === "like_down") {
    return "icon_dislike"
  } else if (props.item.type === 4096) {
    return "icon_subscribe";
  }
});
</script>