<template>
  <div class="container">
    <div class="wrap-form">
      <div class="header">
        <h1 class="title">Welcome</h1>
        <div class="description">(Vue Challenge)</div>
      </div>
      <div class="content">
        <div
          v-if="isAgeInvalid && formData.birthday"
          class="note"
        >
          Note: You must be 18 or above years old.
        </div>
        <JsonForms
          :data="formData"
          :schema="formSchema"
          :uischema="formUISchema"
          :renderers="renderers"
          :ajv="ajv"
          @change="({ data }) => onChange(data)"
        ></JsonForms>
      </div>
      <button
        class="btn"
        :disabled="(isAgeInvalid || !isValidForm)"
        @click="onSubmit"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { JsonForms } from '@jsonforms/vue';
  import { vanillaRenderers } from '@jsonforms/vue-vanilla';
  import { JsonForm } from '../data/models/JsonForm/JsonForm.model';
  import { JsonSchema, isDateControl, isStringControl, rankWith } from '@jsonforms/core';
  import KendoVueInputComponent from './forms/KendoVueInput.vue';
  import KendoVueDatePickerComponent from './forms/KendoVueDatePicker.vue';
  import { getAge } from '../helpers/CustomFunctions';
  import { emailRegex } from '../helpers/CustomRegex';
  import Ajv from 'ajv';
  import ajvErrors from 'ajv-errors';

  const ajv = new Ajv({
    allErrors: true,
    strict: false // set to false due to compatibility issue in vue 3
  });

  ajvErrors(ajv); // set ajv
  ajv.addFormat('date', /^\d{4}-\d{2}-\d{2}$/); // added date format because it is unknown

  const isValidForm = ref(false);
  
  const renderers = ref(Object.freeze([ // vanilla and custom renderers
    ...vanillaRenderers,
    { // set registry for renderer to export
      renderer: KendoVueInputComponent,
      tester: rankWith(
        3, //increase rank as needed(default is 2)
        isStringControl
      ),
    },
    { // set registry for renderer to export
      renderer: KendoVueDatePickerComponent,
      tester: rankWith(
        4,
        isDateControl
      ),
    }
  ]));

  const formData = ref<JsonForm>({
    firstName: '',
    lastName: '',
    birthday: null,
    email: '',
    age: null,
  });
  
  const formSchema = ref<JsonSchema>({
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      birthday: { format: 'date' },
      email: {
        type: 'string',
        pattern: emailRegex.source,
        errorMessage: { pattern: 'Please input a valid email address.' }
      },
      age: { type: 'number' },
    },
    required: ['firstName', 'lastName', 'birthday', 'email'],
  });

  const formUISchema = ref({
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/firstName',
      },
      {
        type: 'Control',
        scope: '#/properties/lastName',
      },
      {
        type: 'Control',
        scope: '#/properties/birthday',
        options: {
          format: 'date',
        },
      },
      {
        type: 'Control',
        scope: '#/properties/email',
        rule: { // set rule if age is 17 and below then email will hide
          effect: 'HIDE',
          condition: {
            scope: '#/properties/age',
            schema: {
              maximum: 17
            }
          }
        },
      },
      { // reference for email rule and this is always hide
        type: 'Control',
        scope: '#/properties/age',
        rule: {
          effect: 'HIDE',
          condition: {}
        }
      },
    ],
  });

  const isAgeInvalid = computed(() => { // check age if below 18
    return formData.value.age === null || formData.value.age < 18;
  });

  const onChange = (data: JsonForm): void => {
    formData.value = data;
    const validate = ajv.compile(formSchema.value);

    isValidForm.value = validate(formData.value) // set if form is valid
  }

  const onSubmit = (): void => {
    alert('Next button clicked');
  }

  const computedBirthday = computed(() => formData.value.birthday); // used computed

  watch(computedBirthday, (newValue) => { // listen to birthday value only to update age value
    formData.value.age = getAge(newValue as Date);
  }, { deep: true });

</script>
<style scoped lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    background: #f2f2f2;
    height: 100vh;

    .wrap-form {
      width: 390px;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      padding: 77px 55px;
      box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
      -moz-box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
      -webkit-box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
      -o-box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
      -ms-box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);

      .note {
        margin-bottom: 10px;
        color: red;
      }
      .header {
        margin-bottom: 20px;
        text-align: center;
        .title {
          margin: 0px;
          display: block;
          font-size: 30px;
          color: #333;
          line-height: 1.2;
          text-align: center;
        }
        .description {
          font-size: 18px;
        }
      }

      .btn {
        margin-top: 20px;
        background: #57b846;
        width: 100px;
        display: flex;
        justify-content: center;
        margin-left: auto;
        border: 0px;
        border-radius: 20px;
        padding: 10px;
        text-align: center;
        color: #fff;
        cursor: pointer;

        &:hover {
          background: #000;
        }
        &:disabled {
          pointer-events: none;
          cursor: default;
          opacity: 0.5;
        }
      }
    }
  }
</style>