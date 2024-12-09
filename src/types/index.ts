// Приложение
export interface IProductItem {
	basket: IBasket[];
	cardsList: ICardItem[];
	cardsTehList: ITehListEtem[];
	preview: string | null;
	order: IOrder | null;
	image: string;
}

// Товар
export type ICardItem = IListItem | ITehListEtem | ITehListWheelsEtem;

export interface IBaseCardItem {
	type: string;
	id: string;
	title: string;
	inBasket: boolean;
	price: number | null;
	category: string;
	button: string;
}

export interface IListItem extends IBaseCardItem {
	type: 'list';
	description: string;
	image: string;
}

export interface ITehListEtem extends IBaseCardItem{
	type: 'tech'
	image: string;
}

export interface ITehListWheelsEtem extends IBaseCardItem {
	type: 'wheels'
	wheelsPrice: number;
	isWheels?: boolean;
	image: string;
}

export interface IFightingMachineEtem {
	id: string;
	title: string;
	category: string;
	image: string;
	price: number | null;
	inBasket: boolean;
	button: string;
	weapon1: string;
	weapon2: string;
	weapon3: string;
	weapon4: string;
	weapon5: string;
}

// Интерфейс формы доставки заказа
export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IOrderForms {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
	total?: string | number;
}

// Интерфейс контактов заказа
export interface IOrderContacts {
	email: string;
	phone: string;
}

// Данные заказа
export interface IOrder extends IOrderForm, IOrderContacts {
	items: string[];
	total: number;
}

// Корзина
export interface IBasket {
	quantity: number;
	title: string;
	price: number;
	totalPrice: number;
}

export type PaymenthMethods = 'card' | 'cash';

// Тип ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
