<template>
  <u-modal>
    v-model="visible"
    :title="title"
    @confirm="submit"
    @closed="remove"
    show-cancel-button
    close-on-popstate
		:zoom="false"
  >
    <div class="inputContainer">
      <input type="text" :placeholder="placehodler" v-model="value" />
    </div>
  </u-modal>
</template>

<script>
export default {
  name: "message",
  data() {
    return {
      visible: false,
      value: "",
    };
  },
  props: {
    show: {
      type: Boolean,
    },
    getValue: {
      type: Function,
    },
    beforeClose: {
      type: Function,
    },
    remove: {
      type: Function,
    },
    title: {
      type: String,
      default: "",
    },
    placehodler: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: [String, Number],
      default: "",
    },
  },
  methods: {
    showModal() {
      this.visible = false;
    },
    submit() {
      this.getValue(this.value);
    },
  },
  mounted() {
    this.visible = true;
    this.value = this.defaultValue || "";
  },
};
</script>

<style scoped lang="scss">
.inputContainer {
  padding: 35px;
  width: 100%;
  margin-bottom: 45px;
  display: flex;
  justify-content: center;
  input {
    display: block;
    width: 81%;
    height: 80px;
    padding: 0 30px;
    background-color: #f5f5f5;
    border-radius: 8px;
    border: solid 1px #dddddd;
    font-family: MicrosoftYaHei;
    font-size: 28px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #333333;
  }
}
</style>