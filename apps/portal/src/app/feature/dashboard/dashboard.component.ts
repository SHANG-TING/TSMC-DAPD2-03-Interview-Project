import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GridboxComponent } from '../../shared/ui/gridbox/gridbox.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2>dashboard works!</h2>
    <app-gridbox [config]="config">
      <ng-template #widget let-data>
        {{ data | json }}
      </ng-template>
    </app-gridbox>
  `,
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GridboxComponent,
  ],
})
export class DashboardComponent {
  config = {
    widgets: [
      {
        id: 'widget-01',
        title: 'Grid 1',
        type: 'grid',
        position: {
          left: 0,
          top: 0,
          width: 6,
          height: 3,
        },
        options: {
          headers: [
            { fieldId: 'name', displayText: 'User Name' },
            { fieldId: 'role', displayText: 'User Role' },
          ],
          data: [{ name: 'Mike', role: 'Engineer' }],
        },
      },
      {
        id: 'widget-02',
        title: 'Text 1',
        type: 'text',
        position: {
          left: 0,
          top: 3,
          width: 3,
          height: 3,
        },
        options: {
          content: 'Hello World',
          color: 'white',
          background: '#f00',
        },
      },
    ],
  };
}
