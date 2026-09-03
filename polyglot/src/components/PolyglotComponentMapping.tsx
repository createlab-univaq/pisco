import React from 'react';
import { MappingType } from '@/types/ElementMappingTypes';

export class PolyglotComponentMapping<T, U, K extends { type: string }> {
    public propertiesMapping: Record<string, React.ComponentType<T>> = {};
    public componentMapping: Record<string, React.ComponentType<U>> = {};
    public nameMapping: Record<string, string> = {};
    public iconMapping: Record<string, string | undefined> = {};
    public isExerciseMapping: Record<string, boolean> = {};
    public defaultDataMapping: Record<string, any> = {};
    public transformMapping: Record<string, (data: K) => K> = {};

    public register(config: MappingType<T, U, K>) {
        if (this.propertiesMapping[config.elementType]) {
            throw new Error(`Element type ${config.elementType} is already registered`);
        }
        this.propertiesMapping[config.elementType] = config.propertiesComponent;
        this.componentMapping[config.elementType] = config.elementComponent;
        this.nameMapping[config.elementType] = config.name;
        this.iconMapping[config.elementType] = config.icon;
        this.isExerciseMapping[config.elementType] = config.isExercise || false;
        this.defaultDataMapping[config.elementType] = config.defaultData;
        this.transformMapping[config.elementType] = config.transformData || ((d) => d);
    }

    public registerMany(configs: MappingType<T, U, K>[]) {
        configs.forEach((config) => this.register(config));
    }

    public applyTransformFunction(element: K): K {
        const transformFunction = this.transformMapping[element.type];
        return transformFunction ? transformFunction(element) : element;
    }

    public getElementPropertiesComponent(elementType?: string): React.ComponentType<T> {
        if (!elementType) return () => <></>;
        return this.propertiesMapping[elementType] ?? (() => <></>);
    }
}