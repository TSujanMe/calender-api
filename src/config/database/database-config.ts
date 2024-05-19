import { Event } from '@base/api/models/event-model';
import { User } from '@base/api/models/user-model';
import { DataSource } from 'typeorm';

const appDataSource = new DataSource({
	type: 'sqlite',
	database: 'database.sqlite',
	synchronize: true,
	logging: false,
	entities: [User, Event],
	subscribers: [],
});

export default appDataSource;
