<script setup lang="ts">
import QInputCurrency from 'components/extension/QInputCurrency.vue';
import { storeToRefs } from 'pinia';
import { useIncomeStore } from 'stores/income-store';
import { usePayment } from 'src/utils/payment';
import { Field, useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { useBuildingStore } from 'stores/building-store';
import { useTenantStore } from 'stores/tenant-store';
import { useOwnerStore } from 'stores/owner-store';

const {
  incomeCategoryOptions: categoryOptions,
  paymentMethodOptions,
  describeIncomeConfirmStatus,
} = usePayment();
const { formModel: income } = storeToRefs(useIncomeStore());

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newIncome: {
    type: Boolean,
    default: false,
  }
});

/**********************
 * Building select
 **********************/
const buildingOptions = ref<Array<{
  name: string | undefined;
  id: string | number | undefined;
}> | undefined>(undefined);

const getAllBuildingOptions = () => {
  return useBuildingStore().buildingOptions.map((v) => {
    return {
      name: v.name || '',
      id: v.id || '',
    };
  });
};

enum BuildingLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const buildingsStatus = ref<BuildingLoadingStatus>(BuildingLoadingStatus.BeforeLoad);
const buildingFilterFn = (val: string, update: () => void) => {
  if (
    buildingsStatus.value === BuildingLoadingStatus.BeforeLoad
    || buildingsStatus.value === BuildingLoadingStatus.Aborted
  ) {
    buildingsStatus.value = BuildingLoadingStatus.Loading;
    useBuildingStore()
      .getBuildingOptions()
      .then(() => {
        buildingsStatus.value = BuildingLoadingStatus.Loaded;
        buildingOptions.value = getAllBuildingOptions();
        update();
      })
      .catch(() => {
        buildingsStatus.value = BuildingLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    buildingOptions.value = getAllBuildingOptions();
  } else {
    buildingOptions.value = getAllBuildingOptions().filter((v) => {
      return v.name && v.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};

const handleBuildingChange = (e: any, callback: (e: any) => void) => {
  setFieldValue('room', null, false);
  useBuildingStore().resetRoomOptions();
  roomsStatus.value = RoomLoadingStatus.BeforeLoad
  callback(e);
};

/**********************
 * Room select
 **********************/
const roomOptions = ref<Array<{
  name: string | undefined;
  id: string | number | undefined;
}> | undefined>(undefined);

const getAllRoomOptions = () => {
  return useBuildingStore().roomOptions.map((v) => {
    return {
      name: v.name || '',
      id: v.id || '',
    };
  });
};

enum RoomLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const roomsStatus = ref<RoomLoadingStatus>(RoomLoadingStatus.BeforeLoad);
const roomFilterFn = (val: string, update: () => void) => {
  const buildingId = values.building?.id;
  if (!buildingId) {
    useBuildingStore().resetRoomOptions();
    update();
    return;
  }

  if (
    roomsStatus.value === RoomLoadingStatus.BeforeLoad
    || roomsStatus.value === RoomLoadingStatus.Aborted
  ) {
    roomsStatus.value = RoomLoadingStatus.Loading;
    useBuildingStore()
      .getRoomOptions(buildingId)
      .then(() => {
        roomsStatus.value = RoomLoadingStatus.Loaded;
        roomOptions.value = getAllRoomOptions();
        update();
      })
      .catch(() => {
        roomsStatus.value = RoomLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    roomOptions.value = getAllRoomOptions();
  } else {
    roomOptions.value = getAllRoomOptions().filter((v) => {
      return v.name && v.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};

/**********************
 * Renter select
 **********************/
const renterOptions = ref<Array<{
  lastName: string | undefined;
  firstName: string | undefined;
  id: string | number | undefined;
}> | undefined>(undefined);

const getAllRenterOptions = () => {
  return useTenantStore().renterOptions.map((v) => {
    return {
      id: v.id || '',
      lastName: v.lastName || '',
      firstName: v.firstName || '',
    };
  });
};

enum RenterLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const rentersStatus = ref<RenterLoadingStatus>(RenterLoadingStatus.BeforeLoad);

const renterFilterFn = (val: string, update: () => void) => {
  if (
    rentersStatus.value === RenterLoadingStatus.BeforeLoad
    || rentersStatus.value === RenterLoadingStatus.Aborted
  ) {
    rentersStatus.value = RenterLoadingStatus.Loading;
    useTenantStore()
      .getRenterOptions()
      .then(() => {
        rentersStatus.value = RenterLoadingStatus.Loaded;
        renterOptions.value = getAllRenterOptions();
        update();
      })
      .catch(() => {
        rentersStatus.value = RenterLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    renterOptions.value = getAllRenterOptions();
  } else {
    renterOptions.value = getAllRenterOptions().filter((v) => {
      return v.lastName && v.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1
        || v.firstName && v.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1
        || v.lastName && v.firstName && (v.lastName + v.firstName).toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};

/**********************
 * Owner select
 **********************/
const ownerOptions = ref<Array<{
  lastName: string | undefined;
  firstName: string | undefined;
  id: string | number | undefined;
}> | undefined>(undefined);

const getAllOwnerOptions = () => {
  return useOwnerStore().ownerOptions.map((v) => {
    return {
      id: v.id || '',
      lastName: v.lastName || '',
      firstName: v.firstName || '',
    };
  });
};

enum OwnerLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const ownersStatus = ref<OwnerLoadingStatus>(OwnerLoadingStatus.BeforeLoad);

const ownerFilterFn = (val: string, update: () => void) => {
  if (
    ownersStatus.value === OwnerLoadingStatus.BeforeLoad
    || ownersStatus.value === OwnerLoadingStatus.Aborted
  ) {
    ownersStatus.value = OwnerLoadingStatus.Loading;
    useOwnerStore()
      .getOwnerOptions()
      .then(() => {
        ownersStatus.value = OwnerLoadingStatus.Loaded;
        ownerOptions.value = getAllOwnerOptions();
        update();
      })
      .catch(() => {
        ownersStatus.value = OwnerLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    ownerOptions.value = getAllOwnerOptions();
  } else {
    ownerOptions.value = getAllOwnerOptions().filter((v) => {
      return v.lastName && v.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1
        || v.firstName && v.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1
        || v.lastName && v.firstName && (v.lastName + v.firstName).toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  id: string().nullable().notRequired().label('管理番号'),
  title: string().required().label('件名'),
  category: string().required().label('種類'),
  description: string().nullable().notRequired().label('説明'),
  paymentMethod: string().required().label('支払方法'),
  otherPaymentDescription: string().nullable().notRequired().label('その他支払方法'),
  amount: string().required().label('金額'),
  date: string().required().label('日付'),
  building: object({
    id: string().nullable().notRequired().label('物件ID'),
    name: string().nullable().notRequired().label('物件名'),
  }).nullable().notRequired().label('物件'),
  room: object({
    id: string().nullable().notRequired().label('部屋ID'),
    name: string().nullable().notRequired().label('部屋名'),
  }).nullable().notRequired().label('部屋'),
  tenant: object({
    id: string().nullable().notRequired().label('入居者ID'),
    name: string().nullable().notRequired().label('入居者名'),
  }).nullable().notRequired().label('入居者'),
  owner: object({
    id: string().nullable().notRequired().label('大家さんID'),
    name: string().nullable().notRequired().label('大家さん名'),
  }).nullable().notRequired().label('大家さん'),
  note: string().nullable().notRequired().label('備考'),
}));

const initialValues: any = computed( () => {
  return income.value;
});
const { validate, values, setFieldValue } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
});
</script>

<template>
  <div class="row justify-between">
    <div class="text-h6">
      収入基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
    </div>
    <q-badge
      v-if="!newIncome"
      :color="describeIncomeConfirmStatus(income.confirmStatus).color"
      :label="describeIncomeConfirmStatus(income.confirmStatus).description"
    />
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newIncome">
      <q-item-section>
        <q-input v-model="income.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <Field name="title" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="件名"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="category" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="種類"
            :readonly="readonly"
            emit-value
            map-options
            :options="categoryOptions"
            clearable
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="description" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="説明"
            autogrow
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="paymentMethod" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-item-section>
            <q-select
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="支払方法"
              :readonly="readonly"
              emit-value
              map-options
              :options="paymentMethodOptions"
              clearable
            >
            </q-select>
          </q-item-section>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="otherPaymentDescription" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="その他支払方法"
            :readonly="readonly"
            :disable="values.paymentMethod !== 'other'"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="amount" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="金額"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="date" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="日付"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="building" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="(event) => handleBuildingChange(event, handleChange)"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="物件"
            :options="buildingOptions"
            option-label="name"
            option-value="id"
            @filter="buildingFilterFn"
            :readonly="readonly"
            use-input
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="room" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="部屋"
            :options="roomOptions"
            option-label="name"
            option-value="id"
            @filter="roomFilterFn"
            :readonly="readonly"
            use-input
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="owner" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="オーナー"
            :options="ownerOptions"
            :option-label="item => item.lastName + ' ' + item.firstName"
            option-value="id"
            @filter="ownerFilterFn"
            :readonly="readonly"
            use-input
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="tenant" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="入居者"
            :options="renterOptions"
            :option-label="item => item.lastName + ' ' + item.firstName"
            option-value="id"
            @filter="renterFilterFn"
            :readonly="readonly"
            use-input
          >
          </q-select>
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
