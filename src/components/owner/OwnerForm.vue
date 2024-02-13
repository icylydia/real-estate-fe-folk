<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOwnerStore } from 'stores/owner-store';
import { useGender } from 'src/utils/gender';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { Field, useForm } from 'vee-validate';
import { computed, ref } from 'vue';

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newOwner: {
    type: Boolean,
    default: false,
  },
});

const { formModel: owner } = storeToRefs(useOwnerStore());
const { selectOptions: genderOptions } = useGender();
const showPassword = ref(false);

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  lastName: string().required().label('姓'),
  firstName: string().required().label('名'),
  gender: string().oneOf([
    'male', 'female', 'other',
  ]).notRequired().label('性別'),
  phone: string().phone().nullable().transform((value, originalValue) => String(originalValue).trim() === '' ? null : value).label('電話番号'),
  email: string().email().notRequired().nullable().label('メールアドレス'),
  username: string().notRequired().nullable().label('ユーザー名'),
}));

const initialValues: any = computed( () => {
  if (props.newOwner) {
    return {};
  }
  return owner.value;
});

const { validate } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
})

defineEmits<{
  'reset-password': [],
}>();
</script>

<template>
  <div class="text-h6" v-if="!newOwner">
    オーナー基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12 q-py-none" v-if="!newOwner">
      <q-item-section>
        <q-input v-model="owner.id" label="オーナーID" readonly dense />
      </q-item-section>
    </q-item>
    <Field name="lastName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="姓"
            :readonly="readonly"
            dense
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="firstName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="名"
            :readonly="readonly"
            dense
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="gender" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
        <q-item-section>
          <q-select
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="性別"
            :readonly="readonly"
            emit-value
            map-options
            :options="genderOptions"
            clearable
            dense
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="phone" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="電話番号"
            :readonly="readonly"
            dense
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="email" #="{errorMessage, value, field}">
      <q-item class="col-12 q-py-none">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="メールアドレス"
            :readonly="readonly"
            dense
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
  <q-separator class="q-my-md" />
  <div class="text-h6" v-if="!newOwner">
    オーナーアカウント情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <Field name="username" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="ユーザー名"
            :readonly="readonly"
            dense
          />
        </q-item-section>
      </q-item>
    </Field>
    <template v-if="owner.useCustomPassword ?? false">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
        <q-item-section>
          <q-chip
            label="パスワード設定済み"
            color="primary"
            icon="sym_r_key"
            icon-remove="sym_r_refresh"
            dense
            square
            :removable="!readonly"
            @remove="() => $emit('reset-password')"
          />
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <template v-if="owner.initialPassword">
        <Field name="initialPassword" #="{errorMessage, value, field}">
          <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-py-none">
            <q-item-section>
              <q-input
                :model-value="value"
                v-bind="field"
                :error-message="errorMessage"
                :error="!!errorMessage"
                label="パスワード"
                readonly
                dense
                :type="showPassword ? 'text' : 'password'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    @click="showPassword = !showPassword"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:after v-if="!readonly">
                  <q-icon
                    name="sym_r_refresh"
                    @click="() => $emit('reset-password')"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </Field>
      </template>
    </template>
  </q-list>
</template>
