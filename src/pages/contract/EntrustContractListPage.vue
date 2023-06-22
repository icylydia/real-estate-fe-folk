<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { QTableProps } from 'quasar';
import { useRouter } from 'vue-router';
import { EntrustContractBase, EntrustContractInResponse } from 'src/api';

const loading = ref(false);

const { entrustContractList: contracts } = storeToRefs(useContractStore());
const {
  getEntrustContractList,
  reset: resetContractStore,
  statusToChipProps,
  benefitTypeToChipProps,
} = useContractStore();

const columns: QTableProps['columns'] = [
  {
    label: '物件名',
    field: 'buildingName',
    name: 'buildingName',
    sortable: false,
    align: 'left',
  },
  {
    label: 'オーナー',
    field: 'owner',
    name: 'owner',
    sortable: false,
    align: 'left',
  },
  {
    label: '報酬の種類',
    field: 'benefitType',
    name: 'benefitType',
    sortable: false,
    align: 'left',
  },
  {
    label: '報酬の金額',
    field: 'benefit',
    name: 'benefit',
    sortable: false,
    align: 'right',
  },
  {
    label: '契約状況',
    field: 'status',
    name: 'status',
    sortable: false,
    align: 'left',
  },
  {
    label: '操作',
    field: 'actions',
    name: 'actions',
    sortable: false,
    align: 'right',
  },
];

const loadContracts = async () => {
  loading.value = true;
  try {
    resetContractStore();
    await getEntrustContractList();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadContracts();
});

const searchText = ref('');
const search = async () => {
  await loadContracts()
};
const includeArchive = ref(false);

const router = useRouter();
const toNewContract = async () => {
  try {
    await router.push({
      name: 'contract-create',
    });
  } catch (e) {
    console.error(e);
  }
};

const toContractDetail = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'contract-detail',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const toContractEdit = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'contract-edit',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const archiveContract = async (id?: string) => {
  console.log(id);
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <q-table
          flat
          title="管理委託契約一覧"
          :rows="contracts"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template #top-right>
            <q-checkbox
              v-model="includeArchive"
              label="アーカイブを含む"
              class="q-mr-sm"
            />
            <q-input
              outlined
              dense
              placeholder="検索"
              class="q-mr-sm"
              v-model="searchText"
              @keydown.enter.prevent="search"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              color="primary"
              icon="sym_r_add"
              label="新規契約"
              @click="toNewContract"
            />
          </template>
          <template #[`body-cell-buildingName`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'building-detail',
                  params: { id: row.building!.id },
                }).href"
              >
                {{ row.building.name }}
              </a>
            </q-td>
          </template>
          <template #[`body-cell-owner`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'tenant-detail',
                  params: { id: row.owner!.id },
                }).href"
              >
                {{ row.owner.lastName }} {{ row.owner.firstName }}
              </a>
            </q-td>
          </template>
          <template #[`body-cell-benefitType`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <q-chip
                v-bind="benefitTypeToChipProps(row.benefitType)"
              />
            </q-td>
          </template>
          <template #[`body-cell-benefit`]="{ row }: { row: EntrustContractInResponse }">
            <q-td class="text-right">
              <template v-if="row.benefitType == EntrustContractBase.BenefitTypeEnum.Fixed">
                {{ $filters.jpyCurrency(row.benefitAmount) }}
              </template>
              <template v-else-if="row.benefitType == EntrustContractBase.BenefitTypeEnum.Percentage">
                {{ $filters.percentage(row.benefitPercentage) }}
              </template>
            </q-td>
          </template>
          <template #[`body-cell-status`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <q-chip
                v-bind="statusToChipProps(row.status)"
              />
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key }">
            <q-td class="text-right">
              <q-btn icon="sym_r_more_horiz" flat>
                <q-menu>
                  <q-list>
                    <q-item dense clickable @click="toContractDetail(key)">
                      <q-item-section>
                        <q-item-label>詳細</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item dense clickable @click="toContractEdit(key)">
                      <q-item-section>
                        <q-item-label>編集</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item dense clickable @click="archiveContract(key)">
                      <q-item-section>
                        <q-item-label>削除</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
