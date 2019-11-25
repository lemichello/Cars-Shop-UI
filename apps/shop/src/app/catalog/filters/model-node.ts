export interface ModelNode {
  id: number;
  name: string;
  isModel: boolean;
  models?: ModelNode[];
}
