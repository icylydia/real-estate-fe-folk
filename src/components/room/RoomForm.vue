<script setup lang="ts">
import QInputCurrency from 'components/extension/QInputCurrency.vue';
import QInputArea from 'components/extension/QInputArea.vue';
import { useRoom } from 'src/utils/room';
import { computed, onMounted, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoomStore } from 'stores/room-store';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { Field, useForm } from 'vee-validate';

const { roomLayoutUnitOptions } = useRoom();
const { formModel: room } = storeToRefs(useRoomStore());

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newRoom: {
    type: Boolean,
    default: false,
  },
  roomBuilding: {
    type: Object,
    default: {} as PropType<{
      id: string;
      name: string;
      type: string;
    }>,
  },
});

onMounted(() => {
  if (props.newRoom) {
    if (!props.roomBuilding.id) {
      throw new Error('newRoomBuildingId is required when newRoom is true.');
    }
    room.value.building = props.roomBuilding;
  }
});

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  building: object({
    id: string().required().label('物件番号'),
    name: string().required().label('物件名'),
  }).required(),
  name: string().required().label('部屋名'),
  price: string().nullable().label('価格'),
  monthlyRent: string().nullable().label('賃料'),
  deposit: string().nullable().label('敷金'),
  keyMoney: string().nullable().label('礼金'),
  maintenanceFund: string().nullable().label('修繕積立金'),
  managementFee: string().nullable().label('管理費'),
  roomLayoutNumber: string().nullable().label('間取り'),
  roomLayoutUnit: string()
    .when('roomLayoutNumber', {
      is: (val: string) => !!val,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .label('間取り（単位）'),
  exclusiveArea: string().nullable().label('専有面積'),
  extraArea: string().nullable().label('その他面積'),
  note: string().nullable().label('備考'),
}));

const initialValues: any = computed(() => {
  return room.value;
});

const { validate } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
})
</script>

<template>
  <div class="q-mt-md text-h6">
    部屋基本情報{{readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newRoom">
      <q-item-section>
        <q-input v-model="room.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <Field name="building.id" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            label="物件番号"
            readonly
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="building.name" #="{errorMessage, value}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            label="物件名"
            readonly
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="name" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="部屋名"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field
      v-if="room.building?.type != 'building'"
      name="price"
      #="{errorMessage, value, handleChange}"
    >
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="価格"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="monthlyRent" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="賃料"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="deposit" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="敷金"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="keyMoney" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="礼金"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field
      v-if="room.building?.type != 'building'"
      name="maintenanceFund"
      #="{errorMessage, value, handleChange}"
    >
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="修繕積立金"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field
      v-if="room.building?.type != 'building'"
      name="managementFee"
      #="{errorMessage, value, handleChange}"
    >
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="管理費"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="roomLayoutNumber" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="間取り"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="roomLayoutUnit" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="間取り（単位）"
            :readonly="readonly"
            emit-value
            map-options
            :options="roomLayoutUnitOptions"
            clearable
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="exclusiveArea" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-area
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="専有面積"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="extraArea" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-area
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="その他面積"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="note" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="備考"
            autogrow
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
</template>
