# 3. Advanced Level

## 整體架構的設計方向

這次主要是以 dynamic import 的方式，而不是以動態建立 script tag 的方式去載入第三方元件

> 另外 dynamic import 也可以隨時搭配 Module Federation 定義 remoteEntry.js 來搭配，但這次只是單純 lazy-load 同 domain 的 chunk.js 而已。

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

```typescript
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
>
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

### 1. dashboard 團隊如何與 widget 團隊進行溝通 (如元件溝通介面設計、widget 如何註冊進 dashboard 等)?

#### Step 1

可以先用 nx generate library （記得選前端框架）建立一個 Library，然後一定要定義且 export 出來一個名為 definedCustomElement 的 Function

```typescript
export function definedCustomElement() {
  const tagName = 'xxx-thrid-widget';

  if (customElements.get(tagName)) {
    return;
  }

  const xxxThridWidget = r2wc(XxxThridWidget, React, ReactDOM, {
    props: {
      data: 'json',
    },
    shadow: 'open',
  });
  customElements.define(tagName, xxxThridWidget);
}
```

#### Step 2

目前實作來說，我是先在 thrid-widget-loader.component.ts 有定義 `THIRD_WIDGET_MAP` 來存放 dynamic import function by tag name 的資訊

```typescript
const THIRD_WIDGET_MAP = {
  'super-grid-widget': async () =>
    (
      await import('@portal/third-widgets/super-grid-widget')
    ).definedCustomElement(),

  // Add more third widgets ...
} as const;
```

> 但 `THIRD_WIDGET_MAP` 其實可以抽到 `@portal/shared/constants` 之類的 Library 

#### Step 3

在 Dashboard Component 可以直接 by widget type 來透過 thrid-widget-loader 來載入對應的 custom element

```html
<app-gridbox [config]="config">
  <ng-template #widget let-data>
    @if (thridWidgetTypes.includes(widget.type)) {
      <app-third-widget-loader
        [tagName]="getTagNameByType(widet.type)"
        [attrs]="{ data }"
      ></app-third-widget-loader>
    } @else {
      @defer (when data.type === 'text') {
        <app-text-widget [data]="data"></app-text-widget>
      }
      @defer (when data.type === 'grid') {
        <app-grid-widget [data]="data"></app-grid-widget>
      }
    }
  </ng-template>
</app-gridbox>
```

> 這邊稍微簡化一下代碼，這應該跟 Repo 的 Code 不一樣，沒有 thridWidgetTypes 跟 getTagNameByType
> 
> 但我只是想要表達，其實我們整合 thrid widgets 只需要走到 Step 2 的流程就可以了！
>
> 不需要每次新增 thrid widget 都要來改這邊的 template

### 2. 整體架構上是否可能有效能問題 (performance issue),如果有預想到的問題,當真正發生時該如何優化?

#### Q1. 最常見的問題，實際渲染的 Widget 太多，造成畫面卡頓

基本上可以搭配 Intersection Observer，去偵測 grid-item 出現在可視範圍內，才去載入 ng-template，所以這可以直接 gridbox 元件上直接優化

> ⭐️ 另外可以使用 CSS 属性 [content-visibility](https://web.dev/content-visibility/) 和 [contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain)
> 
> `content-visibility:auto` 定義如果該元素當前不在可視窗內，則不會渲染其後代元素，類似 DOM 的懶渲染;
> 
> 此屬性可以應用在 DOM 樹嵌套較深及節點數量繁重的長列表中，可以節省 Rendering 時間，優化 DOMContentLoaded 指標;
>
> ```css
> .gridbox-item-wrapper {
>   content-visibility: auto;
>   contain-intrinsic-size: 200px;
> }
> ```
>
> ![image](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/d19ad036-a80a-4ef8-96bf-763b01f06b23)
>
> contain 屬性允許我們指定特定的 DOM 元素和它的子元素，讓它們能夠獨立於整個 DOM 樹結構之外。目的是能夠讓瀏覽器有能力只對部分元素進行重繪、重排，而不必每次都針對整個頁面。
> 
> ```css
> .gridbox-item-content {
>   contain: layout; // 聲明當前元素裡面的佈局不會受外部的元素影響;
>   contain: paint;  // 聲明子元素不會渲染在邊界以外，如果在屏幕以外，瀏覽器就不需要渲染它包含的元素
>   contain: content; // 等同於 contain: layout paint;
> }
> ```
>
> 🔥 基本上 CSS 技巧，也可以通用到每個 Widget 裡面去配置，我覺得很棒的技巧（如果又用 tailwindcss 的話，使用起來更方便～）

#### Q2. 遇到頁面卡頓的話，有可能是某處 JS Long Task 的問題

如果我們在畫面上操作會卡卡的話，可以先打開 DevTools 的 Performance 觀察一下，有沒有什麼黑魔法 JS 在搞鬼

只是這也只能快速幫你查到是哪個 js 有這問題，實際上要解決這個問題，還是需要細看裡面的資料流和邏輯，具體要怎麼把 Long Task 切小，這真的要看情況...

因為就算我們懂得配置 debounce、distinctuntilchanged、throttle、bufferTime、exhaustMap、animationframescheduler 等等，不知道邏輯切入點，還是白搭 QQ

所以這題只能根據實際上遇到去做對應的優化這樣，沒有正確答案 orz

![image](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/92dfe37e-7a93-4860-bcb8-fc4cdc668bd4)

> ⭐️ 推薦好文，避免 long tasks 才能讓 main thread 一直被 block
>
> 之前一直沒有看順眼的作法，不過這篇文章最後的 schedule API 給讚 👍
>
> https://web.dev/articles/optimize-long-tasks

### 3. 如果遇到了效能問題,如何監控並證明問題來自 dashboard 開發團隊還是 widget 開發團隊?

通常我們都會是使用 Sentry 來監控

- Dashboard 要有自己的例外處理，會丟 Event 或 Exception 到 Sentry (有自己 Component、Type Event Type、Exception Type)
- Widget 也要有自己的例外處理，會丟 Event 或 Exception 到 Sentry（有自己 Component、Type Event Type、Exception Type)

這樣我們就可以在 Sentry 後台，可以透過這些 Type 來去辨識是問題來自己哪裡

> 其實通常 Event Payload 還會有一個 track_id 之類的，要能知道整個事件的流 ＸＤ

### 4. 原來的 grid widget 功能,希望能針對特定某個 column 呈現進行客製化,且 column 客製化也希望交由外部團隊開發;你會怎麼設計?

基本上善用 Structural Direcitve 和 ContentChild 以及呼叫 ViewContainer 的 createEmbeddedView(...) 塞 context，應該就能完美實現整個功能。

```html
<app-grid-widget [data]="data">

  <app-grid-cell name="role" *appGridCellDef="let columnData">

    <app-third-widget-loader
      tagName="app-grid-role"
      [attrs]="{
        value: columnData.value 
      }"
    ></app-third-widget-loader>

  </app-grid-cell>

