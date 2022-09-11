<template>
  <Component
    v-for="(text, i) in sanitizedString"
    :key="i"
    :is="{ template: '<p>' + text + '</p>' }"
  />
</template>

<script>
import DOMPurify from "dompurify";

export default {
  props: {
    string: String,
  },

  computed: {
    replacedString() {
      return this.string
        .replace(/\r\n(?:\r\n)/g, "\n\n")
        .replace(/\r\n/g, "\n")
        .replace(/^\>(.+?)(\n|$)/gm, "<comment-quote>$1</comment-quote>")
        .split("\n\n")
        .map((item) =>
          item
            .trim()
            .replace(
              /((\s|^)https?\S+)/gm,
              "<a href='$1' target='_blank'>$1</a>"
            )
            .replace(
              /(\[\@(\d+)\|([^\]]+)\])/g,
              "<router-link :to='{ path: `/u/$2` }'>@$3</router-link>"
            )
            .replace(/\n/g, "<br>")
        );
    },

    sanitizedString() {
      return this.replacedString.map((item) =>
        DOMPurify.sanitize(item, {
          ALLOWED_TAGS: ["a", "br"],
          ALLOWED_ATTR: ["target", "href"],
          ADD_TAGS: ["router-link", "comment-quote"],
          ADD_ATTR: [":to"],
        })
      );
    },
  },
};
</script>
