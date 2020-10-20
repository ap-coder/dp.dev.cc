<template>
    <div class="box msgBox">
        <h6>{{item.label}}
            <v-progress-circular
                v-if="loading"
                color="#ad1f25"
                indeterminate
                :size="28"
                :width="2"
                :value="20"></v-progress-circular>
            <a target="_self" class="blueBtn" @click="moreEvent(item)">more</a>
        </h6>
        <table>
            <tr>
                <th
                    v-for="(column, index) in item.columns"
                    :key="`${column.value}`">
                    <a :class="[
                        { 'th-normal': sortColumnIndex.length === 0 },
                        sortColumnIndex[index] === -1 ? 'th-normal' : sortClass[sortColumnIndex[index]]
                       ]"
                       :style="{ width: column.width ? column.width : '100%'}"
                       @click="sortClick(item, index)">{{column.text}}</a>
                </th>
            </tr>
            <tr
                v-for="(obj, i) in list"
                :key="`${new Date().getTime()}_${i}`"
                @click="cellEvent(item, obj)">
                <td
                    v-for="column in item.columns"
                    :key="column.value">
                    <span v-if="column.options">{{getOption(column.options, obj[column.value]).text}}</span>
                    <span v-else-if="column.isDate">{{formatDateText(obj[column.value])}}</span>
                    <span v-else-if="column.text === CUSTOMER">{{customerName(obj)}}</span>
                    <span v-else>{{obj[column.value]}}</span>
                </td>
            </tr>
            <tr v-for="i in 5 - list.length > 0 ? (5 - list.length): 0" :key="i">
              <td><span>-</span></td>
              <td><span> </span></td>
              <td><span> </span></td>
            </tr>
        </table>
    </div><!--box-->
</template>

<script>
import Notification from "@U/notice_manager";
import common from "@M/common";

export default {
    mixins: [common],
    data() {
        return {
            CUSTOMER: 'Customer',
            pagination: {
                sortBy: 'createdDate',
                sortByValue: 'desc',
            },
            sortColumnIndex: [], // -1 = th-normal; 0 = th-up; 1 = th-down
            sortClass: ['th-up', 'th-down'],
            sortName: ['desc', 'asc']
        }
    },
    props: {
        item: Object,
        list: Array,
        loading: Boolean
    },
    mounted() {
        this.setSortDataByColumns();

        console.log(`dashboard  === ${JSON.stringify(this.item.columns)}`);
    },
    methods: {
        setSortDataByColumns() {
            this.item.columns.forEach((item, index) => {
                this.sortColumnIndex[index] = -1;
            });
        },
        getOption(options, key) {
            return options.find(item => item.key === key) || '';
        },
        moreEvent(item){
            const { path } = item;

            this.$router.push(path);
            Notification.notifyObservers('changePath', path);
        },
        cellEvent(item, obj){
            const { path, cellPath, cellLabel } = item;
            const { fileId, userId } = obj;
            console.log(`cellEvent == ${cellPath} / ${cellLabel}`);

            if (cellPath.toLowerCase().indexOf('contract') > -1){
              // this.showDialog({
              //   visible: true,
              //   component: 'FileDetailView',
              //   id: fileId
              // });
              this.toTop();
              this.showDialog({
                visible: true,
                component: 'ContractDetailView',
                id: fileId,
                userId: userId,
              });
            } else if (cellPath.toLowerCase().indexOf('file') > -1) {
              this.toTop();
              this.showDialog({
                visible: true,
                component: 'FileDetailView',
                id: fileId
              });
            } else if (cellPath.toLowerCase().indexOf('sku') > -1) {
              this.toTop();
              this.showDialog({
                visible: true,
                component: 'SDKDetailView',
                id: fileId
              });
            } else {
              this.$router.push({ path: cellPath, query: { id: fileId || userId }});
              Notification.notifyObservers('changePath', path);
              Notification.notifyObservers('pushSubPath',{ label: cellLabel , path: cellPath});
            }
        },
        sortClick(item, index) {
            const { dataKey } = item;
            if (this.sortColumnIndex[index] < 1) {
                this.sortColumnIndex[index] += 1;
            } else {
                this.sortColumnIndex[index] = 0;
            }

            // reset other column key to -1
            this.sortColumnIndex = this.sortColumnIndex.map((val, i) => {
                if (i !== index) {
                    return -1;
                }
                return val;
            });

            // set query data
            this.pagination.sortBy = this.item.columns[index].value;
            this.pagination.sortByValue = this.sortName[this.sortColumnIndex[index]];
            this.$emit('sortClick', dataKey, this.pagination)
        },
        customerName(item) {
            const { firstName, lastName, shareFirstName, shareLastName, groupName } = item;
            if (shareFirstName && shareLastName){
              return `${shareFirstName || '-'} ${shareLastName || '-'}`;
            }
            if (groupName){
              return `${groupName || '--'}`;
            }
            return `${firstName || '-'} ${lastName || '-'}`;
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
