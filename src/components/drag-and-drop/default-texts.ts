import { DraggableTexts } from './draggable';

export const defaultTexts: Required<DraggableTexts> = {
  itemBeingDragged: 'Item is being dragged',
  dropPositionAvailable: 'Drop position available',
  pressToStartDragging: 'Press space bar to start dragging',
  itemPositionTemplate: 'Draggable item {index} of {total}',
  draggingStatusTemplate:
    'Item {draggedIndex} being dragged {direction} item {dragOverIndex}',
  draggableItemDescription: 'draggable item'
};
