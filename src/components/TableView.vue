<template>
    <div :class="layoutClass">
        <div class="tableBox">
          <table class="table">
            <thead>
              <tr>
                <th
                    v-for="(item, i) in columnKeys"
                    :key="item.value">
                    <a v-if="item.sortable === true" :class="[
                        { 'th-normal': sortColumnIndex.length === 0 },
                        sortColumnIndex[i] === -1 ? 'th-normal' : sortClass[sortColumnIndex[i]]
                       ]"
                       @click="changePage('sort', i)">{{item.text}}</a>
                    <span v-else class="th-normal">{{item.text}}</span>
                </th>
              </tr>
              <tr>
                <th :colspan="columnKeys.length">
                  <v-progress-linear height="3px"
                                    v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items"
                :key="item.roleId"
                :class="item.status === 0 ? 'msg_unread':''"
                @click="cellEvent($event, '', item)">
                <td
                  v-for="column in columnKeys"
                  :key="column.value">
                  <div v-if="[FUNCTION,DELETE_CHECK_GROUP,DOWNLOAD].indexOf(column.value) > -1">
                    <a v-if="[FUNCTION,DELETE_CHECK_GROUP,DOWNLOAD].indexOf(column.value) > -1" :href="`#${currentPath}`"
                       class="downloadBtn" @click.prevent="cellEvent($event, 'download', item)"></a>
                    <a v-if="[DELETE,FUNCTION].indexOf(column.value) > -1 && canEdit"
                       :href="`#${currentPath}`" class="delete2Btn"
                       @click.prevent="cellEvent($event, 'delete', item)"></a>
                    <a v-if="[DELETE_CHECK_GROUP].indexOf(column.value) > -1 && item.isGroup === false && canEdit"
                       :href="`#${currentPath}`" class="delete2Btn"
                       @click.prevent="cellEvent($event, 'delete', item)"></a>
                  </div>
                  <div v-else-if="[DELETE].indexOf(column.value) > -1">
                    <a v-if="[DELETE].indexOf(column.value) > -1 && canEdit"
                       :href="`#${currentPath}`" class="delete2Btn"
                       @click.prevent="cellEvent($event, 'delete', item)"></a>
                  </div>
                  <div v-else>
                    <span v-if="column.options" :class="getOption(column.options, item[column.value]).class">{{getOption(column.options, item[column.value]).text}}</span>
                    <span v-else-if="column.isName">{{`${item.firstName} ${item.lastName}` || '-'}}</span>
                    <span v-else-if="column.isShareName">{{getShareName(item)}}</span>
                    <span v-else-if="column.isDate === true">{{`${formatDateText(item[column.value])}` || '-'}}</span>
                    <span v-else-if="column.text === CUSTOMER">{{customerName(item)}}</span>
                    <span v-else>{{item[column.value] || '-'}}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!loading && (!items || items.length === 0)" class="nodataBox">No data available</div>
        </div><!--tableBox-->
        <div class="pageBar" v-if="hiddenPagination === false && (items && items.length > 0)">
          <div>
            <span>{{pageItem}}&nbsp;of&nbsp;{{header.totalCount}}</span>
            <!--select 超過5筆selct才顯示-->
            <select
              v-if="header.totalCount > 10"
              v-model="pagination.limit"
              class="select"
              @change="changePage(LIMIT)">
<!--              <option :value="5">5</option>-->
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
            </select>
          </div>
          <div>
            <button class="preBtn" :disabled="!showPrePage" @click="changePage(PRE)"></button>
            <button class="nextBtn" :disabled="!showNextPage" @click="changePage(NEXT)"></button>
          </div>
        </div><!--pageBar-->
    </div><!--sdksDiv-->
</template>

<script>
import common from "@M/common";

