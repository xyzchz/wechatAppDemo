<template>
  <div class="container">
    <h3>我的应用</h3>
    <ul class="list">
      <li>
        <div @click="navigateToMiniProgram('1234556')">
          <img src="/static/img/appCenter/ybj_s.png" />
          <span>云编辑</span>
        </div>
      </li>
      <li>
        <div @click="navigateToMiniProgram('1234556')">
          <img src="/static/img/appCenter/yhy_s.png" />
          <span>云会议</span>
        </div>
      </li>
      <li>
        <div @click="navigateToMiniProgram('1234556')">
          <img src="/static/img/appCenter/ysj_s.png" />
          <span>云收集</span>
        </div>
      </li>
      <li>
        <div @click="navigateToMiniProgram('1234556')">
          <img src="/static/img/appCenter/ymb_s.png" />
          <span>云模板</span>
        </div>
      </li>
      <li>
        <div @click="navigateToMiniProgram('1234556')">
          <img src="/static/img/appCenter/yfy_s.png" />
          <span>云翻译</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
	methods: {
		navigateToMiniProgram(appid) {
			uni.navigateToMiniProgram(appid)
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
  padding: 55rpx 40rpx 0;
  background-color: rgb(242, 242, 242);
	height: 100vh;
  h3 {
    height: 30rpx;
    font-family: MicrosoftYaHei;
    font-size: 28rpx;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1rpx;
    color: #333333;
    margin-bottom: 20rpx;
  }
  .list {
    background-color: rgb(242, 242, 242);
    height: calc(100vh - 55rpx - 50rpx - 88rpx);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: flex-start;
    li {
      height: 87rpx;
      width: 325rpx;
      border-radius: 4rpx;
      background-color: #ffffff;
      border: solid 1rpx #dddddd;
      margin-bottom: 20rpx;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      img {
        width: 58rpx;
        height: 58rpx;
				margin-left: -8rpx;
      }
      span {
        margin-left: 15rpx;
        font-family: MicrosoftYaHei;
        font-size: 24rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 1rpx;
        color: #333333;
      }
    }
  }
}
</style>