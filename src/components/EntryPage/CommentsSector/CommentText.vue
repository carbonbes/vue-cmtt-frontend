<template>
  <component
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
        .replace(
          /^\>(.+?)(\n|$)/gm,
          "<div class='quote'><svg xmlns:xlink='http://www.w3.org/1999/xlink' width='16' height='12' xmlns='http://www.w3.org/2000/svg' class='icon'><defs><symbol viewBox='0 0 39 28' id='entry_quote'><path d='M16.375.094V4.78c-2.448 0-4.727.788-6.836 2.364-2.11 1.575-3.164 3.457-3.164 5.644 0 1.302.52 1.953 1.563 1.953.234 0 .703-.091 1.406-.273.729-.157 1.315-.235 1.758-.235 1.432 0 2.78.58 4.043 1.739 1.263 1.159 1.894 2.754 1.894 4.785 0 1.979-.651 3.678-1.953 5.097-1.302 1.42-3.086 2.13-5.352 2.13-2.708 0-4.895-1.023-6.562-3.067-1.667-2.044-2.5-4.89-2.5-8.535 0-5.026 1.53-8.965 4.59-11.817C8.322 1.715 12.026.224 16.375.094zm21.445 0V4.78c-2.317 0-4.563.775-6.738 2.324-2.174 1.55-3.262 3.444-3.262 5.684 0 1.302.521 1.953 1.563 1.953.234 0 .703-.091 1.406-.273.73-.157 1.315-.235 1.758-.235 1.51 0 2.877.6 4.101 1.797 1.224 1.198 1.836 2.774 1.836 4.727 0 1.979-.65 3.678-1.953 5.097-1.302 1.42-3.086 2.13-5.351 2.13-2.709 0-4.896-1.023-6.563-3.067-1.666-2.044-2.5-4.89-2.5-8.535 0-5.026 1.53-8.965 4.59-11.817C29.767 1.715 33.471.224 37.82.094z' fill='9B9B9B' fill-rule='evenodd' opacity='.418'></path></symbol></defs><use xlink:href='#entry_quote' fill='currentColor'></use></svg><span class='quote-content'>$1</span></div>"
        )
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
          ALLOWED_TAGS: ["br", "a"],
          ADD_TAGS: ["router-link"],
          ADD_ATTR: [":to", "target"],
        })
      );
    },
  },
};
</script>
