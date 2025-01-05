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
export type ICardItem =
	| IListItem
	| ITehListEtem
	| ITehListWheelsEtem
	| IFightingMachineItem;

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

export interface ITehListEtem extends IBaseCardItem {
	type: 'tech' | 'OBE';
	image: string;
}

export interface ITehListWheelsEtem extends IBaseCardItem {
	type: 'wheels';
	wheelsPrice: number;
	isWheels?: boolean;
	image: string;
	button: string;
}

export interface IFightingMachineItem extends IBaseCardItem {
	type: 'machine';
	image: string;
	weaponTittle1: string;
	weapon1: number;
	weaponTittle2: string;
	weapon2: number;
	weaponTittle3: string;
	weapon3: number;
	weaponTittle4: string;
	weaponTittle5: string;
	weapon1_number: number;
	weapon2_number: number;
	weapon3_number: number;
	weapon4_number: number;
	weapon5_number: number;
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
