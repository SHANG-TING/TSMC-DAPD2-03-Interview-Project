# 3. Advanced Level

## 整體架構的設計方向

這次主要是以 dynamic import 的方式，而不是以動態建立 script tag 的方式去載入第三方元件
> 另外 dynamic import 也可以隨時搭配 Module Federation 定義 remoteEntry.js 來搭配（但這通常是希望能在 browser 整合來自不同 domain 的元件），所以這次就是單純 lazy-load 同 domain 的 chunk.js 而已。

### Monorepo Structure

```
├── app/portal # 主要 app
│   └── src/app
│       ├── app.component.html # 配置 router-outlet
│       └── app.routes.ts # 配置 dashboard route
├── libs/feature/dashboard/src/lib
│   ├── ui
│   │   └── thrid-widget-loader/*.* # 在畫面上建立對應的 Custom Element Tag，並透過 Dynamic Import 來實現 Lazy-load 第三方 Component 的效果
│   ├── widgets
│   │   ├── grid-widget/*.*
│   │   └── text-widget/*.*
│   ├── dashboard.component.ts # 在 gridbox 裡，根據 Widget Type 配置 grid-widget 或 text-widget 以及 thrid-widget-loader
│   └── dashboard.service.ts # 主要是 Widget 可以資料共享的地方（包含 thrid-widgets），但我會透過放在 Custom Element 的 Property 裡面，讓第三方 Component 可以訂閱資料變化
├── libs/thrid-widgets/super-grid-widget/src/lib
│   ├── hooks
│   │   ├── useDashboardService.ts # 取得 shadowRoot.host.dashboardService
│   │   └── useGridSettings.ts # 訂閱 gridFilterChange 和 gridSortChange，且透過 React Re-render 的特性來同步資料
│   └── SuperGridWidget.tsx # 實作元件，以及定義 Custom Element Tag <super-grid-widget>
```
### Logical Data Flow

![image](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/03cd8515-fe37-42bc-9fae-ad800ad499f8)

## 是否有想過其他解決方式?如果有請說明不同方式及優缺點

### 解決方式 1

可以實作一個 renderReact 的 Directive，就可以在 Angular 專案裡面渲染 React Component
> 如果這邊再搭配 dynamic import 的話，效果其實也很接近我目前的方案，頂多差在不是 Shadow DOM 而已

```
import { ComponentProps, createElement, ElementType } from 'react';
import { createRoot } from 'react-dom/client';

@Directive({
  selector: '[renderReact]',
  standalone: true
})
export class RenderReactDirective<Comp extends ElementType> {
  @Input() reactComponent: Comp;
  @Input() props: ComponentProps<Comp>;

  private root = createRoot(inject(ElementRef).nativeElement)

  ngOnChanges() {
    this.root.render(createElement(this.reactComponent, this.props))
  }

  ngOnDestroy() {
    this.root.unmount();
  }
}
```

#### 優點 ✅

- 可以不用透過 Custom Element 的方式去使用這些第三方元件

#### 缺點 ❌

- 如果有要整合更多的前端框架的元件，就要寫更多的 Angular Directive 去支援
- 如果沒定義 Shadow DOM 的話，樣式可能會被互相影響，必須注意！

### 解決方式 2

以前我們會在 Angular Library 透過 ngx-build-plus 來 Single Bundle 出一個 bundle.js，就可以透過 web-component-loader 去動態建立 Script Tag 去載入對應元件的 bundle.js

> 不過現在 esbuild 也可以實現在 Signle Bundle 的效果，理論上也可以應用在所有框架的元件上
> ```
> esbuild libs/thrid-widgets/super-grid-widget/src/lib/index.ts --bundle --minify --sourcemap --outfile=dist/portal/browser/thrid-widgets/super-grid-widget/bundle.js
> ```

但我們還需要降低這些元件的 bundle size，我們通常還會設定 externals，類似:

```javascript
const esbuild = require("esbuild");
const { externalGlobalPlugin } = require("esbuild-plugin-external-global");

esbuild.build({
  ...
  plugins: [
    externalGlobalPlugin({
      'react': 'window.React',
      'react-dom': 'window.ReactDOM',
      'jQuery': '$'
    })
  ]
  ...
});
```

只是記得設定 externals 之前，請先確保 window.xxx 真的有存在

通常我們是透過在 angular.json 設置 assets (input、output)，得到對應 xxx Library 的 umd.min.js 並在主專案上設定 `<script src="/assets/xxx/*.umd.min.js" >` 之類的，來確保 Web Component 能正常讀取得到 xxx Library

#### 優點 ✅

- 只要能拿到完整的 https://portal.my_domain.com/assets/thrid-widgets/super-grid-widget/bundle.js，我就可以隨意使用 super-grid-widget，前提要能滿足 externals 的那些條件

#### 缺點 ❌

- 因為變成多個 App 要打包，會需要 NX 指令 `nx run-many --target build --parallel` 加速打包
- 我想開發體驗來說，肯定沒有使用 dynamic import 來得好，除非現在 `nx build target --watch` 的速度真的很快的話，那也許還可以 XD

### 解決方式 3

Single SPA

https://single-spa.js.org/

> 我只有玩過簡單的範例專案，沒用在 production 上 ＸＤ

#### 優點 ✅

- 在 Micro-Frontend 小圈圈很流行（有幾個大神維護者）
- 文件很豐富（雖然有點混亂 / 細節壓倒性得多）
- 子應用包裝器小巧易用 parcel
  - https://single-spa.js.org/docs/parcels-overview#parcel-configuration
- 類似 CRA 的項目引導程式配置 webpack，應該是不用搞太多客製化的 webpack rule 或 plugins

#### 缺點 ❌

- 就是一個很高客製化的 Framework，有一定的學習曲線 XD
- 太多的 Webpack magic
- 依靠 SystemJS 將子應用程式腳本載入到父應用程式腳本中（SystemJS 不再那麼流行了，原生模組僅在 Webpack 5 中出現）
- 關於 CSS 的配置，好像在文件很少提到？
- 另外就是比較少聽到有朋友，真的在工作上有導入這套框架

## 請根據設計出來的架構嘗試回答題說明目中的「進階申論」問題

### 1. dashboard 團隊如何與 widget 團隊進行溝通 (如元件溝通介面設計、widget 如何註冊
進 dashboard 等)?

### 2. 整體架構上是否可能有效能問題 (performance issue),如果有預想到的問題,當真正發
生時該如何優化?

### 3. 如果遇到了效能問題,如何監控並證明問題來自 dashboard 開發團隊還是 widget 開發
團隊?

### 4. 原來的 grid widget 功能,希望能針對特定某個 column 呈現進行客製化,且 column
客製化也希望交由外部團隊開發;你會怎麼設計?

### 5. 如果 widget 之間需要有互相溝通的需求,例如 super-grid widget 特定欄位排序後,

### 6. 所有 grid 和 super-grid widget 只要有相同名稱欄位都需要排序;你會怎麼設計?

### 7. 任何其他想法或建議,自由發揮
