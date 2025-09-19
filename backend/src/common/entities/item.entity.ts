import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { List } from './list.entity';

export enum ItemType {
  GAME = 'game',
  MOVIE = 'movie',
  SERIES = 'series',
}

export enum ItemStatus {
  COMPLETED = 'completed',
  WANT_TO_PLAY_WATCH = 'want_to_play_watch',
  IN_PROGRESS = 'in_progress',
  DROPPED = 'dropped',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({
    type: 'text',
    enum: ItemType,
  })
  type: ItemType;

  @Column({
    type: 'text',
    enum: ItemStatus,
  })
  status: ItemStatus;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  releaseYear: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  rating: number;

  @Column({ length: 1000, nullable: true })
  notes: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  platform: string; // Para jogos: PS5, PC, Xbox, etc. Para filmes/séries: Netflix, Prime Video, etc.

  @ManyToOne(() => List, list => list.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listId' })
  list: List;

  @Column()
  listId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

