import { Worker } from 'bullmq';

class WorkerClient {
	public static createWorker(queueName: string, callback: any, options: any): Worker {
		return new Worker(queueName, callback, options);
	}
}
export default WorkerClient;
