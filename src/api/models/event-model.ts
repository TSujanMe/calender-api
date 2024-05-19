import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user-model';

export interface AttendeeEmailInterface {
	email: string;
	email_sent: boolean;
}

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

	@Column({ nullable: true, type: 'json' })
	attendeeEmail: AttendeeEmailInterface[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;
}
