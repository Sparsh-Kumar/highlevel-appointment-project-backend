import { interfaces } from 'inversify';

export interface LooseObject {
  [key: string]: any
}

export enum MorganLoggingTypes {
  DEV = 'dev',
  COMBINED = 'combined',
  COMMON = 'common',
  TINY = 'tiny',
  SHORT = 'short',
}

export type MorganConfig = {
  format: MorganLoggingTypes,
  options?: LooseObject,
};

export type ApplicationOptions = {
  containerOptions: interfaces.ContainerOptions;
  morganConfig: MorganConfig;
};

export type DtoClass = {
  from: (requestBody: LooseObject) => LooseObject
};
