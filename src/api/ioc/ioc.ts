import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth-controller';
import { EventController } from '../controllers/event-controller';

const controllers: Array<new (...args: any[]) => any> = [AuthController, EventController];

function registerDependency<T>(classConstructor: { new (...args: any[]): T }[]) {
	classConstructor.forEach((controller) => {
		const className = controller.name;
		container.register(className, { useClass: controller });
	});
}

registerDependency(controllers);

export const authIOCContainer = container.resolve(AuthController);
export const eventIOCContainer = container.resolve(EventController);
