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

[Model and Location / 配置型号和位置](src/index.js#L9)

```javascript
const models = {
  'model': 'location',
  '型号': '位置',
  'MPUJ3CH/A': '河南 郑州 二七区', // Exmaple 示例
}
```

## Interval 时钟频率

[Request Interval / 配置时钟频率](src/index.js#L64)

