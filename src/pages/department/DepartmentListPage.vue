<script setup lang="ts">
import type { DepartmentInResponse } from 'src/api';
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDepartmentStore } from 'stores/department-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const selected: Ref<string[]> = ref([]);
const loading = ref(false);
const { getDepartmentList, deleteDepartment } = useDepartmentStore();
const { list: departments } = storeToRefs(useDepartmentStore());

onMounted(async () => {
  await reload();
});

const reload = async () => {
  loading.value = true;
  try {
    await getDepartmentList();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const router = useRouter();
const toCreatePage = () => {
  router.push({ name: 'department-create' })
}
const toDetailPage = (id: string) => {
  router.push({ name: 'department-detail', params: { id } })
}
const toEditPage = (id: string) => {
  router.push({ name: 'department-edit', params: { id } })
}
const $q = useQuasar();
const removeDepartment = (department: DepartmentInResponse) => {
  $q.dialog({
    title: '部署削除',
    message: `部署「${department.name}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!department.id) {
      return;
    }
    try {
      await deleteDepartment(department.id);
    } catch (e) {
      console.error(e);
    }

    await reload();
  });
}
</script>

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
                  (人数: {{ node.memberCount || 0 }}人,
                  責任者: <template v-if="node.leader">{{ node.leader.lastName }} {{ node.leader.firstName }})</template>
                  <template v-else>-)</template>
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
                  @click="removeDepartment(node)"
                />
              </div>
            </div>
          </template>
        </q-tree>
      </q-card-section>
    </q-card>
  </q-page>
</template>
