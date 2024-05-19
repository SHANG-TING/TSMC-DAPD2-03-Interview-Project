import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GridWidgetData, Widget } from '@portal/data-access/models';

import { GridboxComponent } from '../../shared/ui/gridbox/gridbox.component';
import { GridboxConfig } from '../../shared/ui/gridbox/gridbox.interface';
import { DashboardService } from './dashboard.service';
import { AppGridFilterDialogComponent } from './dialog/grid-filter-dialog.component';
import { ThirdWidgetLoaderComponent } from './ui/third-widget-loader/third-widget-loader.component';
import { GridWidgetComponent } from './widgets/grid-widget/grid-widget.component';
import { TextWidgetComponent } from './widgets/text-widget/text-widget.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2>dashboard works!</h2>
    <button
      data-e2e-id="add-grid-widget-button"
      (click)="addGridWidget()"
      style="margin: 10px 0;"
    >
      Add Grid Widget
    </button>
    <button
      data-e2e-id="add-text-widget-button"
      (click)="addTextWidget()"
      style="margin: 10px 0;"
    >
      Add Text Widget
    </button>
    <button
      class="button"
      style="float: right"
      (click)="openGridFilterDialog()"
    >
      Filter By Name
    </button>
    <app-gridbox [config]="config">
      <ng-template #widget let-data>
        @defer (when data.type === 'text') {
        <app-text-widget [data]="data"></app-text-widget>
        } @defer (when data.type === 'grid') {
        <app-grid-widget [data]="data"></app-grid-widget>
        } @if (data.type === 'super-grid') {
        <app-third-widget-loader
          tagName="super-grid-widget"
          [attrs]="{ data }"
        ></app-third-widget-loader>
        }
      </ng-template>
    </app-gridbox>
  `,
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GridboxComponent,
    TextWidgetComponent,
    GridWidgetComponent,
    ThirdWidgetLoaderComponent,
    DialogModule,
  ],
  providers: [DashboardService],
})
export class DashboardComponent {
  config: GridboxConfig = {
    widgets: [
      {
        id: 'widget-01',
        title: 'Grid 1',
        type: 'grid',
        position: {
          left: 0,
          top: 0,
          width: 12,
          height: 4,
        },
        options: {
          headers: [
            { fieldId: 'name', displayText: 'User Name' },
            { fieldId: 'role', displayText: 'User Role' },
          ],
          data: [
            { name: 'Mike', role: 'Engineer' },
            { name: 'Jeff', role: 'Engineer' },
          ],
        },
      },
      {
        id: 'custom-widget-01',
        title: 'Super Grid 1',
        type: 'super-grid',
        position: {
          left: 0,
          top: 5,
          width: 5,
          height: 4,
        },
        options: {
          headers: [
            { fieldId: 'name', displayText: 'Name' },
            { fieldId: 'age', displayText: 'Age' },
          ],
          data: [
            { name: 'Mike', age: 38 },
            { name: 'Hao', age: 18 },
          ],
          sortableColumns: ['age'],
        },
      },
      {
        id: 'widget-03',
        title: 'Grid 3',
        type: 'grid',
        position: {
          left: 7,
          top: 5,
          width: 5,
          height: 4,
        },
        options: {
          headers: [
            { fieldId: 'step', displayText: 'Step' },
            { fieldId: 'result', displayText: 'Result' },
          ],
          data: [
            { step: 'Create', result: 'Pass' },
            { step: 'Validate', result: 'Fail' },
          ],
        },
      },
    ],
  };

  #dialog = inject(Dialog);
  #dataService = inject(DashboardService);

  addGridWidget() {
    const addedGridWidget: Widget<'grid'> = {
      id: 'widget-04',
      title: 'Grid 4',
      type: 'grid',
      position: {
        left: 6,
        top: 10,
        width: 3,
        height: 4,
      },
      options: {
        headers: [
          { fieldId: 'name', displayText: 'User Name' },
          { fieldId: 'role', displayText: 'User Role' },
        ],
        data: [
          { name: 'Jeff', role: 'Engineer' },
          { name: 'Declan', role: 'Engineer' },
        ],
      },
    };

    if (this.config.widgets.some((w) => w.id === addedGridWidget.id)) return;

    this.config = {
      ...this.config,
      widgets: [...this.config.widgets, addedGridWidget],
    };
  }

  addTextWidget() {
    const addedTextWidget: Widget<'text'> = {
      id: 'widget-05',
      title: 'Text 1',
      type: 'text',
      position: {
        left: 0,
        top: 10,
        width: 3,
        height: 3,
      },
      options: {
        content: 'Good night.',
        color: 'yellow',
        background: '#666',
      },
    };

    if (this.config.widgets.some((w) => w.id === addedTextWidget.id)) return;

    this.config = {
      ...this.config,
      widgets: [...this.config.widgets, addedTextWidget],
    };
  }

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
