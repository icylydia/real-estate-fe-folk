<script setup lang="ts">
import QInputCurrency from 'components/extension/QInputCurrency.vue';
import { storeToRefs } from 'pinia';
import { useExpenseStore } from 'stores/expense-store';
import { usePayment } from 'src/utils/payment';
import { toTypedSchema } from '@vee-validate/yup';
import { Field, useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { object, string } from 'yup';
import { useOwnerStore } from 'stores/owner-store';
import { useTenantStore } from 'stores/tenant-store';
import { useBuildingStore } from 'stores/building-store';

const {
  expenseCategoryOptions: categoryOptions,
  paymentMethodOptions,
  describeIncomeConfirmStatus: describeConfirmStatus,
} = usePayment();
const { formModel: expense } = storeToRefs(useExpenseStore());

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newExpense: {
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
const onFilterBuilding = (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (
    buildingsStatus.value === BuildingLoadingStatus.BeforeLoad
    || buildingsStatus.value === BuildingLoadingStatus.Aborted
  ) {
    buildingsStatus.value = BuildingLoadingStatus.Loading;
    useBuildingStore()
      .getBuildingOptions()
      .then(() => {
        buildingOptions.value = getAllBuildingOptions();
        buildingsStatus.value = BuildingLoadingStatus.Loaded;
        doneFn(() => {});
      })
      .catch(() => {
        buildingsStatus.value = BuildingLoadingStatus.Aborted;
        doneFn(() => {});
      });
  }
  if (inputValue === '') {
    doneFn(() => {
      buildingOptions.value = getAllBuildingOptions();
    });
  } else {
    doneFn(() => {
      buildingOptions.value = getAllBuildingOptions().filter((v) => {
        return v.name && v.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
      });
    });
  }
}

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
const onFilterRoom = (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  const buildingId = values.building?.id;
  if (!buildingId) {
    useBuildingStore().resetRoomOptions();
    doneFn(() => {});
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
        roomOptions.value = getAllRoomOptions();
        roomsStatus.value = RoomLoadingStatus.Loaded;
        doneFn(() => {});
      })
      .catch(() => {
        roomsStatus.value = RoomLoadingStatus.Aborted;
        doneFn(() => {});
      });
  }
  if (inputValue === '') {
    doneFn(() => {
      roomOptions.value = getAllRoomOptions();
    });
  } else {
    doneFn(() => {
      roomOptions.value = getAllRoomOptions().filter((v) => {
        return v.name && v.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
      });
    });
  }
}

/**********************
 * Renter select
 **********************/
type RenterOption = {
  id: number | string | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
}
const renterOptions = ref<Array<RenterOption> | undefined>(undefined);

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
const onFilterRenter = (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (
    rentersStatus.value === RenterLoadingStatus.BeforeLoad
    || rentersStatus.value === RenterLoadingStatus.Aborted
  ) {
    rentersStatus.value = RenterLoadingStatus.Loading;
    useTenantStore()
      .getRenterOptions()
      .then(() => {
        renterOptions.value = getAllRenterOptions();
        rentersStatus.value = RenterLoadingStatus.Loaded;
        doneFn(() => {});
      })
      .catch(() => {
        rentersStatus.value = RenterLoadingStatus.Aborted;
        doneFn(() => {});
      });
  }
  if (inputValue === '') {
    doneFn(() => {
      renterOptions.value = getAllRenterOptions();
    });
  } else {
    doneFn(() => {
      renterOptions.value = getAllRenterOptions().filter((v) => {
        return v.lastName && v.lastName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          || v.firstName && v.firstName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          || v.lastName && v.firstName && (v.lastName + v.firstName).toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
      });
    });
  }
}

/**********************
 * Owner select
 **********************/
