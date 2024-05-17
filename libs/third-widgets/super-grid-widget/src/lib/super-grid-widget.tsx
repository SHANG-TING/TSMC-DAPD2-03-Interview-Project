import React, { useEffect, useMemo, useState } from 'react';

import cx from 'classnames';
import { orderBy } from 'lodash-es';
import ReactDOM from 'react-dom/client';
import r2wc from 'react-to-webcomponent';
import styled, { StyleSheetManager } from 'styled-components';

import { GridWidgetData, Widget } from '@portal/data-access/models';

import { useCustomEvent } from './hooks/useCustomEvent';

type OrderData = {
  [key in keyof GridWidgetData]?: 'asc' | 'desc';
};

export interface R2WCBaseProps {
  container?: ShadowRoot;
}
export interface SuperGridWidgetProps extends R2WCBaseProps {
  data: Widget<'super-grid'>;
}

const StyledSuperGridWidget = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  .title {
    font-size: 1rem;
    font-weight: bold;
    height: 50px;
    display: flex;
    padding: 0 10px;
    align-items: center;
    border-bottom: 1px solid black;
  }
  .content {
    flex-grow: 1;
    overflow-y: auto;
  }

  table {
    width: 100%;
    border: 1px solid black;
    box-sizing: border-box;
    table-layout: fixed;
  }

  th,
  td {
    text-align: left;
    padding: 10px;
  }

  th {
    background-color: #3232c8;
    color: white;

    .sort-by {
      padding-right: 24px;
      position: relative;
    }
    .sort-by:before,
    .sort-by:after {
      border: 6px solid transparent;
      content: '';
      display: block;
      height: 0;
      right: 5px;
      top: 50%;
      position: absolute;
      width: 0;
    }
    .sort-by:before {
      border-bottom-color: #fff;
      margin-top: -12px;
    }
    .sort-by--asc:before {
      border-bottom-color: #c8c8c8;
    }
    .sort-by:after {
      border-top-color: #fff;
      margin-top: 3px;
    }
    .sort-by--desc:after {
      border-top-color: #c8c8c8;
    }
  }

  tbody td {
    background-color: #cdcdeb;
  }

  tbody tr:nth-child(even) td {
    background-color: #e6e6f5;
  }
`;

export function SuperGridWidget({ data, container }: SuperGridWidgetProps) {
  const filterData = useCustomEvent(container, 'gridFilterData');
  const [sortOrderData, setSortOrderData] = useState<OrderData>({});

  useEffect(() => {
    if (!data.options.sortableColumns?.length) return;
    setSortOrderData(
      data.options.sortableColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column]: 'asc',
        }),
        {}
      )
    );
  }, [data.options.sortableColumns]);

  const filetedDataItems = useMemo(() => {
    const dataItems = data.options.data ?? [];

    if (
      !filterData ||
      data.options.headers?.every(
        (header: { fieldId: string }) => !(header.fieldId in filterData)
      )
    ) {
      return dataItems;
    }

    return dataItems.filter((item) => {
      return Object.entries(filterData).every(([key, value]) =>
        item[key as keyof GridWidgetData]
          ?.toString()
          ?.toLowerCase()
          .includes(value?.toString()?.toLowerCase())
      );
    });
  }, [data.options.data, data.options.headers, filterData]);

  const sortedDataItems = useMemo(
    () =>
      orderBy(
        filetedDataItems,
        Object.keys(sortOrderData),
        Object.values(sortOrderData)
      ),
    [filetedDataItems, sortOrderData]
  );

  const handleSortChange = (fieldId: keyof GridWidgetData) => {
    setSortOrderData((prev) => ({
      ...prev,
      [fieldId]: prev[fieldId] === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <StyleSheetManager target={container}>
      <StyledSuperGridWidget>
        <div className="title">{data.title}</div>
        <div className="content">
          <table>
            <thead>
              <tr>
                {data.options.headers?.map((header) => (
                  <th key={header.fieldId}>
                    {header.fieldId in sortOrderData ? (
                      <div onClick={() => handleSortChange(header.fieldId)}>
                        <span
                          className={cx('sort-by', {
                            'sort-by--asc':
                              sortOrderData[header.fieldId] === 'asc',
                            'sort-by--desc':
                              sortOrderData[header.fieldId] === 'desc',
                          })}
                        >
                          {header.displayText}
                        </span>
                      </div>
                    ) : (
                      header.displayText
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedDataItems.map((item, i) => (
                <tr key={i}>
                  {data.options.headers?.map((header) => (
                    <td key={header.fieldId}>{item[header.fieldId]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StyledSuperGridWidget>
    </StyleSheetManager>
  );
}

export function definedCustomElement() {
  const tagName = 'super-grid-widget';

  if (customElements.get(tagName)) {
    return;
  }

  const superGridWidget = r2wc(SuperGridWidget, React, ReactDOM, {
    props: {
      data: 'json',
    },
    shadow: 'open',
  });
  customElements.define(tagName, superGridWidget);
}

export default SuperGridWidget;
