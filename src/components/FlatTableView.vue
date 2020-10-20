<template>
    <div>
      <div class="tableBox">
          <table class="table">
              <thead>
              <tr>
                  <th v-for="header in columnKeys"
                  :key="header.text">{{header.text}} </th>
              </tr>
              <tr>
                  <th :colspan="columnKeys.length">
                      <v-progress-linear height="3px"
                                         v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
                  </th>
              </tr>
              </thead>

            <tbody>
            <tr v-for="(item, i) in items" :key="i"
                @click="cellEvent('', item)">
                <td v-for="col in columnKeys.filter(h=>!h.hidden)" :key="col.value">
<!--                    <v-btn :class="col.color ? col.color : 'red'" dark v-if="col.isEvent && col.value === 'accept'"-->
<!--                           @click.stop="cellEvent(col.value, item)" :disabled="item[col.value] === 1">{{col.text}}</v-btn>-->
                    <v-btn :class="col.color ? col.color : 'red'" dark v-if="col.isEvent"
                           @click.stop="cellEvent(col.value, item)">{{col.text}}</v-btn>
                    <v-btn flat text v-else-if="col.isTextEvent"
                           @click.stop="cellEvent(col.value, item)">{{item[col.value]}}</v-btn>
                    <div v-else-if="col.isSelect">
                        <span>{{ getSelectList(col, item) }}</span>
                    </div>
<!--                    <div v-else-if="col.isSelect && item[col.value] !== 2">-->
<!--                        <v-select :items="col.options"-->
<!--                                  item-text="text"-->
<!--                                  item-value="key"-->
<!--                                  v-model="item[col.value]"-->
<!--                                  :label="col.text"-->
<!--                        ></v-select>-->
<!--                    </div>-->
                    <span v-else-if="col.isSelectText">{{ getSelectList(col, item) }}</span>
                    <span v-else>{{ getValue(col, item[col.value])}}</span>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="pageBar">
            <div>
                <span>{{pagination.page}}-{{pagination.rowsPerPage}}&nbsp;of&nbsp;{{totalItems}}</span>
                <select class="select" v-model="pagination.rowsPerPage" @change="changePage('limit')">
                    <option :value="5">5</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                </select>
            </div>
            <div>
                <button class="preBtn" @click.prevent="changePage('prev')" :disabled="pagination.page <=1"></button>
                <button class="nextBtn" @click.prevent="changePage('next')"
                        :disabled="pagination.page  >= (totalItems/pagination.rowsPerPage)"></button>
            </div>

          </div><!--tableBox-->
      </div>
    </div>
</template>

<script>
    export default {
        name: "FlatTableView",
        props: [
            'headers',
            'columnKeys',
            'items',
            'loading',
            'showSearchBar',
            'showAddButton',
            'showExportButton',
            'showSearchDate',
            'totalItems',
            'searchPlaceHolder',
            'hideRefresh'
        ],
        data(){
            return {
                pagination: {
                    sortBy: 'createDate',
                    descending: 'desc',
                    page: 1,
                    rowsPerPage: 5,
                },
                search: {
                    keyword: '',
                    placeholder: this.searchPlaceHolder ? this.searchPlaceHolder : 'Search',
                    searchDate: [],
                },
            }
        },
        methods: {
            getSelectList(col, option){
                const find = col.options.find(item=>item.key === option[col.value]);
                if (find){
                    return find.text;
                }
                return '--'
            },
            changePage(key){
                if (key === 'prev'){
                    this.pagination.page -=1;
                } else if (key === 'next'){
                    this.pagination.page +=1;
                }
                console.log(`page ${JSON.stringify(this.pagination)}`);
                this.$emit('changePage', this.pagination);
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending;
                } else {
                    this.pagination.sortBy = column;
                    this.pagination.descending = false;
                }
            },
            loadData() {
                this.$emit('handleLoadData');
            },
            searchEvent() {
                if (this.showSearchDate) {
                    this.$emit('searchData', this.search);
                } else {
                    this.$emit('searchData', this.search.keyword);
                }
            },
            dateChange(val) {
                console.log(`search date ${val}`);
                // this.searchInfo.birthday = val.split(' - ');
            },
            cellEvent(key, item){
                this.$emit('cellEvent', {key:key, item: item });
            },
            getValue(col, text){
                if (col.emptyValue === ''){
                    return text;
                } else {
                    if (!text || text === ''){
                        return col.emptyValue;
                    }
                    return text;
                }
            }
        }
    }
</script>

<style scoped src="../assets/css/all-admin.css">

</style>
