import {
	ICardItem,
	IListItem,
	IOrder,
	ITehListEtem,
	ITehListWheelsEtem,
	IFightingMachineItem,
} from '../../types';
import { Api } from '../base/api';
import { localArmy } from '../../types/warriorsData';
import { localWeapons, localWeaponsWheels } from '../../types/weaponsData';
import { localfightMachine } from '../../types/fightMachineData';

interface IOrderResult {
	id: string;
	total: number;
}

interface IAuctionAPI {
	getWarriorsList: () => Promise<ICardItem[]>;
	getWarriorsItem: (id: string) => Promise<ICardItem>;
	orderCards: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekAPI extends Api implements IAuctionAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Функция для обработки путей изображений в description
	getWarriorsItem(id: string): Promise<IListItem> {
		const item = localArmy.find((i) => i.id === id);
		if (!item) {
			return Promise.reject('Item not found');
		}

		const descriptionHtml =
			item.description.startsWith('http') ||
			item.description.startsWith('https')
				? item.description
				: `${process.env.PUBLIC_URL}${item.description}`;

		// Обрабатываем описание с картинками
		const imageUrl =
			item.image.startsWith('http') || item.image.startsWith('https')
				? item.image
				: `${process.env.PUBLIC_URL}${item.image}`;

		return Promise.resolve({
			...item,
			type: 'list',
			image: imageUrl,
			description: descriptionHtml,
		});
	}

	getWeaponsItem(id: string): Promise<ITehListEtem> {
		const item = localWeapons.find((i) => i.id === id);
		if (!item) {
			return Promise.reject('Item not found');
		}

		// Обрабатываем описание с картинками
		const imageUrl =
			item.image.startsWith('http') || item.image.startsWith('https')
				? item.image
				: `${process.env.PUBLIC_URL}${item.image}`;

		return Promise.resolve({
			type: 'tech',
			...item,
			image: imageUrl,
		});
	}

	getWeaponsWheelsItem(id: string): Promise<ITehListWheelsEtem> {
		const item = localWeaponsWheels.find((i) => i.id === id);
		if (!item) {
			return Promise.reject('Item not found');
		}

		// Обрабатываем описание с картинками
		const imageUrl =
			item.image.startsWith('http') || item.image.startsWith('https')
				? item.image
				: `${process.env.PUBLIC_URL}${item.image}`;

		return Promise.resolve({
			type: 'wheels',
			...item,
			wheelsPrice: 10,
			isWheels: false,
			image: imageUrl,
		});
	}

	getFightingMachineItem(id: string): Promise<IFightingMachineItem> {
		const item = localfightMachine.find((i) => i.id === id);
		if (!item) {
			return Promise.reject('Item not found');
		}

		// Обрабатываем описание с картинками
		const imageUrl =
			item.image.startsWith('http') || item.image.startsWith('https')
				? item.image
				: `${process.env.PUBLIC_URL}${item.image}`;

		return Promise.resolve({
			type: 'machine',
			...item,
			weapons: item.weapons.map((weapon) => ({ ...weapon, quantity: 0 })),
			image: imageUrl,
		});
	}

	getWarriorsList(): Promise<ICardItem[]> {
		return Promise.resolve(
			localArmy.map((item) => {
				const descriptionHtml =
					item.description.startsWith('http') ||
					item.description.startsWith('https')
						? `<img src="${item.description}" alt="Description Image">`
						: item.description;

				const imageUrl =
					item.image.startsWith('http') || item.image.startsWith('https')
						? item.image
						: `${process.env.PUBLIC_URL}${item.image}`;

				return {
					...item,
					type: 'list',
					image: imageUrl,
					description: descriptionHtml,
				};
			})
		);
	}

	getWeaponsList(): Promise<ITehListEtem[]> {
		return Promise.resolve(
			localWeapons.map((item) => {
				const imageUrl =
					item.image.startsWith('http') || item.image.startsWith('https')
						? item.image
						: `${process.env.PUBLIC_URL}${item.image}`;

				return {
					...item,
					type: 'tech',
					image: imageUrl, // Обработанный путь для картинки
				};
			})
		);
	}

	getWeaponsWheelsList(): Promise<ITehListWheelsEtem[]> {
		return Promise.resolve(
			localWeaponsWheels.map((item) => {
				const imageUrl =
					item.image.startsWith('http') || item.image.startsWith('https')
						? item.image
						: `${process.env.PUBLIC_URL}${item.image}`;

				return {
					...item,
					type: 'wheels',
					wheelsPrice: 10,
					image: imageUrl, // Обработанный путь для картинки
				};
			})
		);
	}

	getFightingMachineList(): Promise<IFightingMachineItem[]> {
		return Promise.resolve(
			localfightMachine.map((item) => {
				const imageUrl =
					item.image.startsWith('http') || item.image.startsWith('https')
						? item.image
						: `${process.env.PUBLIC_URL}${item.image}`;

				return {
					type: 'machine',
					...item,
					weapons: item.weapons.map((weapon) => ({
						...weapon,
						quantity: 0,
					})),
					image: imageUrl,
				};
			})
		);
	}

	orderCards(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
