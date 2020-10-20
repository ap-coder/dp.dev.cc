<template>
  <div class="sdksAddDiv">
    <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
    <div class="rowLeft">
      <div class="rowDiv">
        <div class="tit">SKU Name</div>
        <div class="con">
          <input type="text" class="textInput" v-model="item.displayName">
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv">
        <div class="tit">Type</div>
        <div class="con">
          <select class="select" v-model="item.type">
            <option
                v-for="option in fileTypes"
                :key="option.key"
                :value="option.key">{{ option.text }}
            </option>
          </select>
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv">
        <div class="tit">Version</div>
        <div class="con">
          <input type="text" class="textInput" v-model="item.version">
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv">
        <div class="tit">Description</div>
        <div class="con">
                    <textarea
                        class="textInput" v-model="item.note"></textarea>
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv">
        <div class="tit">Visibility</div>
        <div class="con">
          <select class="select" v-model="item.visibility" @change="changeVisibility">
            <option
                v-for="option in getVisibilityList"
                :key="option.key"
                :value="option.key">{{ option.text }}
            </option>
          </select>
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv" v-if="item.visibility === 2">
        <!--                <div class="tit">Persistent</div>-->
        <div class="con">
          <div class="checkBox">
            <input type="checkbox" id="c1" name="cc"
                   :disabled="item.visibility === 0|| item.visibility === 1"
                   v-model="checkBox">
            <label for="c1">
              <span class="labelGray"></span>
              <span class="labelRed"></span>
              Persistent
            </label>
          </div>
        </div>
        <div class="clear"></div>
      </div>
<!--      <div class="rowDiv">-->
<!--        <div class="tit">Author</div>-->
<!--        <div class="con">-->
<!--          <input type="text" class="textInput" :disabled="true"-->
<!--                 v-model="getUserInfo.account">-->
<!--        </div>-->
<!--        <div class="clear"></div>-->
<!--      </div>-->
      <div class="rowDiv" v-if="item.originURL">
        <div class="tit">File</div>
        <div class="con">
          <a @click="downloadEvent()"
             class="downloadTxtBtn">{{ item.name }}</a>
        </div>
      </div>
      <div class="rowDiv" v-if="(item.type !== 2 && item.type !== 3 && item.type !==4)">
        <div class="tit">Upload File <span
            v-if="uploadProgress > 0 && uploadProgress <= 100">{{ uploadProgress }}%</span></div>
        <div class="con">
          <span v-if="item.file" class="filename">{{ item.file.name }}</span>
          <span v-if="!item.file && item.name && (!item.originURL || item.originURL === '')" class="filename">{{ item.name }}</span>
          <a :href="`#${currentPath}`" target="_self" class="uploadTxtBtn" @click="chooseFile('file')">Upload</a>
          <input ref="file"
                 type="file" :name="item.uploadFieldName"
                 style="visibility: hidden; margin: 0; height: 1px"
                 @change="handleFilesUpload()"
                 accept="*" class="v-btn theme--light primary">
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowDiv mt-2" v-if="message !==''">
        <span class="red--text">{{ message }}</span>
        <div class="clear"></div>
      </div>
    </div><!--rowLeft-->
    <div class="rowBtn">
      <a href="#" class="redBtn" @click.prevent="upload">
        <v-progress-circular color="#ffffff" indeterminate :size="28"
                             :width="2"
                             v-if="saveLoading" :value="20"></v-progress-circular>
        <span v-else>Save</span>
      </a>
      <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
    </div>
  </div><!--usersAddDiv-->
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {CACHE_USER_KEY, SDK_TYPE, VISIBILITY_TYPE} from "@/utils/Constant";
import Notification from "@/utils/notice_manager";

