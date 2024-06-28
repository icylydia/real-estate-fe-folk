<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { computed, ref } from 'vue';
import { Field, useForm } from 'vee-validate';
import { useBuildingStore } from 'stores/building-store';
import { useOwnerStore } from 'stores/owner-store';
import { useEntrustContract } from 'src/utils/entrust-contract';
import { ContractBase } from 'src/api';
import moment from 'moment/moment';

const { describeStatus } = useEntrustContract();
const { entrustContractFormModel: contract } = storeToRefs(useContractStore());

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
      name: v.name ?? '',
      id: v.id ?? '',
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
      id: v.id ??'',
      lastName: v.lastName ?? '',
      firstName: v.firstName ?? '',
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
};

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  id: string().nullable().notRequired().label('管理番号'),
  building: object({
    id: string().required().label('物件ID'),
  }).required().label('物件'),
  owner: object({
    id: string().required().label('オーナーID'),
  }).required().label('オーナー'),
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
  remittanceType: string().required().label('振込区分'),
  japanBank: object({
    bankName: string().nullable().notRequired().label('銀行名'),
    branchName: string().nullable().notRequired().label('支店名'),
    postBankBranchCode: string().nullable().notRequired().label('記号'),
    accountType: string().nullable().notRequired().label('口座種別'),
    accountNumber: string().nullable().notRequired().label('口座番号'),
    accountHolder: string().nullable().notRequired().label('口座名義'),
  }).nullable().notRequired().label('日本銀行'),
  overseasBank: object({
    country: string().nullable().notRequired().label('国名・所在地'),
    bankCode: string().nullable().notRequired().label('銀行コード'),
    swiftCode: string().nullable().notRequired().label('SWIFTコード'),
    bankName: string().nullable().notRequired().label('銀行名'),
    ibanCode: string().nullable().notRequired().label('口座番号/IBANコード'),
    currency: string().nullable().notRequired().label('通貨'),
    accountHolder: string().nullable().notRequired().label('口座名義'),
    accountHolderNickname: string().nullable().notRequired().label('登録名'),
    postCode: string().nullable().notRequired().label('郵便番号'),
    address: string().nullable().notRequired().label('住所'),
    telephone: string().nullable().notRequired().label('電話番号'),
    email: string().nullable().notRequired().label('メールアドレス'),
  }).nullable().notRequired().label('海外銀行'),
  description: string().nullable().notRequired().label('備考'),
}));

const initialValues: any = computed( () => {
  return contract.value;
});

const { validate, values } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
});
</script>

<template>
  <div class="row justify-between">
    <div class="text-h6" v-if="!newContract">
      管理委託契約基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
    </div>
    <div class="text-h6" v-if="!newContract">
      <template v-if="contract.status == ContractBase.StatusEnum.Active && contract.endDate && moment(contract.endDate!) < moment()">
        <q-icon
          name="warning"
          size="1rem"
          class="q-mr-sm"
          color="warning"
        >
          <q-tooltip>
            契約期間が終了しています
          </q-tooltip>
        </q-icon>
      </template>
      <q-badge
        class="full-height"
        :color="describeStatus(contract.status).color"
        :label="describeStatus(contract.status).description"
      />
    </div>
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
            @update:model-value="handleChange"
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
    <Field name="startDate" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約開始日"
            :readonly="readonly || !newContract"
            hint="フォーマット: 2021-01-01"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="endDate" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="契約終了日"
            :readonly="readonly"
            hint="フォーマット: 2021-01-01"
          />
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
            label="備考"
            autogrow
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="remittanceType" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <div class="q-gutter-sm">
            <q-radio
              :model-value="value"
              @update:model-value="v => handleChange(v)"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="日本銀行"
              val="japan"
              :disable="readonly"
            />
            <q-radio
              :model-value="value"
              @update:model-value="v => handleChange(v)"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="海外銀行"
              val="overseas"
              :disable="readonly"
            />
          </div>
        </q-item-section>
      </q-item>
    </Field>
    <template v-if="values.remittanceType == 'japan'">
      <Field name="japanBank.bankName" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="銀行名"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="japanBank.branchName" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              label="支店名"
              :error-message="errorMessage"
              :error="!!errorMessage"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="japanBank.postBankBranchCode" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              label="記号"
              :error-message="errorMessage"
              :error="!!errorMessage"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="japanBank.accountType" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <div class="q-gutter-sm">
              <q-radio
                :model-value="value"
                @update:model-value="v => handleChange(v)"
                :error-message="errorMessage"
                :error="!!errorMessage"
                label="普通"
                val="savings"
                :disable="readonly"
              />
              <q-radio
                :model-value="value"
                @update:model-value="v => handleChange(v)"
                :error-message="errorMessage"
                :error="!!errorMessage"
                label="当座"
                val="current"
                :disable="readonly"
              />
            </div>
          </q-item-section>
        </q-item>
      </Field>
      <Field name="japanBank.accountNumber" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              label="口座番号"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="japanBank.accountHolder" #="{errorMessage, value, handleChange}">
        <q-item class="col-12">
          <q-item-section>
            <q-input
              :model-value="value"
              label="口座名義"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
    </template>
    <template v-if="values.remittanceType == 'overseas'">
      <Field name="overseasBank.country" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="国名・所在地"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.bankCode" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="銀行コード"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.swiftCode" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="SWIFTコード"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.bankName" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="銀行名"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.ibanCode" #="{errorMessage, value, handleChange}">
        <q-item class="col-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="口座番号/IBANコード"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.currency" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="通貨"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.accountHolder" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="口座名義"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.accountHolderNickname" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="登録名"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.postCode" #="{errorMessage, value, handleChange}">
        <q-item class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="郵便番号"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.address" #="{errorMessage, value, handleChange}">
        <q-item class="col-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="住所"
              :readonly="readonly"
              autogrow
              clearable
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.telephone" #="{errorMessage, value, handleChange}">
        <q-item class="col-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="電話番号"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
      <Field name="overseasBank.email" #="{errorMessage, value, handleChange}">
        <q-item class="col-12">
          <q-item-section>
            <q-input
              :model-value="value"
              @update:model-value="handleChange"
              :error-message="errorMessage"
              :error="!!errorMessage"
              label="メールアドレス"
              :readonly="readonly"
            />
          </q-item-section>
        </q-item>
      </Field>
    </template>
  </q-list>
</template>
