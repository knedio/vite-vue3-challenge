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
    <Input
      :id="control.id + '-input'"
      class="kv-input"
      :value="control.data"
      :placeholder="control.description"
      :disabled="!control.enabled"
      @input="onChange"
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
  import { Input } from '@progress/kendo-vue-inputs';
  import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
  import { ControlElement, JsonFormsRendererRegistryEntry, isStringControl, rankWith } from '@jsonforms/core';

  const KendoVueInputComponent = defineComponent({
    name: 'KendoVueInput',
    props: {
      ...rendererProps<ControlElement>()
    },
    data() {
      return {
        touched: false
      }
    },
    components: {
      Input
    },
    setup(props) {
      return useJsonFormsControl(props);
    },
    methods: {
      onChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;

        this.handleChange(
          this.control.path,
          value ?? undefined // set undefined if value is empty
        );
      },
    },
  });

  export default KendoVueInputComponent;

  export const KendoVueInputRenderer: JsonFormsRendererRegistryEntry = { // set registry for renderer to export
    renderer: KendoVueInputComponent,
    tester: rankWith(
      3, //increase rank as needed(default is 2)
      isStringControl
    ),
  };
</script>

<style scoped>
  .kv {
    margin-bottom: 10px;

    .kv-label {
      font-weight: 500;
    }
    .kv-input {
      margin-top: 2px;
    }
    .error {
      font-size: 12px;
      color: red;
    }
  }
</style>