export default {
    name: "TableView",
    mixins:[common],
    props: {
      layoutClass: {
          type: String,
          default: 'commonDiv'
      },
      header: Object,
      columnKeys: Array,
      items: Array,
      loading: Boolean,
      searchPlaceHolder: String,
      hiddenPagination: Boolean,
      canEdit: Boolean,
    },
    data(){
        return {
            DELETE: 'delete',
            DELETE_CHECK_GROUP: 'delete_check_group',
            FUNCTION: 'function',
            DOWNLOAD: 'download',
            TYPE: 'type',
            LIMIT: 'limit',
            PRE: 'pre',
            NEXT: 'next',
            SORT: 'sort',
            CUSTOMER: 'Customer',
            pagination: {
                sortBy: '',
                sortByValue: 'desc',
                page: 1,
                limit: 10,
            },
            search: {
                keyword: '',
                placeholder: this.searchPlaceHolder ? this.searchPlaceHolder : 'Search',
                searchDate: [],
            },
            sortColumnIndex: [], // -1 = th-normal; 0 = th-up; 1 = th-down
            sortClass: ['th-up', 'th-down'],
            sortName: ['desc', 'asc']
        }
    },
    computed: {
        currentPath() {
            return this.$route.path;
        },
        pageItem() {
            const beginItem = (this.pagination.page * this.pagination.limit) - (this.pagination.limit - 1);
            const endItem = this.header.totalCount > (this.pagination.page * this.pagination.limit) ?
                            this.pagination.page * this.pagination.limit :
                            this.header.totalCount;
            return `${beginItem}-${endItem || 0}`;
        },
        showNextPage() {
            return this.header.totalCount > (this.header.limit * this.pagination.page);
        },
        showPrePage() {
            return this.pagination.page > 1;
        }
    },
    watch: {
        header() {
            this.pagination.limit = this.header.limit;
        },
        columnKeys() {
            this.setSortDataByColumns();
        }
    },
    mounted() {
        this.setSortDataByColumns();
    },
    methods: {
        getShareName(item){
          if (item.shareFirstName && item.shareFirstName !==''){
            return `${item.shareFirstName} ${item.shareLastName}`;
          }
          if (item.groupName && item.groupName !==''){
            return `${item.groupName}`;
          }
          return '--'
        },
        getOption(options, key) {
            return options.find(item => item.key === key) || '';
        },
        getSelectList(col, props){
            const find = col.options.find(item=>item.key === props.item[col.value]);
            if (find){
                return find.text;
            }
            return '--'
        },
        changePage(page, index){
          switch (page) {
            case this.NEXT:
              this.pagination.page += 1;
              break;
            case this.PRE:
              this.pagination.page -= 1;
              break;
            case this.LIMIT:
              this.pagination.page = 1;
              break;
            case this.SORT:
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
              this.pagination.sortBy = this.columnKeys[index].value;
              this.pagination.sortByValue = this.sortName[this.sortColumnIndex[index]];
              break;
          }
          if (this.pagination.sortBy === '') { //找跟時間相關的欄位為預設排序
            const find = this.columnKeys.find(item=>{
              return item.value.toLowerCase().indexOf('date') > -1 || item.value.toLowerCase().indexOf('time') > -1;
            });
            if (find){
              this.pagination.sortBy = find.value;
            } else {
              this.pagination.sortBy = this.columnKeys[0].value;
            }
          }
          this.$emit('changePage', this.pagination);
        },
        loadData() {
            this.$emit('handleLoadData');
        },
        dateChange(val) {
            console.log(`search date ${val}`);
            // this.searchInfo.birthday = val.split(' - ');
        },
        cellEvent(e, key, item){
            e.stopPropagation();
            if (this.canEdit){
              this.$emit('cellEvent', {key:key, item });
            }
        },
        setSortDataByColumns() {
            this.sortColumnIndex.length = 0;
            this.columnKeys.forEach((item, index) => {
                this.sortColumnIndex[index] = -1;
            });
        },
        customerName(item) {
            const { firstName, lastName } = item;
            return `${firstName || '-'} ${lastName || '-'}`;
        }
    }
}
</script>

<style scoped src="../assets/css/all-admin.css">

</style>
