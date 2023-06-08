<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { QTableProps } from 'quasar';
import { useExpenseStore } from 'stores/expense-store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ExpenseInResponse, IncomeInResponse } from 'src/api';
import { usePayment } from 'src/utils/payment';

const loading = ref(false);

const columns: QTableProps['columns'] = [
  {
    label: '件名',
    field: 'title',
    name: 'title',
    sortable: false,
    align: 'left',
  },
  {
    label: '類別',
    field: 'category',
    name: 'category',
    sortable: false,
    align: 'left',
  },
  {
    label: '金額',
    field: 'amount',
    name: 'amount',
    sortable: false,
    align: 'right',
  },
  {
    label: '日付',
    field: 'date',
    name: 'date',
    sortable: false,
    align: 'right',
  },
  {
    label: '操作',
    field: 'actions',
    name: 'actions',
    sortable: false,
    align: 'right',
  },
];

const { getExpenseList } = useExpenseStore();
const { list: rows, searchParams } = storeToRefs(useExpenseStore());

onMounted(async () => {
  try {
    loading.value = true;
    await getExpenseList({});
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const search = async () => {
  try {
    loading.value = true;
    await getExpenseList(searchParams.value);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const router = useRouter();

const toCreate = async () => {
  try {
    await router.push({
      name: 'expense-create',
    });
  } catch (e) {
    console.error(e);
  }
};

const toDetail = async (id: number) => {
  try {
    await router.push({
      name: 'expense-detail',
      params: {
        id: id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const toEdit = async (id: number) => {
  try {
    await router.push({
      name: 'expense-edit',
      params: {
        id: id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const remove = (id: number) => {
  console.log(id);
};

const { describeCategory: describeExpenseCategory } = usePayment();
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card bordered>
          <q-card-section class="text-h6">
            検索条件
            <q-input
              v-model="searchParams.year"
              label="年"
            />
            <q-input
              v-model="searchParams.month"
              label="月"
            />
            <q-input
              v-model="searchParams.query"
              label="その他"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn
              class="q-mr-sm full-width"
              color="primary"
              label="検索"
              icon="sym_r_location_on"
              @click="search()"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-8">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              :loading="loading"
              :grid="$q.screen.lt.md"
              :columns="columns"
              :rows="rows"
              row-key="id"
              :pagination="{
                rowsPerPage: 15,
              }"
            >
              <template #top-left>
                <div class="text-h6">支出一覧</div>
              </template>
              <template #top-right>
                <q-btn label="新規" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="toCreate()" />
              </template>
              <template #[`body-cell-category`]="{ row }: { row: IncomeInResponse }">
                <q-td>
                  {{ describeExpenseCategory(row.category) }}
                </q-td>
              </template>
              <template #[`body-cell-amount`]="{ row }: { row: ExpenseInResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.amount) }}
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="toEdit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(key)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
