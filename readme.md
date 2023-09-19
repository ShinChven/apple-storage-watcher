# Apple Storage Watcher

> 简陋版 苹果库存检查器
> A really simple Apple Storage Watcher from commandline.

## Installation 安装

```bash
npm install
```

## Usage 使用

```bash
npm start
```

## Configuration 配置

[Model and Color / 配置型号和颜色](src/index.js#L9)

```javascript
const models = {
  'model': 'color',
  '型号': '颜色',
  'MTQ63CH/A': '原色钛金属',, // Exmaple 示例
}
```

## Interval 时钟频率

[Request Interval / 配置时钟频率](src/index.js#L64)

## ScheduleJob 周期性定时运行
[Request Schedule / 配置周期性定时运行](src/index.js#L150)

### 使用 cron 设定 周期性定时运行，设置及验证规则可参考[cron在线解析](https://cron.qqe2.com/)