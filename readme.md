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

- [店铺编码](db/stores.md)
- [产品编码](db/models.md)

## 支持2种模式
## 1.Interval 时钟频率

[Request Interval / 配置时钟频率](src/index.js#L64)

## 2.ScheduleJob 周期性定时运行
[Request Schedule / 配置周期性定时运行](src/index.js#L150)

### 使用 cron 设定 周期性定时运行，设置及验证规则可参考[cron在线解析](https://cron.qqe2.com/)