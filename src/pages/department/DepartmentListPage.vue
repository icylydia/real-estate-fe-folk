<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="fit row justify-between">
          <div class="text-h6">部署一覧</div>
          <q-btn
            color="primary"
            icon="add"
            label="部署を追加"
            @click="toCreatePage"
          />
        </div>
      </q-card-section>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <q-tree
          :nodes="departments"
          node-key="id"
          children-key="subDepartments"
          label-key="name"
          v-model:selected="selected"
        >
          <template #[`default-header`]="{ node, key }: { node: DepartmentInResponse, key: string }">
            <div class="row fit justify-between">
              <div class="text-subtitle1 text-weight-bold">
                {{ node.name }}
                <span class="text-subtitle2">
                  (人数: {{ node.memberCount }}人, 責任者: {{ node.leader.lastName }} {{ node.leader.firstName }})
                </span>
              </div>
              <div>
                <q-btn
                  class="q-mx-sm"
                  icon="sym_r_visibility"
                  flat
                  dense
                  @click="toDetailPage(key)"
                />
                <q-btn
                  class="q-mx-sm"
                  icon="sym_r_edit"
                  flat
                  dense
                  @click="toEditPage(key)"
                />
                <q-btn
                  class="q-mx-sm"
                  icon="sym_r_delete"
                  flat
                  dense
                  @click="deleteDepartment(key)"
                />
              </div>
            </div>
          </template>
        </q-tree>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { DepartmentInResponse } from 'src/api';
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useDepartmentStore } from 'stores/department-store';
import { delay } from 'src/utils';

export default defineComponent({
  name: 'DepartmentListPage',
  data() {
    return {
      loading: false,
      selected: [],
    }
  },
  async mounted() {
    this.loading = true
    try {
      this.reset()
      await delay(1000)
      await this.getDepartmentList()
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions(useDepartmentStore, ['getDepartmentList', 'reset']),
    toCreatePage() {
      this.$router.push({ name: 'department-create' })
    },
    toDetailPage(id: string) {
      this.$router.push({ name: 'department-detail', params: { id } })
    },
    toEditPage(id: string) {
      this.$router.push({ name: 'department-edit', params: { id } })
    },
    deleteDepartment(id: string) {
      console.log('delete ', id)
    },
  },
  computed: {
    ...mapState(useDepartmentStore, {
      departments: 'list',
    }),
  },
})
</script>
