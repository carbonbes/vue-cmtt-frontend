<template>
  <div class="link-block">
    <div>
      <span class="link-block__title">{{ title }}</span>
      <span class="link-block__description">{{ description }}</span>
      <div>{{ url }}</div>
    </div>
    <div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
  },

  computed: {
    title() {
      return this.data[0].data.link.data.title;
    },

    description() {
      return this.data[0].data.link.data.description;
    },

    url() {
      return this.data[0].data.link.data.url;
    },

    sourceIcon() {
      return this.data[0].data.link.data.image.data.uuid;
    },
  },
};
</script>

<style>
.link-block {
  margin-top: 15px;
  padding: 11px 16px;
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  box-shadow: 0 0 1px #00000080;
}

.link-block__title {
  margin-bottom: 2px;
  font-size: 18px;
  font-weight: 500;
}

.link-block__description {
  font-size: 15px;
  line-height: 22px;
}

.link-block__title,
.link-block__description {
  display: block;
  line-height: 26px;
  white-space: nowrap;
  max-width: 472px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 768px) {
  .link-block__title,
  .link-block__description {
    max-width: 230px;
  }
}
</style>