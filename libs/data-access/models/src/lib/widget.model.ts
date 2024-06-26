export interface Widget<
  Type extends keyof WidgetOptionsCollection = keyof WidgetOptionsCollection
> {
  id: string;
  title: string;
  type: Type;
  position: WidgetPosition;
  options: WidgetOptionsCollection[Type];
}

export interface WidgetOptionsCollection {
  grid: {
    headers?: GridWidgetHeader[];
    data?: GridWidgetData[];
  };
  ['super-grid']: {
    headers?: GridWidgetHeader[];
    data?: GridWidgetData[];
    sortableColumns?: Array<keyof GridWidgetData>;
  };
  text: {
    content?: string;
    color?: string;
    background?: string;
  };
}

export interface GridWidgetData {
  name?: string;
  role?: string;
  age?: number;
  step?: string;
  result?: string;
}

export interface GridWidgetHeader {
  fieldId: keyof GridWidgetData;
  displayText: string;
}

export interface WidgetPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}
