import { Worker } from 'bullmq';

class WorkerClient {
	public static createWorker(queueName: string, callback: any): Worker {
		return new Worker(queueName, callback);
	}
}
export default WorkerClient;
