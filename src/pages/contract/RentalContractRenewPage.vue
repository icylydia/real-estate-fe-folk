<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue';
import { QStepper } from 'quasar';
import type { ComponentExposed } from 'vue-component-type-helpers';
import { useRoute, useRouter } from 'vue-router';
import { useContractStore } from 'stores/contract-store';
import useErrorHandler from 'components/app/useErrorHandler';
import { storeToRefs } from 'pinia';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { Field, useForm } from 'vee-validate';
import type { RentalContractBase } from 'src/api';
import moment from 'moment';

const step = ref(1);
const loading = ref(false);
const { toastHandler } = useErrorHandler();
const stepper = useTemplateRef<ComponentExposed<typeof QStepper>>('stepper')
const { rentalContractFormModel: contract } = storeToRefs(useContractStore());
const { statusToChipProps } = useContractStore();
const router = useRouter()

const startDate = computed<string>(() => {
  return moment(contract.value.endDate).add(1, 'days').format('YYYY-MM-DD');
});
const endDate = ref<string>('');

const contractId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    useContractStore().resetRentalContractFormModel();
    await useContractStore().getRentalContract(contractId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    await toastHandler(error);
    loading.value = false;
  }
});

const validationSchema = toTypedSchema(object({
  endDate: string().date().laterThan(contract.value?.endDate ?? '').required().label('契約終了日'),
}));

const initialValues = {
  endDate: endDate.value,
};

const { validate, setValues } = useForm({
  validationSchema,
  initialValues,
});

const onClickNext = async () => {
  if (step.value == 1) {
    // validate and go to next step
    const validated = await validate()
    if (validated.valid) {
      endDate.value = validated.values?.endDate ?? '';
      newSequence.value = {
        ...contract.value,
        startDate: startDate.value,
        endDate: endDate.value,
      }
      stepper.value?.next()
    }
  } else if (step.value == 2) {
    // submit
    try {
      const payload = {
        endDate: endDate.value,
      }
      const newContract = await useContractStore().renewRentalContract(contractId.value, payload);
      if (newContract) {
        await router.push({
          name: 'rental-contract-detail',
          params: {
            id: newContract.id,
          },
        })
      }
    } catch (error) {
      await toastHandler(error);
    }
  }
}

const onClickPrev = async () => {
  if (step.value == 2) {
    setValues({
      endDate: endDate.value,
    })
    stepper.value?.previous()
  }
}

type NewSequence = RentalContractBase
const newSequence = ref<NewSequence>({});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-stepper
        v-model="step"
        ref="stepper"
        animated
        active-color="primary"
        alternative-labels
      >
        <q-step
          :name="1"
          title="契約継続内容を入力"
          icon="edit"
          active-icon="edit"
          done-icon="done"
          :done="step > 1"
        >
          <q-list bordered padding v-if="!loading">
            <q-item-label header>基本情報</q-item-label>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>物件</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ contract.building?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>区画</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ contract.room?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>入居者</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ contract.tenant?.lastName }} {{ contract.tenant?.firstName }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item-label header>継続履歴</q-item-label>
            <q-item clickable v-ripple v-for="(sequence, index) in contract.sequence" :key="index">
              <q-item-section>
                {{ sequence.startDate }} ～ {{ sequence.endDate }}
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-chip v-bind="statusToChipProps(sequence.status)" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item-label header>継続情報</q-item-label>
            <q-item>
              <q-item-section>
                <q-input
                  label="契約開始日"
                  :model-value="startDate"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <Field name="endDate" v-slot="{errorMessage, value, field}">
                  <q-input
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                    label="契約終了日"
                  />
                </Field>
              </q-item-section>
            </q-item>
          </q-list>
        </q-step>

        <q-step
          :name="2"
          title="契約継続内容を確認"
          icon="sym_r_playlist_add_check"
          active-icon="sym_r_playlist_add_check"
          done-icon="done"
          :done="step > 2"
        >
          <q-list bordered padding v-if="!loading">
            <q-item-label header>基本情報</q-item-label>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>物件</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ contract.building?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>区画</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ contract.room?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>入居者</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  {{ contract.tenant?.lastName }} {{ contract.tenant?.firstName }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item-label header>継続履歴</q-item-label>
            <q-item clickable v-ripple v-for="(sequence, index) in contract.sequence" :key="index">
              <q-item-section>
                {{ sequence.startDate }} ～ {{ sequence.endDate }}
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-chip v-bind="statusToChipProps(sequence.status)" />
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>{{ newSequence.startDate }} ～ {{ newSequence.endDate }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>
                  <q-chip color="green" label="新規" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced />
            <q-item-label header>継続情報</q-item-label>
            <q-item>
              <q-item-section>
                <q-input
                  label="契約開始日"
                  :model-value="startDate"
                  readonly
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  label="契約終了日"
                  :model-value="endDate"
                  readonly
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-step>

        <template #navigation>
          <q-stepper-navigation>
            <q-btn @click="onClickNext" color="primary" :label="step === 2 ? '完成' : '次へ'" />
            <q-btn v-if="step > 1" flat color="primary" @click="onClickPrev" label="戻る" class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-card>
  </q-page>
</template>
