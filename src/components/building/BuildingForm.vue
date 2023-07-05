<template>
  <div class="text-h6">
    物件基本情報{{ readonly ? '（閲覧）' : '（編集）' }}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newBuilding">
      <q-item-section>
        <q-input v-model="building.id" label="物件ID" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.name" label="物件名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input-currency v-model="building.price" label="価格" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.grossYield" label="表面利回り" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input-area v-model="building.grossArea" label="建物面積" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input-area v-model="building.landArea" label="土地面積" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="building.buildingStructure"
          emit-value
          map-options
          label="建物構造"
          :options="buildingStructureOptions"
          clearable
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.floorsAboveGround" label="地上階数" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.floorsUnderGround" label="地下階数" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.completionDate" label="新築年月日" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.totalUnits" label="総戸数" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="building.landRights"
          emit-value
          map-options
          label="土地权利"
          :options="landRightsOptions"
          clearable
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="building.landUseZone"
          emit-value
          map-options
          label="用途地域"
          :options="landUseZoneOptions"
          clearable
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.buildingCoverageRatio" label="建ぺい率" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.floorAreaRatio" label="容積率" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.promptUpdate" label="催促期間（Nヶ月前）" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          v-model="building.comments"
          label="備考"
          autogrow
          clearable
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
  <div class="q-mt-md text-h6">
    物件位置情報{{readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input
          v-model="building.address!.postalCode"
          label="郵便番号"
          placeholder="xxx-xxxx"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-btn
          class="q-mr-sm"
          color="primary"
          label="住所検索"
          icon="sym_r_location_on"
          @click="searchAddress"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.address!.prefecture" label="都道府県" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="building.address!.detailAddress1" label="市区町村" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="building.address!.detailAddress2" label="丁目" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="building.address!.detailAddress3" label="それ以降の住所" :readonly="readonly" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts" setup>
import QInputCurrency from 'components/extension/QInputCurrency.vue';
import QInputArea from 'components/extension/QInputArea.vue';

const buildingStructureOptions = [
  {
    label: '木造(W)',
    value: 'wood',
  },
  {
    label: '鉄骨造(S)',
    value: 'steel',
  },
  {
    label: '鉄筋コンクリート造(RC)',
    value: 'reinforcedConcrete',
  },
  {
    label: '鉄筋鉄骨コンクリート造(SRC)',
    value: 'steelReinforcedConcrete',
  },
];

const landRightsOptions = [
  {
    label: '所有権',
    value: 'freehold',
  },
  {
    label: '借地権',
    value: 'leasehold',
  }
]

const landUseZoneOptions = [
  {
    label: '第一種低層住居専用地域',
    value: 'lowRiseResidential1',
  },
  {
    label: '第二種低層住居専用地域',
    value: 'lowRiseResidential2',
  },
  {
    label: '第一種中高層住居専用地域',
    value: 'mediumHighRiseResidential1',
  },
  {
    label: '第二種中高層住居専用地域',
    value: 'mediumHighRiseResidential2',
  },
  {
    label: '第一種住居地域',
    value: 'residential1',
  },
  {
    label: '第二種住居地域',
    value: 'residential2',
  },
  {
    label: '準住居地域',
    value: 'quasiResidential',
  },
  {
    label: '田園住居地域',
    value: 'ruralResidential',
  },
  {
    label: '近隣商業地域',
    value: 'neighborhoodCommercial',
  },
  {
    label: '商業地域',
    value: 'commercial',
  },
  {
    label: '準工業地域',
    value: 'quasiIndustrial',
  },
  {
    label: '工業地域',
    value: 'industrial',
  },
]
</script>


<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useBuildingStore } from 'stores/building-store';

export default defineComponent({
  name: 'BuildingForm',
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    newBuilding: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(useBuildingStore, ['validatePostalCode', 'updateAddressFromPostalCode']),
    async searchAddress() {
      if (!this.validatePostalCode()) {
        this.$q.notify({
          type: 'negative',
          message: '郵便番号は不正です',
        });
        return;
      }
      try {
        await this.updateAddressFromPostalCode();
      } catch (e) {
        //
      }
    },
  },
  computed: {
    ...mapState(useBuildingStore, {
      building: 'formModel',
    })
  }
});
</script>
