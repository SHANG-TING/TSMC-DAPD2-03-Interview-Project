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

type WidgetOptionsCollection = {
  grid: {
    headers?: GridWidgetHeader[];
    data?: GridWidgetData[];
  };
  text: {
    content?: string;
    color?: string;
    background?: string;
  };
};

interface GridWidgetData {
  name: string;
  role: string;
}

interface GridWidgetHeader {
  fieldId: keyof GridWidgetData;
  displayText: string;
}

interface WidgetPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}
