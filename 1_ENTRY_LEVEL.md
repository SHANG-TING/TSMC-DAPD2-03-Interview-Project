# 1 ENTRY LEVEL

## 如何啟動執行整個專案

建議切換到 node >= 20 的版本，再執行以下指令

```
npm ci
npm start
```

> 因為後續的題目，一樣會在這 repo 持續更新，所以如果只想單純驗證 1 ENTRY LEVEL 的功能有沒有實現的話，麻煩請先切換 `feature/1-entry-level` 分支
>
> ```
> git checkout feature/1-entry-level
> ```

## 如何驗證功能是否正確

### Unit Testing

```
npx nx test portal --coverage --coverageReporters="text-summary"
```

![image](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/33c1de5a-2c64-4769-8a87-ac9458ae3abe)

wallaby.js

![image](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/e87e12a3-86d0-425c-a216-6e6ac49e1509)

### Manual Testing

打開 http://localhost:4200

![2024-05-11 16 59 18](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/3e078fb3-5721-4b63-9a79-ed780f8b8075)

## 簡易的專案架構說明

```
├── apps/portal/src/app
│   ├── feature/dashboard
│   │   ├── widgets # 定義對應 widget type 的元件
│   │   │   ├──  grid-widget.component.ts
│   │   │   └──  text-widget.component.ts
│   │   └── dashboard.component.ts #主頁面
│   └── shared/ui
│       └── gridbox # 主要生成網格的元件
```
