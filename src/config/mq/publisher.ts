import { Job, Queue } from 'bullmq';
import Connection from './connection';
import { QueueLists } from '@base/constants/queue';

class Publisher {

	public static createQueue(queueName: QueueLists): Queue {
		return new Queue(queueName, { connection: Connection.getInstance().redisConnection });
	}

	public async addJob(queueInstance: any, data: any): Promise<Job> {
		return await queueInstance.add(data);
	}
}

export default Publisher;
