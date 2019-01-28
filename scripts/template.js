// template.js
module.exports = {
    vueTemplate: pageName => {
      return `<template>
    <div class="${pageName}">
      ${pageName}页面
    </div>
  </template>
  <script>
  export default {
    name: '${pageName}'
  }
  </script>
  <style lang="scss" scoped>
  .${pageName} {
    background-color: #ffffff;
  }
  </style>
  `
    }
  }