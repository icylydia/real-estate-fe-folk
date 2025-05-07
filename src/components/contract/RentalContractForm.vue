<script setup lang="ts">
import { useContractStore } from 'stores/contract-store';
import { storeToRefs } from 'pinia';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, boolean } from 'yup';
import { computed, ref } from 'vue';
import { Field, useForm } from 'vee-validate';
import { useBuildingStore } from 'stores/building-store';
import { useTenantStore } from 'stores/tenant-store';
import { useRentalContract } from 'src/utils/rental-contract';
import QInputDatePicker from 'components/extension/QInputDatePicker.vue';

const { rentalContractFormModel: contract } = storeToRefs(useContractStore());
const { describeStatus } = useRentalContract();

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newContract: {
    type: Boolean,
    default: false,
  },
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
        buildingsStatus.value = BuildingLoadingStatus.Loaded;
        buildingOptions.value = getAllBuildingOptions();
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
};

/**********************
 * Renter select
 **********************/
type RenterOption = {
  lastName: string | undefined;
  firstName: string | undefined;
  id: string | number | undefined;
};
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
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  building: object({
    id: string().required().label('物件'),
  }).required().label('物件'),
  room: object({
    id: string().required().label('区画'),
  }).required().label('区画'),
  tenant: object({
    id: string().required().label('入居者'),
  }).required().label('入居者'),
  startDate: string()
    .date()
    .transform((value) => value ?? null)
    .required()
    .label('契約開始日'),
  endDate: string()
    .date()
    .transform((value) => value ?? null)
    .required()
    .label('契約終了日'),
  terminationNoticeDate: string()
    .date()
    .transform((value) => value ?? null)
    .nullable()
    .label('解約日'),
  promptRemind: boolean().required().label('契約終了前に通知するか'),
  promptRemindMonths: string().when('promptRemind', {
      is: true,
      then: (schema) => schema.required().label('契約終了日の何ヶ月前に通知するか'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  description: string().notRequired().nullable().label('備考'),
}));

const initialValues: any = computed( () => {
  return contract.value;
});

const { validate, values, setFieldValue } = useForm({
  validationSchema,
  initialValues,
});

const handleBuildingChange = (e: any, callback: (e: any) => void) => {
  setFieldValue('room', null, false);
  useBuildingStore().resetRoomOptions();
  roomsStatus.value = RoomLoadingStatus.BeforeLoad
  callback(e);
};

defineExpose({
  validate,
})
</script>

<template>
  <div class="row justify-between">
    <div class="text-h6" v-if="!newContract">
      賃貸借契約基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
    </div>
    <q-badge
      v-if="!newContract"
      :color="describeStatus(contract.status).color"
      :label="describeStatus(contract.status).description"
    />
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newContract">
      <q-item-section>
        <q-input v-model="contract.id" label="管理番号" readonly />
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
    <Field name="tenant" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
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
    <Field name="startDate" #="{errorMessage, value, field}">
      <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-date-picker
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約開始日"
            :readonly="readonly || !newContract"
            hint="フォーマット: 2021-01-01"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="endDate" #="{errorMessage, value, field}">
      <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-date-picker
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約終了日"
            :readonly="readonly"
            hint="契約の効力が終了する日付です"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="terminationNoticeDate" #="{errorMessage, value, field}">
      <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-date-picker
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="解約日"
            :readonly="readonly"
            hint="契約を解約する旨を通知または合意した日付です"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="promptRemind" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-toggle
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約終了前に通知するか"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="promptRemindMonths" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約終了日の何ヶ月前に通知するか"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="description" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
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
