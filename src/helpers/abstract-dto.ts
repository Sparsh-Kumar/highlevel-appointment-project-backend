import { LooseObject } from './types';

export default abstract class BaseDto {
  public abstract from(
    data: LooseObject
  ): Promise<LooseObject> | never;
}
