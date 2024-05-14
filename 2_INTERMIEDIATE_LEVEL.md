# 2 Intermediate Level

> 因為後續的題目，一樣會在這 repo 持續更新，所以如果只想單純驗證 2 Intermediate Level
 的功能有沒有實現的話，麻煩請先切換 feature/2-intermidiate-level 分支
> ```
> git checkout feature/2-intermidiate-level
> ```

## 新功能的設計方式

### 1. 建立 DashboardService 且定義 gridFilterData$

並把 DashboardService 加入到 DashboardComponent 的 Providers 裡（確保 DI Scope 只有 DashboardComponent 裡面）

```typescript
@Injectable()
export class DashboardService {
  gridFilterChange$ = new BehaviorSubject<Partial<GridWidgetData>>({
    name: '',
  });
}

@Component({
  // ...
  providers: [DashboardService]
})
export class DashboardComponent {
  // ...
  #dashboardService = inject(DashboardService);
}
```

### 2. 建立 GridFilterDialog 且使用 ReactiveForm 實作表單

```html
<form [formGroup]="form">
  <input type="text" formControlName="name" />
  <button class="button" (click)="onSubmit()">Filter</button>
</form>
```

### 3. 在 DashboardComponent 使用 CDK 提供的 DialogService 去打開 GridFilterDialog，且訂閱 Closed Observable，並根據回傳資料來更新 DashboardService 的 gridFilterData$

```typescript
@Component({
  // ...
  template: `
    ...
    <button (click)="openGridFilterDialog()">
      Filter By Name
    </button>
  `
})
export class DashboardComponent {
  // ...
  openGridFilterDialog() {
    const { gridFilterChange$ } = this.#dataService;
    const dialogRef = this.#dialog.open<Partial<GridWidgetData>>(
      AppGridFilterDialogComponent,
      {
        minWidth: '300px',
        data: gridFilterChange$.value,
        disableClose: true,
      }
    );
    dialogRef.closed.subscribe((data) => {
      if (!data) return;
      gridFilterChange$.next({
        ...gridFilterChange$.value,
        ...data,
      });
    });
  }
}
```

> 這邊也可以自己做一個 DialogService (使用 CDK 的 Overlay 和 Portal 實現一樣的效果)
> ```typescript
> import { Overlay, ComponentType } from '@angular/cdk/overlay';
> import { ComponentPortal } from '@angular/cdk/portal';
> import { Injectable, Injector, inject } from '@angular/core';
> 
> import { DialogRef } from './dialog-ref';
> import { DIALOG_DATA } from './dialog-tokens';
> 
> export interface DialogConfig {
>   data?: any;
> }
> 
> @Injectable({
>   providedIn: 'root',
> })
> export class DialogService {
>   #overlay = inject(Overlay);
>   #injector = inject(Injector);
> 
>   /**
>    * Open a custom component in an overlay
>    */
>   open<T>(component: ComponentType<T>, config?: DialogConfig): DialogRef {
>     // Globally centered position strategy
>     const positionStrategy = this.#overlay
>       .position()
>       .global()
>       .centerHorizontally()
>       .centerVertically();
> 
>     // Create the overlay with customizable options
>     const overlayRef = this.#overlay.create({
>       positionStrategy,
>       hasBackdrop: true,
>       backdropClass: 'overlay-backdrop',
>       panelClass: 'overlay-panel',
>     });
> 
>     // Create dialogRef to return
>     const dialogRef = new DialogRef(overlayRef);
> 
>     // Create injector to be able to reference the DialogRef from within the component
>     const injector = Injector.create({
>       parent: this.#injector,
>       providers: [
>         { provide: DialogRef, useValue: dialogRef },
>         { provide: DIALOG_DATA, useValue: config?.data },
>       ],
>     });
> 
>     // Attach component portal to the overlay
>     const portal = new ComponentPortal(component, null, injector);
>     overlayRef.attach(portal);
> 
>     return dialogRef;
>   }
> }
> ```

### 4. 而 GridWidget 因為有訂閱 DashboardService 的 gridFilterData$，所以當資料有異動的話，會過濾當前 widget 的 options.data，並同步更新畫面上的 Data Rows

```typescript
@Component({
  // ...
  template: `
    ...
    <table>
      ...
      <tbody>
        @if (dataItems$ | async; as dataItems) {
          @for(item of dataItems; track $index) {
          <tr>
            @for (header of data.options.headers; track header.fieldId) {
            <td>{{ item?.[header.fieldId] }}</td>
            }
          </tr>
          }
        }
      </tody>
    </table>
  `
})
export class GridWidgetComponent {
  // ...
  dataItems$ = this.#dashboardService.gridFilterChange$.pipe(
    map((filterData) => {
      const dataItems = this.data.options.data ?? [];

      if (
        this.data.options.headers?.every(
          (header) => !(header.fieldId in filterData)
        )
      ) {
        return dataItems;
      }

      if (Object.values(filterData).every((value) => !value)) {
        return dataItems;
      }

      return dataItems.filter((item) => {
        return Object.entries(filterData).every(([key, value]) =>
          item[key as keyof GridWidgetData]
            ?.toLowerCase()
            .includes(value?.toLowerCase())
        );
      });
    })
  );
}
```

> 如果想優化過濾性能，可以搭配 RxJS Operators
> 
> 像是 `distinctUntilChanged` 可以 skip 掉重複的過濾資料
>
> 常見的還有 `debounceTime`，但我想不太適合這個場景，它還是比較適合像是 input 事件（觸發頻率高的狀況）

### 5. 最終呈現的效果

![2024-05-13 00 54 56](https://github.com/SHANG-TING/TSMC-DAPD2-03-Interview-Project/assets/12579766/f90b34a1-a225-48d1-bf50-6b40679cae03)

## 是否有想過其他解決方式?如果有請說明不同方式及優缺點

### 1. 不需建立額外的 DashboardService，其實 GridFilterDialog 也可以透過 DI 直接取得 DashboardComponent 的 Property

✅ 如果資料很少的話，少一個 service 也許相對簡潔？

❌ 我認為資料面的物件，可以統一到 Service 裡面，另外考慮之後要整合 Custom Element 的話，我會把 DashboardService 塞到每個 Custom Element 的 Property。

### 2 不需要特別定義 gridFilterData$ (Observable)，用一般的 Object 即可，可以透過 @input() 傳給 GridWidget（他可以透過 @Input() 的 setter 或者 ngOnChange 來偵測資料異動)

✅ 如果團隊比較少人在寫 RxJS，而幾乎都是 Signals 教徒的話? 可能就按照團隊的風格為主吧 XD

❌ 我喜歡 RxJS！我認為使用 Observable 可以很直觀的控制資料流，相對可維護性高、可擴充性也高 (也能使用 Async Pipe 來 Binding Template)

> 但如果同時有多處使用 Async Pipe 來 Binding Template 時，可能要配置 `shareReply` 之類 rxjs operators，將其轉換成 Hot Observable 來避免一些重複打 API 或運算的部分。
