import React from 'react';
import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { ReactFlowNodeProps } from './reactFlowNode/ReactFlowNode';
import ReactFlowEdge, { ReactFlowEdgeProps } from './reactFlowEdge/ReactFlowEdge';

// ---------------------------------------------------------------------------
// 1. UNIVERSAL PROPERTY PANEL PROPS
// Every property panel component must accept these standard props.
// Inside the specific panel (e.g., TrueFalseNodeProperties), you can cast 
// 'element' to the specific type (e.g., const node = element as TrueFalseNode;)
// ---------------------------------------------------------------------------
export type PolyglotNodePropertiesProps = {
  element: PolyglotNode;
  onUpdateElement: (updatedElement: PolyglotNode) => void;
};

export type PolyglotEdgePropertiesProps = {
  element: PolyglotEdge;
  onUpdateElement: (updatedElement: PolyglotEdge) => void;
};

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

// ---------------------------------------------------------------------------
// 2. INSTANTIATE THE MAPPINGS (Using the new Universal Props)
// ---------------------------------------------------------------------------
export const polyglotNodeComponentMapping = new PolyglotComponentMapping<
  PolyglotNodePropertiesProps,
  ReactFlowNodeProps,
  PolyglotNode
>();

export const polyglotEdgeComponentMapping = new PolyglotComponentMapping<
  PolyglotEdgePropertiesProps,
  ReactFlowEdgeProps,
  PolyglotEdge
>();

// ---------------------------------------------------------------------------
// 3. CENTRAL REGISTRY: IMPORT & REGISTER ALL CONFIGS
// By importing the configs here, Next.js guarantees they are loaded and 
// registered *before* the LateralMenu renders, fixing the empty state bug!
// ---------------------------------------------------------------------------

// UPDATED: Now importing directly from the folder thanks to index.ts
import { trueFalseNodeConfig } from '@/components/nodes/TrueFalse';
import { emotionAttributionANodeConfig } from './nodes/EmotionAttributionA';
import { emotionAttributionBNodeConfig } from './nodes/EmotionAttributionB';
import { emotionAttributionNodeConfig } from './nodes/EmotionAttribution';
import { eyesTaskNodeConfig } from './nodes/EyesTask';
import { fauxPasNodeConfig } from './nodes/FauxPas';
import { socialSituationsNodeConfig } from './nodes/SocialSituations';
import { theoryOfMindNodeConfig } from './nodes/TheoryOfMind';
import { containerNodeConfig } from './nodes/Container';
import { emotionRecognitionNodeConfig } from './nodes/EmotionRecognition';
// import { multipleChoiceConfig } from '@/components/nodes/MultipleChoice';
// import { customEdgeConfig } from '@/components/edges/CustomEdge';

polyglotNodeComponentMapping.registerMapping(trueFalseNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(emotionAttributionANodeConfig as any);
polyglotNodeComponentMapping.registerMapping(emotionAttributionBNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(emotionAttributionNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(eyesTaskNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(fauxPasNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(socialSituationsNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(theoryOfMindNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(containerNodeConfig as any);
polyglotNodeComponentMapping.registerMapping(emotionRecognitionNodeConfig as any);

// polyglotNodeComponentMapping.registerMapping(multipleChoiceConfig as any);
// polyglotEdgeComponentMapping.registerMapping(customEdgeConfig as any);

import { unconditionalEdgeConfig } from './edges/UnconditionalEdge';
import { conditionalEdgeConfig } from './edges/ConditionalEdge';
import { passFailEdgeConfig } from './edges/PassFailEdge';

// Register all edges dynamically
polyglotEdgeComponentMapping.registerMapping(unconditionalEdgeConfig);
polyglotEdgeComponentMapping.registerMapping(conditionalEdgeConfig);
polyglotEdgeComponentMapping.registerMapping(passFailEdgeConfig);