type OwnerOption = {
  id: number | string | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
}
const ownerOptions = ref<Array<OwnerOption> | undefined>(undefined);

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
const onFilterOwner = (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (
    ownersStatus.value === OwnerLoadingStatus.BeforeLoad
    || ownersStatus.value === OwnerLoadingStatus.Aborted
  ) {
    ownersStatus.value = OwnerLoadingStatus.Loading;
    useOwnerStore()
      .getOwnerOptions()
      .then(() => {
        ownerOptions.value = getAllOwnerOptions();
        ownersStatus.value = OwnerLoadingStatus.Loaded;
        doneFn(() => {});
      })
      .catch(() => {
        ownersStatus.value = OwnerLoadingStatus.Aborted;
        doneFn(() => {});
      });
  }
  if (inputValue === '') {
    doneFn(() => {
      ownerOptions.value = getAllOwnerOptions();
    });
  } else {
    doneFn(() => {
      ownerOptions.value = getAllOwnerOptions().filter((v) => {
        return v.lastName && v.lastName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          || v.firstName && v.firstName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          || v.lastName && v.firstName && (v.lastName + v.firstName).toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
      });
    });
  }
}

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  id: string().nullable().notRequired().label('管理番号'),
  building: object({
    id: string().nullable().notRequired().label('物件ID'),
    name: string().nullable().notRequired().label('物件名'),
  }).nullable().notRequired().label('物件'),
  room: object({
    id: string().nullable().notRequired().label('区画ID'),
    name: string().nullable().notRequired().label('区画名'),
  }).nullable().notRequired().label('区画'),
  tenant: object({
    id: string().nullable().notRequired().label('入居者ID'),
    name: string().nullable().notRequired().label('入居者名'),
  }).nullable().notRequired().label('入居者'),
  owner: object({
    id: string().nullable().notRequired().label('オーナーID'),
    name: string().nullable().notRequired().label('オーナー名'),
  }).nullable().notRequired().label('オーナー'),
  category: string().required().label('種類'),
  targetYear: string()
    .required()
    .matches(/^[0-9]{4}$/, '対象年は4桁の数字で入力してください。')
    .label('対象年'),
  targetMonth: string()
    .required()
    .label('対象月'),
  amount: string().required().label('金額'),
  tax: string().nullable().notRequired().label('税'),
  date: string().date().required().label('日付'),
  paymentMethod: string().required().label('支払方法'),
  otherPaymentDescription: string().nullable().notRequired().label('支払方法'),
  note: string().nullable().notRequired().label('備考'),
  summary: string().nullable().notRequired().label('摘要'),
}));

const initialValues: any = computed( () => {
  return expense.value;
});

const { validate, values, setFieldValue } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
})
</script>

<template>
  <div class="row justify-between" v-if="!newExpense">
    <div class="text-h6">
      支出基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
    </div>
    <q-badge
      :color="describeConfirmStatus(expense.confirmStatus).color"
      :label="describeConfirmStatus(expense.confirmStatus).description"
    />
  </div>

  <q-list class="row">
    <q-item class="col-12" v-if="!newExpense">
      <q-item-section>
        <q-input v-model="expense.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
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
            @filter="onFilterBuilding"
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
            label="区画"
            :options="roomOptions"
            option-label="name"
            option-value="id"
            @filter="onFilterRoom"
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
            :option-label="(item: OwnerOption) => item.lastName + ' ' + item.firstName"
            option-value="id"
            @filter="onFilterOwner"
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
            :option-label="(item: RenterOption) => item.lastName + ' ' + item.firstName"
            option-value="id"
            @filter="onFilterRenter"
            :readonly="readonly"
            use-input
          >
          </q-select>
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
    <Field name="targetYear" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="対象年"
            :readonly="readonly"
            hint="フォーマット: 2021"
          >
          </q-input>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="targetMonth" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="対象月"
            :readonly="readonly"
            :options="[1,2,3,4,5,6,7,8,9,10,11,12].map((v) => ({ label: `${v}月`, value: v }))"
            emit-value
            map-options
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="amount" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
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
    <Field name="tax" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="税"
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
            hint="フォーマット: 2021-01-01"
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
    <Field name="summary" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="摘要"
            autogrow
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
</template>
