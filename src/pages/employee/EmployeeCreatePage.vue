<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規社員</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <employee-form new-employee />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="save"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import EmployeeForm from 'components/employee/EmployeeForm.vue';
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useEmployeeStore } from 'stores/employee-store';

export default defineComponent({
  name: 'EmployeeCreatePage',
  mounted() {
    this.resetForm();
  },
  methods: {
    ...mapActions(useEmployeeStore, {
      resetForm: 'reset',
    }),
    save() {
      this.$router.push({ name: 'employee-list' });
    },
  },
});
</script>
