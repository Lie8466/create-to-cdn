// generatepage.js`
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const execSync = require('child_process').execSync;
const resolve = (...file) => path.resolve(__dirname, ...file)
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))
const { vueTemplate } = require('./template')

const generateFile = (path, data) => {
  if (fs.existsSync(path)) {
    errorLog(`${path}文件已存在`)
    return
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', err => {
      if (err) {
        errorLog(err.message)
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

function saveFile (file, content) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFileSync(file, content + '\n');
}

log('请输入要生成的新页面名称')
process.stdin.on('data', async chunk => {
  const inputName = String(chunk).trim().toString()
  /**
   * 页面目录路径
   */
  const pageDirectory = resolve('../src/views')
  /**
   * 路由文件路径
   */
  const routerName = resolve('../src/router', 'router-config.js');
  
  const pagePath = pageDirectory + `/${inputName}.vue`;

  if (!inputName) {
    errorLog('页面名称不可为空');
  } else if (fs.existsSync(pagePath)) {
    errorLog(`${inputName}页面已存在，请重新输入`)
  } else {
    log(`正在生成 vue 文件 ${inputName}`)
    await generateFile(resolve('../src/views') + `/${inputName}.vue`, vueTemplate(inputName))
    // 添加到 router.json
    const routerConfigFile = require('../src/router/router.json');

    // 添加到最后一个数组中
    routerConfigFile.push({
        path: '../views/' + inputName,
        name: inputName
    });

    saveFile(
        resolve('../src/router/router.json'),
        JSON.stringify(routerConfigFile, null, '  ')
    );

    execSync('npm run build:file');
    successLog('生成成功')
  }

  process.stdin.emit('end')
})
process.stdin.on('end', () => {
  log('exit')
  process.exit()
})