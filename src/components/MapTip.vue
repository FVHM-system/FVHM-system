<template>
  <div class="map-tip">
    <div class="tip-item">
      <div class="icon" :style="{ background: 'rgb(157,217,9)' }"></div>
      <div class="word">阀门正常运行</div>
    </div>
    <div class="tip-item">
      <div class="icon" :style="{ background: 'rgb(117,205,245)' }"></div>
      <div class="word">消防栓正常运行</div>
    </div>
    <div class="tip-item">
      <div class="icon" :style="{ background: 'rgb(221, 109, 115)' }"></div>
      <div class="word">正在报警</div>
    </div>
    <div class="tip-item">
      <div class="icon" :style="{ background: 'rgb(150,151,151)' }"></div>
      <div class="word">已经废弃</div>
    </div>
    <div class="tip-item">
      <div class="icon" :style="{ background: 'rgb(213,22,251)' }"></div>
      <div class="word">尚未安装</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .map-tip {
    position: absolute;
    bottom: 80px;
    right: 20px;
    padding: 5px;
    background: white;
    border-radius: 6px;
    .tip-item {
      display: flex;
      align-items: center;
      padding: 6px;
      .icon {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        margin-right: 6px;
      }
      .word {
        font-size: 13px;
      }
    }
  }
</style>
