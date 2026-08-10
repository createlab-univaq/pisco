import React from 'react';
import { NodePropertiesProps } from './properties/nodes/NodeProperties';
import { EdgePropertiesProps } from './properties/edges/EdgeProperties';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { ReactFlowNodeProps } from './reactFlowNode/ReactFlowNode';
import { ReactFlowEdgeProps } from './reactFlowEdge/ReactFlowEdge';

// Golden Standard: Use React's native ComponentType instead of the old "bivariance hack"
type PropertiesComponent<T> = React.ComponentType<T>;
type ReactFlowComponent<T> = React.ComponentType<T>;

type TypeWithData = { data: unknown; type: string };

type MappingType<T, U, K extends TypeWithData, V extends TypeWithData> = {
  elementType: string;
  name: string;
  icon?: string;
  group?: string;
  platform?: string;
  propertiesComponent: PropertiesComponent<T>;
  elementComponent: ReactFlowComponent<U>;
  defaultData: K['data'] & V['data'];
  transformData?: (data: K) => K;
};

class PolyglotComponentMapping<T, U, K extends TypeWithData> {
  // Golden Standard: Use Record<string, Type> for dictionaries
  private _propertiesMapping: Record<string, PropertiesComponent<T>> = {};
  private _elementMapping: Record<string, ReactFlowComponent<U>> = {};
  private _nameMapping: Record<string, string> = {};
  private _iconMapping: Record<string, string | undefined> = {};
  private _defaulPlatformMapping: Record<string, string | undefined> = {};
  private _groupMapping: Record<string, string | undefined> = {};
  private _defaultDataMapping: Record<string, K['data']> = {};
  private _transformMapping: Record<string, (data: K) => K> = {};

  public registerMapping<V extends TypeWithData>({
    elementType,
    name,
    icon,
    group,
    platform,
    propertiesComponent,
    elementComponent,
    defaultData,
    transformData = (data) => data,
  }: MappingType<T, U, K, V>) {
    if (elementType in this._propertiesMapping) {
      throw new Error(`Element type ${elementType} is already registered`);
    }

    this._propertiesMapping[elementType] = propertiesComponent;
    this._elementMapping[elementType] = elementComponent;
    this._nameMapping[elementType] = name;
    this._iconMapping[elementType] = icon;
    this._defaulPlatformMapping[elementType] = platform;
    this._groupMapping[elementType] = group;
    this._defaultDataMapping[elementType] = defaultData;
    this._transformMapping[elementType] = transformData;
  }

  get propertiesMapping(): Readonly<Record<string, PropertiesComponent<T>>> {
    return this._propertiesMapping;
  }

  get componentMapping(): Readonly<Record<string, ReactFlowComponent<U>>> {
    return this._elementMapping;
  }

  get nameMapping(): Readonly<Record<string, string>> {
    return this._nameMapping;
  }

  get iconMapping(): Readonly<Record<string, string | undefined>> {
    return this._iconMapping;
  }

  get defaultPlatformMapping(): Readonly<Record<string, string | undefined>> {
    return this._defaulPlatformMapping;
  }

  get groupMapping(): Readonly<Record<string, string | undefined>> {
    return this._groupMapping;
  }

  get defaultDataMapping(): Readonly<Record<string, K['data']>> {
    return this._defaultDataMapping;
  }

  get transformMapping(): Readonly<Record<string, (data: K) => K>> {
    return this._transformMapping;
  }

  applyTransformFunction(element: K): K {
    const transformFunction = this._transformMapping[element.type];
    return transformFunction ? transformFunction(element) : element;
  }

  getElementPropertiesComponent(
    elementType: string | undefined
  ): PropertiesComponent<T> {
    if (!elementType) return () => <></>;
    return this._propertiesMapping[elementType] ?? (() => <></>);
  }
}

// FIXED: Exported individually after instantiation to prevent Temporal Dead Zone crashes
export const polyglotNodeComponentMapping = new PolyglotComponentMapping<
  NodePropertiesProps,
  ReactFlowNodeProps,
  PolyglotNode
>();

export const polyglotEdgeComponentMapping = new PolyglotComponentMapping<
  EdgePropertiesProps,
  ReactFlowEdgeProps,
  PolyglotEdge
>();