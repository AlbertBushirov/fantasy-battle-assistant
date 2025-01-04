import { FormErrors, ICardItem, IProductItem } from '../../types';
import { Model } from '../base/Model';

//Изменение каталога
export type CatalogChangeEvent = {
	catalog: ICardItem;
};

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export class AppData extends Model<IProductItem> {
	basket: ICardItem[] = [];
	items: ICardItem[];
	order: IOrderForm = {
		payment: '',
		email: '',
		phone: '',
		address: '',
	};
	preview: string | null;
	formErrors: FormErrors = {};

	//Добавить товар в корзину
	addBasket(item: ICardItem) {
		if (this.basket.indexOf(item) < 0) {
			this.basket.push(item);
			this.updateBasket();
		}
	}

	//Проверка, находится ли продукт в заказе.
	productOrder(item: ICardItem): boolean {
		return Boolean(this.basket.find((basketItem) => basketItem.id === item.id));
	}

	//Очистить корзину после заказа
	clearBasket() {
		this.basket = [];
		this.updateBasket();
	}

	//очистка заказа
	clearOrder() {
		this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	//Обновить корзину
	updateBasket() {
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket); // Обновление корзины
		this.emitChanges('catalog:changed', this.items); // Обновляем каталог
	}

	//Удаление продукта из корзины
	removeFromBasket(id: string) {
		this.basket = this.basket.filter((it) => it.id !== id);
		this.emitChanges('basket:changed');
	}

	//Получение продуктов из заказа
	getOrderProducts(): ICardItem[] {
		return this.basket;
	}

	//Подсчет общей стоимости
	getTotalPrice() {
		return this.basket.reduce((total, item) => {
			return total + item.price;
		}, 0);
	}

	//Добавление каталога карточек на главную страницу
	setCatalog(item: ICardItem[]) {
		this.items = item;
		this.emitChanges('items:changed', { catalog: this.items });
	}

	//Предпросмотр продукта validateOrder
	setPreview(item: ICardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}
