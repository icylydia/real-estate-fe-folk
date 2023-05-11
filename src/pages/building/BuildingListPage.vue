<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card bordered>
          <q-card-section class="text-h6">
            検索条件
            <q-select
              v-model="searchParams.grossYield"
              emit-value
              map-options
              label="表面利回り"
              :options="grossYieldOptions"
              clearable
            />
            <q-select
              v-model="searchParams.priceLowerBound"
              emit-value
              map-options
              label="価格下限"
              :options="priceLowerBoundOptions"
              clearable
            />
            <q-select
              v-model="searchParams.priceUpperBound"
              emit-value
              map-options
              label="価格上限"
              :options="priceUpperBoundOptions"
              clearable
            />
            <q-input
              v-model="searchParams.other"
              label="その他"
              placeholder="地名、駅、物件名など"
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
                <div class="text-h6">物件一覧</div>
              </template>
              <template #top-right>
                <q-btn label="新規" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="create()" />
              </template>
              <template #[`body-cell-price`]="{ row }: { row: BuildingInResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.price) }}
                </q-td>
              </template>
              <template #[`body-cell-address`]="{ row }: { row: BuildingInResponse }">
                <q-td>
                  {{ row.address.prefecture }}{{ row.address.detailAddress1 }}{{ row.address.detailAddress2 }}
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="detail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="edit(key)" />
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

<script lang="ts" setup>
import { BuildingInResponse } from 'src/api';

const grossYieldOptions = [
  {
    label: '4%以上',
    value: '0.04',
  },
  {
    label: '5%以上',
    value: '0.05',
  },
  {
    label: '6%以上',
    value: '0.06',
  },
  {
    label: '7%以上',
    value: '0.07',
  },
  {
    label: '8%以上',
    value: '0.08',
  },
  {
    label: '9%以上',
    value: '0.09',
  },
  {
    label: '10%以上',
    value: '0.1',
  },
]

const priceLowerBoundOptions = [
  {
    label: '1000万円以上',
    value: 10_000_000,
  },
  {
    label: '5000万円以上',
    value: 50_000_000,
  },
  {
    label: '8000万円以上',
    value: 80_000_000,
  },
  {
    label: '1億円以上',
    value: 100_000_000,
  },
  {
    label: '2億円以上',
    value: 200_000_000,
  },
  {
    label: '3億円以上',
    value: 300_000_000,
  },
  {
    label: '5億円以上',
    value: 500_000_000,
  },
]

const priceUpperBoundOptions = [
  {
    label: '1000万円以下',
    value: 10_000_000,
  },
  {
    label: '5000万円以下',
    value: 50_000_000,
  },
  {
    label: '8000万円以下',
    value: 80_000_000,
  },
  {
    label: '1億円以下',
    value: 100_000_000,
  },
  {
    label: '2億円以下',
    value: 200_000_000,
  },
  {
    label: '3億円以下',
    value: 300_000_000,
  },
  {
    label: '5億円以下',
    value: 500_000_000,
  },
]
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { QTableProps } from 'quasar';
import { mapActions, mapState } from 'pinia';
import { useBuildingStore } from 'stores/building-store';

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: '物件名',
    field: 'name',
    sortable: false,
    align: 'left',
  },
  {
    name: 'price',
    label: '価格',
    field: 'price',
    sortable: false,
    align: 'right',
  },
  {
    name: 'address',
    label: '所在地',
    field: 'address',
    sortable: false,
    align: 'left',
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    sortable: false,
    align: 'right',
  },
]

export default defineComponent({
  name: 'BuildingListPage',
  setup() {
    return {
      columns,
    }
  },
  data() {
    return {
      loading: false,
    }
  },
  mounted() {
    try {
      this.loading = true;
      this.getBuildingList({});
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(useBuildingStore, ['getBuildingList']),
    detail(key: string) {
      this.$router.push({ name: 'building-detail', params: { id: key } })
    },
    edit(key: string) {
      this.$router.push({ name: 'building-edit', params: { id: key } })
    },
    remove(rowIndex: number) {
      console.log('remove', rowIndex)
    },
    create() {
      this.$router.push({ name: 'new-building' })
    },
    search() {
      try {
        this.loading = true;
        this.getBuildingList(this.searchParams);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapState(useBuildingStore, {
      rows: 'list',
      searchParams: 'searchParams',
    })
  },
});
</script>
