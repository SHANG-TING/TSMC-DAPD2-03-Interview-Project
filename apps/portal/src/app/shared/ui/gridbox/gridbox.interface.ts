export interface GridboxConfig {
  widgets: Widget[];
}

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
  text: {
    content?: string;
    color?: string;
    background?: string;
  };
}

export interface GridWidgetData {
  name?: string;
  role?: string;
  age?: string;
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
