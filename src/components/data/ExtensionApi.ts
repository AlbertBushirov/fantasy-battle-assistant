import { ICardItem, IOrder, ITehListEtem } from '../../types';
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
	getWarriorsItem(id: string): Promise<ICardItem> {
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
			image: imageUrl, // Обновленный путь для картинки
			description: descriptionHtml, // Обновленное описание
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
			...item,
			image: imageUrl, // Обновленный путь для картинки
		});
	}

	getWeaponsWheelsItem(id: string): Promise<ITehListEtem> {
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
			...item,
			image: imageUrl, // Обновленный путь для картинки
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
					image: imageUrl, // Обработанный путь для картинки
					description: descriptionHtml, // Обновленное описание
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
					image: imageUrl, // Обработанный путь для картинки
				};
			})
		);
	}

	getWeaponsWheelsList(): Promise<ITehListEtem[]> {
		return Promise.resolve(
			localWeaponsWheels.map((item) => {
				const imageUrl =
					item.image.startsWith('http') || item.image.startsWith('https')
						? item.image
						: `${process.env.PUBLIC_URL}${item.image}`;

				return {
					...item,
					image: imageUrl, // Обработанный путь для картинки
				};
			})
		);
	}

	orderCards(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