</app-grid-widget>
```

> 有需要我實作的話，我可以再補上～

### 5. 如果 widget 之間需要有互相溝通的需求,例如 super-grid widget 特定欄位排序後, 所有 grid 和 super-grid widget 只要有相同名稱欄位都需要排序; 你會怎麼設計?

其實目前 Repo 上，因爲 super-grid widget 是直接讀 shadowRoot.host.dashboardService 的 gridSortChange$，所以現有的 grid widget 也可以直接訂閱 dashboardService 的 gridSortChange$ 來實現同步排序效果

```html
<tbody>
  @if (sortedItems$ | async; as dataItems) {
    @for(item of dataItems; track $index) {
      <tr>
        @for (header of data.options.headers; track header.fieldId) {
          <td>{{ item?.[header.fieldId] }}</td>
        }
      </tr>
    }
  }
</tbody>
```

```typescript
  filteredItems$ = this.#dashboardService.gridFilterChange$.pipe(
    // ...
  );

  sortedItems$ = this.filteredItems$.pipe(
    switchMap((dataItems) =>
      this.#dashboardService.gridSortChange$.pipe(
        map((sortOrderData) =>
          orderBy(
            dataItems,
            Object.keys(sortOrderData),
            Object.values(sortOrderData)
          )
        )
      )
    )
  );
```

### 6. 任何其他想法或建議,自由發揮

#### a. 選擇適合自己的微前端架構

之前實作微前端專案的經驗，會遇到客戶他們已經有很多穩定的專案，但可能那是 JSP 或者 ASP.NET MVC 專案，結果後來折衷解法是，舊專案還是以 iframe 跟 postMessage 來進行整合，哈哈 🫠

> 所以我覺得微前端並沒有什麼架構是最為理想的，真的也是跟著需求或者開發的組織文化，一直迭代下去，找到一個相對適合的架構去開發，所以之前也有因為這樣，而寫一篇小小心得 XD
> 
> https://blog.neilxie.net/posts/choose_the_right_micro-frontend_architecture_for_you

#### b. 想補充關於 Web Vitals 的部分 (因為上面有提到 Performance 的問題，想說補充小東西)

**CSS 動畫，其實有很多陷阱，以網站一打開，就會一個元件有簡單地淡入淡出的效果**

下面這段 LCP 會是 0 分

```css
.slider {
  opacity: 0;
}
.slider.slider--show {
  opacity: 1;
  translate: opacity 0.3s ease-in-out;
}
```

但是如果只把 opacity 從 0 改成 0.01 就可以提前/修復 LCP 的觸發時間

https://www.debugbear.com/blog/opacity-animation-poor-lcp

```css
.slider {
  opacity: 0;
}
```



