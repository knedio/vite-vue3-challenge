<template>
  <div
    v-if="control.visible"
    class="kv"
  >
    <label
      :for="control.id + '-label'"
      class="kv-label"
    >
      {{ control.label  }} <span v-if="control.required">*</span>
    </label>
    <DatePicker
      :id="control.id + '-input'"
      class="kv-input"
      :value="control.data"
      :placeholder="control.description"
      :disabled="!control.enabled"
      @change="onChange"
      @blur="touched = true;"
    />
    <div
      v-if="touched && control.required && ['', undefined].includes(control.data)"
      class="error"
    >
      This field is required.
    </div>
    <div
      v-else-if="touched && control.errors"
      class="error"
    >
      {{ control.errors }}
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';  
  import { DatePicker } from "@progress/kendo-vue-dateinputs";
  import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
  import { ControlElement, JsonFormsRendererRegistryEntry, isDateControl, rankWith } from '@jsonforms/core';

  const KendoVueDatePickerComponent = defineComponent({
    name: 'KendoVueDatePicker',
    props: {
      ...rendererProps<ControlElement>(), // set the renderes props
    },
    data() {
      return {
        touched: false
      }
    },
    components: {
      DatePicker
    },
    setup(props) {
      return useJsonFormsControl(props);
    },
    methods: {
      onChange(event: Event) {
        this.handleChange(
          this.control.path,
          (event.target as HTMLInputElement).value
        );
      },
    },
  });

  export default KendoVueDatePickerComponent;

  export const KendoVueDatePickerRenderer: JsonFormsRendererRegistryEntry = { // set registry for renderer to export
    renderer: KendoVueDatePickerComponent,
    tester: rankWith(
      4,
      isDateControl
    ),
  };
</script>

<style scoped lang="scss">
  .kv {
    margin-bottom: 10px;
    .kv-label {
      font-weight: 500;
    }
    .kv-input {
      margin-top: 2px;
    }
  }
</style>