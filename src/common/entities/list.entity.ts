import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Item } from './item.entity';
import { User } from './user.entity';

export enum ListType {
  GAMES_PLAYED = 'games_played',
  GAMES_TO_PLAY = 'games_to_play',
  MOVIES_WATCHED = 'movies_watched',
  MOVIES_TO_WATCH = 'movies_to_watch',
  SERIES_WATCHED = 'series_watched',
  SERIES_TO_WATCH = 'series_to_watch',
}

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'text',
    enum: ListType,
  })
  type: ListType;

  @Column({ length: 500, nullable: true })
  description: string;

  @OneToMany(() => Item, item => item.list, { cascade: true })
  items: Item[];

  @ManyToOne(() => User, user => user.lists)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

