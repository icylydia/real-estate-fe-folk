<script setup lang="ts">
import { useContractStore } from 'stores/contract-store';
import { storeToRefs } from 'pinia';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, date, boolean } from 'yup';
import { computed, ref } from 'vue';
import { Field, useForm } from 'vee-validate';
import { useBuildingStore } from 'stores/building-store';
import { useTenantStore } from 'stores/tenant-store';

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newContract: {
    type: Boolean,
    default: false,
  },
});

const { rentalContractFormModel: contract } = storeToRefs(useContractStore());

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
  name: string | undefined;
  id: string | number | undefined;
}> | undefined>(undefined);

const getAllRenterOptions = () => {
  return useTenantStore().renterOptions.map((v) => {
    return {
      name: v.lastName + ' ' + v.firstName,
      id: v.id || '',
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
      return v.name && v.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  title: string().required().label('タイトル'),
  description: string().notRequired().nullable().label('説明'),
  building: object({
    id: string().required().label('物件'),
  }).required().label('物件'),
  room: object({
    id: string().required().label('部屋'),
  }).required().label('部屋'),
  tenant: object({
    id: string().required().label('入居者'),
  }).required().label('入居者'),
  startDate: date().required().label('契約開始日'),
  endDate: date().required().label('契約終了日'),
  promptRemind: boolean().required().label('契約終了前に通知するか'),
  promptRemindMonths: string().when('promptRemind', {
      is: true,
      then: (schema) => schema.required().label('契約終了日の何ヶ月前に通知するか'),
      otherwise: (schema) => schema.notRequired().nullable(),
    })
}));

const initialValues: any = computed( () => {
  if (props.newContract) {
    useContractStore().resetRentalContractFormModel();
    return contract.value;
  }
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
  <div class="text-h6" v-if="!newContract">
    賃貸契約基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newContract">
      <q-item-section>
        <q-input v-model="contract.id" label="オーナーID" readonly />
      </q-item-section>
    </q-item>
    <Field name="title" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="タイトル"
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
            label="説明"
            autogrow
            clearable
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
            option-label="name"
            option-value="id"
            @filter="renterFilterFn"
            :readonly="readonly"
            use-input
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="startDate" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約開始日"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="endDate" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約終了日"
            :readonly="readonly"
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
  </q-list>
</template>
