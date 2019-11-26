import { ModelNode } from './model-node';

export interface ModelFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  data: ModelNode;
}
