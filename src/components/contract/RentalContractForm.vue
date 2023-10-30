<script setup lang="ts">
import { useContractStore } from 'stores/contract-store';
import { storeToRefs } from 'pinia';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { computed, ref } from 'vue';
import { Field, useForm } from 'vee-validate';
import { useBuildingStore } from 'stores/building-store';

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
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  title: string().required().label('タイトル'),
}));

const initialValues: any = computed( () => {
  if (props.newContract) {
    return {};
  }
  return contract.value;
});

const { validate, values } = useForm({
  validationSchema,
  initialValues,
});

const handleBuildingChange = (e: any, callback: (e: any) => void) => {
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
  </q-list>
</template>