export default {
  name: "SKUAddView",
  components: {},
  data() {
    return {
      item: null,
      defaultItem: {
        displayName: '',
        type: -1,
        version: '',
        note: '',
        uploadFieldName: 'photos',
        file: null,
        enterprise: false,
        content: '',
        customerId: '',
        expiredDate: '',
        owner: '',
        persistent: true,
        visibility: 2,
      },
      checkBox: true,
      message: '',
      loading: false,
      saveLoading: false,
      saveMessage: '',
      shareMessage: '',
      info: null,
      shareUsers: [],
      editorOption: {},
      uploadProgress: 0,
    };
  },
  created() {
    this.item = Object.assign({}, this.defaultItem);
    this.loadData();

    console.log(`isEdit ${this.isEdit} / ${JSON.stringify(this.item)}`);

    // 上傳進度
    Notification.addObserver('sdkProgress', (uploadProgress) => {
      this.uploadProgress = uploadProgress;
    });
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    fileTypes: () => SDK_TYPE,
    isEdit() {
      return this.$route.query.id !== '';
    },
    currentPath() {
      return this.$route.fullPath;
    },
    fields() {
      return {
        '-1': [],
        '0': ['selectSubType'],
        '1': ['displayName', 'type'],
        '2': ['displayName', 'type', 'content', 'customerId', 'expiredDate', 'version', 'file'],
        '3': ['displayName', 'type', 'content', 'version', 'fileDescription'],
        '4': ['displayName', 'type', 'content', 'version', 'fileDescription'],
        '6': ['displayName', 'type', 'version', 'file'],
        '7': ['displayName', 'type', 'version', 'file'],
        '8': ['displayName', 'type', 'version', 'file']
      }
    },
    getVisibilityList(){
      return VISIBILITY_TYPE;
    }
  },
  methods: {
    ...mapActions(['uploadSDK', 'getSDKInfo', 'saveSDKMap']),
    handleShareClear() {
      this.saveMessage = '';
    },
    async handleShareGroup(item) {
      console.log(`handleShareGroup == ${JSON.stringify(item)}`);
      this.shareUsers = item.isGroup ? [item.items] : item.items;
    },
    async loadData() {
      const fileId = this.$route.query.id;
      if (!fileId || fileId === '') {
        return;
      }
      this.loading = true;
      const token = localStorage.getItem(CACHE_USER_KEY);
      const res = await this.getSDKInfo({
        token: this.getUserInfo.token ? this.getUserInfo.token : token,
        fileId: fileId,
      });
      const result = res.data;
      this.loading = false;

      if (result && result.data) {
        if (result.statusCode === 0) {
          this.item = result.data;
          this.checkBox = this.item.persistent;
          console.log(`get sdk file ==`, JSON.stringify(this.item));
        }
      }
    },
    checkUpload() {
      console.log(JSON.stringify(this.fileItems));
      let hasError = false;
      console.log(`item ${JSON.stringify(this.item)}`);

      if (this.item.type === 2 || this.item.type === 3 || this.item.type === 4) {
        hasError = this.checkField();
        if (hasError) {
          return;
        }
      } else {
        hasError = this.checkField();
        if (hasError) {
          return;
        }

        if (this.isEdit === false) {
          const file = this.item.file;
          if (file) {
            const limit = 100 * 1024 * 1024;
            console.log(`check file size ${file.size} > ${limit}`);
            if (file.size > limit) {
              hasError = true;
              this.message = 'File too large';
              return false;
            }
          } else {
            hasError = true;
            this.message = 'File is required';
          }
        }

      }

      console.log(`失敗 ${hasError} / ${this.message}`);
      if (hasError) {
        this.message = 'Please fill in all fields';
        return false;
      }
      return true;
    },
    checkField() {
      let hasError = false;
      if (this.item.type === -1) {
        hasError = true;
        this.message = 'Select Type';
        return hasError;
      } else if (this.item.displayName === '') {
        hasError = true;
        this.message = 'File name is required';
        return hasError;
      } else if (this.item.note.length > 1000) {
        hasError = true;
        this.message = 'Release limit 1000 character';
        return hasError;
      }
      return hasError;
    },
    chooseFile() {
      const ref = this.$refs['file'];
      console.log(ref);
      ref.click();
    },
    handleFilesUpload() {
      console.log(`handleFilesUpload`);
      const ref = this.$refs['file'];
      console.log(ref);

      this.message = '';
      const file = ref.files[0];
      console.log(file);
      this.$set(this.item, 'file', file);
    },
    upload() {
      if (!this.checkUpload()) {
        return;
      }
      if (this.$refs.file) {
        this.$refs.file.value = null;
      }

      this.saveLoading = true;
      const formData = new FormData();
      const file = this.item.file;
      formData.append(`photos`, file);
      this.info = Object.assign({}, this.item);
      this.info.persistent = this.checkBox === true ? 1 : 0;
      this.info.owner = this.getUserInfo.userId;
      this.info.shareUsers = this.shareUsers;
      delete this.info.file;
      console.log(`upload info... ${JSON.stringify(this.info)}`);
      formData.append(`info`, JSON.stringify(this.info));
      const token = localStorage.getItem(CACHE_USER_KEY);
      this.loading = true;
      this.uploadSDK({
        fileList: formData,
        token: this.getUserInfo ? this.getUserInfo.token : token
      }).then((response) => {
        console.log(`upload ... ${JSON.stringify(response)}`);
        this.saveLoading = false;
        if (response.status === 200) {
          console.log('上傳成功');
          this.uploadProgress = 0;
          this.message = 'Upload Complete';
          this.loading = false;
          this.reset();
        }
      }).catch(e => {
        this.saveLoading = false;
        this.message = 'Upload Error';
        console.log(`上傳失敗 ${e}`);
      });
    },
    reset() {
      if (this.isEdit) {
        this.loadData();
        this.selectMessage = '';
        setTimeout(() => {
          this.message = '';
        }, 2000);
      } else {
        this.item = Object.assign({}, this.defaultItem);
        this.cancel();
      }
    },
    cancel() {
      Notification.notifyObservers('popSubPath');
      this.$router.back();
    },
    downloadEvent() {
      console.log(`url ${this.item.originURL}`);
      const link = document.createElement('a');
      link.href = this.item.originURL;
      link.download = this.item.fileName;
      link.click();
    },
    showField(item, key) {
      const {type} = item;
      return this.fields[`${type}`].indexOf(key) > -1;
    },
    changeVisibility(){
      if (this.item.visibility === 0 || this.item.visibility === 1){ // public
        this.item.persistent = true;
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
