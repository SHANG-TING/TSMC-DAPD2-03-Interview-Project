import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { createHostFactory, SpectatorHost } from '@ngneat/spectator';

import { GridboxComponent } from './gridbox.component';
import { GridboxConfig } from './gridbox.interface';

@Component({
  selector: 'app-gridbox-host',
})
class GridboxHostComponent {
  config: GridboxConfig = {
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

const createHost = createHostFactory({
  component: GridboxComponent,
  host: GridboxHostComponent,
});

describe('Test GridboxComponent', () => {
  let spectator: SpectatorHost<GridboxComponent, GridboxHostComponent>;

  beforeEach(() => {
    spectator = createHost(`<app-gridbox [config]="config"></app-gridbox>`);
  });

  test('should render correctly gridbox rows with config props', () => {
    const rowElements = spectator.queryAll<HTMLElement>('.gridbox-row');
    expect(rowElements).toHaveLength(6);
    expect(rowElements?.[0]?.style?.height).toBe('50px');
  });

  test('should render 12 gridbox columns initially', () => {
    const columnElements = spectator.queryAll('.gridbox-column');
    expect(columnElements).toHaveLength(12);
  });

  test.each([480, 720, 1280])(
    'should adjust gridbox column transforms on resize (%spx)',
    (clientWidth) => {
      const columnElements = spectator.debugElement.queryAll(
        By.css('.gridbox-column')
      );
      const clientWidthSpy = jest.spyOn(
        spectator.debugElement.nativeElement,
        'clientWidth',
        'get'
      );

      clientWidthSpy.mockReturnValue(clientWidth);
      spectator.component.onResize();
      spectator.detectChanges();

      expect(columnElements.at(1)?.styles['transform']).toContain(
        `translateX(${clientWidth / 12}px)`
      );
      expect(columnElements.at(-1)?.styles['transform']).toContain(
        `translateX(${(clientWidth / 12) * 11}px)`
      );
    }
  );
});
