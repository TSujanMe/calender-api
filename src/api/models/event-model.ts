import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user-model';

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	startTime: Date;

	@Column()
	endTime: Date;

	@ManyToOne(() => User)
	creator: User;

	@Column()
	timezone: string;

	@Column({ nullable: true, type: 'text' })
	attendeeEmail: string[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;
}
