export interface MindMapNode {
  id: string;
  label: string;
  link?: string;
  children?: MindMapNode[];
  color?: string;
}

export interface PositionedNode extends MindMapNode {
  x: number;
  y: number;
  depth: number;
  parentId?: string;
}
