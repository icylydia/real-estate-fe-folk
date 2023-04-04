<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section class="q-pa-none">
        <q-table
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
          <template #body-cell-price="{ row }">
            <q-td class="text-right">
              {{ $filters.jpyCurrency(row.price) }}
            </q-td>
          </template>
          <template #body-cell-grossYield="{ row }">
            <q-td class="text-right">
              {{ $filters.percentage(row.grossYield) }}
            </q-td>
          </template>
          <template #body-cell-address="{ row }">
            <q-td>
              {{ row.address.prefecture }}{{ row.address.detailAddress1 }}{{ row.address.detailAddress2 }}
            </q-td>
          </template>
          <template #body-cell-actions="{ key }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="detail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="edit(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(key)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

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
    name: 'grossYield',
    label: '表面利回り',
    field: 'grossYield',
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
  mounted() {
    try {
      this.getBuildingList();
    } catch (e) {
      console.error(e);
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
  },
  computed: {
    ...mapState(useBuildingStore, {
      rows: 'list',
    })
  },
});
</script>
