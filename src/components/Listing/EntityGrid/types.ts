import type { Entity, EntityType } from '@/views/ListingView/types';

export interface Props {
  entites: Array<Entity>;
  type: EntityType;
  loading: boolean;
}
