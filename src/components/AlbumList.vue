<template>
  <el-skeleton :loading="loading" animated :count="12" :throttle="500">
    <template #template>
      <div class="item">
        <el-skeleton-item variant="image" class="skeleton-image" />
        <div class="info">
          <el-skeleton-item
            variant="text"
            class="skeleton-text"
            style="width: 80%"
          />
          <el-skeleton-item
            variant="text"
            class="skeleton-text"
            style="width: 50%"
          />
        </div>
      </div>
    </template>
    <template #default>
      <div class="albumlist">
        <div class="item" v-for="item in albumList" :key="item.id">
          <router-link
            class="faceImg"
            :to="{ path: '/album', query: { id: item.id } }"
          >
            <el-image class="image" :src="item.picUrl">
              <template #placeholder>
                <div class="image-slot">
                  <el-icon>
                    <i-ep-picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div class="info">
              <div class="info_name" v-if="item.name">
                {{ item.name }}
              </div>
              <div class="info_artist" v-if="item.artist">
                {{ item.artist.name }}
              </div>
              <div class="tag">
                {{ item.type }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
  albumList: Array
})
</script>

<style lang="less" scoped>
@w: calc((@mainWidth - 100px) / 4);
.el-skeleton {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20px;

  // margin: 0 -10px;
  // width: auto;

  .item {
    // box-sizing: border-box;
    display: flex;
    flex: 25%;
    max-width: calc((100% - 60px) / 4);
    margin: 20px 20px 0 0;
    // max-width: calc((100% - 80px) / 4);
    &:nth-child(4n) {
      margin-right: 0;
    }

    // margin: 10px;
    overflow: hidden;
  }
  .skeleton-image {
    flex: 120;
    // height: calc(@w * 0.37017);
    .calcHeight(@w, 324.167, 120)
    // width: 120px;
    // height: 120px;
  }
  .info {
    margin-top: 10px;
    flex: 204.16666;

    .skeleton-text{

      margin: 0 0 10px 20px;
      height: 18px;

    }
  }
}
.albumlist{
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20px;

  .item{
    flex: 25%;
    margin: 20px 20px 0 0;
    max-width: calc((100% - 60px)/4);
    &:nth-child(4n){
      margin-right: 0;
    }
    .faceImg{
      display: flex;
      background-color:  #f0f0f0;
      .image{
         overflow: visible;
        position: relative;
         z-index: 1;
         flex: 120;
         .calcHeight(@w, 324.167, 120);
         .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: var(--el-fill-color-light);
          color: var(--el-text-color-secondary);
          font-size: 25px;
        }
         &::after{
          position:absolute;
          content: '';
          right: -20px;
          top:0;
          z-index: -1;
          display: block;
          ;
          width: 100%;
          height: 100%;
          background: url('@/assets/img/disc.png');
          background-size: contain;
          transition: all .4s linear;
         }
          &:hover{
            &::after{
            right: -25px;
            transform: rotate(90deg);

            }

          }
      }
      .info{
       position: relative;
       flex:204.16666 ;
       overflow: hidden;
       .info_name{
          padding: 15% 20px 10px 40px;
          font-size: 16px;
          color: var(--color-text-main);
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover{
            color: var(--color-text-height);
          }
        }
        .info_artist{
          padding-left: 40px;
          font-size: 14px;
          color: var(--color-text);
        }
        .tag{
          width: 100px;
          background-color: var(--color-text-height);
          position: absolute;
          top: 5px;
          right: -30px;
          transform:rotate(45deg) ;
          height: 25px;
          line-height: 25px;
          text-align: center;
          font-size: 12px;
          color: #fff;
        }
      }



    }

  }
}
</style>
