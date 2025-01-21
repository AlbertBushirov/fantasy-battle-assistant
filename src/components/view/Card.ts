import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ICardItem, IItemWeapons } from '../../types';
import { Weapon } from './Weapon';

interface ICardActions {
	onClick: (event: { isWheels?: boolean; price?: number }) => void;
	onChange?: (data: { isWheels?: boolean; price?: number }) => void;
}

interface Category {
	[key: string]: string;
}

const category: Category = {
	'Гильдия вольных стрелков': 'card__category_soft',
	'Войска Колдуна': 'card__category_hard',
	'Боевое существо': 'card__category_additional',
	'Легионеры Некроманта': 'card__category_nekromant',
	'Гвардия Чародея': 'card__category_charodey',
	'Боевая машина': 'card__category_additional',
	Техлист: 'card__category_other',
	кнопка: 'card__category_button',
	другое: 'card__category_other',
	дополнительное: 'card__category_additional',
};

export class Card extends Component<ICardItem> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLImageElement;
	protected _price: HTMLElement;
	protected priceValue: number;
	protected _button?: HTMLButtonElement;
	protected _buttonModal?: HTMLButtonElement;
	protected volumeLevel: HTMLElement;
	protected increaseButton: HTMLButtonElement;
	protected decreaseButton: HTMLButtonElement;
	public _inputWheels: HTMLInputElement;
	protected basketElement?: BasketElement;
	protected wheelsPrice?: number;
	protected _weapons?: HTMLInputElement;
	protected weapons?: IItemWeapons;
	public volumeLevels: number[];
	protected weaponNumperElements: HTMLElement[] = [];

	constructor(
		protected blockName: string,
		container: HTMLElement,
		action?: ICardActions
	) {
		super(container, new EventEmitter()); // Инициализация EventEmitter
		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._description = container.querySelector('.card__description');
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');
		this._weapons = container.querySelector('.weapons-list');

		// Ссылка на чекбокс
		this._inputWheels = container.querySelector(
			'.input_wheels'
		) as HTMLInputElement;

		if (action?.onClick) {
			const handleAction = () => {
				action.onClick({
					isWheels: this._inputWheels?.checked,
					price: this.price,
				});
			};

			if (this._button) {
				this._button.addEventListener('click', handleAction);
			} else {
				container.addEventListener('click', handleAction);
			}
		}
	}

	private totalWeaponCount(): number {
		return this.weapons.reduce((total, weapon) => total + weapon.quantity, 0);
	}

	private increaseWeaponCount(index: number) {
		if (this.totalWeaponCount() < 2) {
			// Проверка на общую сумму
			this.weapons[index].quantity++;
			this.renderWeapons(this.weapons);
			this.BasedOnWeapon();
		} else {
			console.warn('Общая сумма weapon_numper не может превышать 2');
		}
	}

	private decreaseWeaponCount(index: number) {
		if (this.weapons[index].quantity > 0) {
			this.weapons[index].quantity--;
			this.renderWeapons(this.weapons);
			this.BasedOnWeapon(); // Обновляем цену на основе оружия
		}
	}

	private notifyBasketChanged() {
		if (this.events) {
			this.events.emit('basket:changed');
		} else {
			console.error('Events manager is not initialized');
		}
	}

	getPriceAdjustmentBasedOnWheels(): number {
		if (this._inputWheels) {
			// Если инпут существует, проверяем его состояние
			return this._inputWheels.checked ? this.wheelsPrice : -this.wheelsPrice;
		} else {
			console.warn('Input wheels element not found!');
			return 0; // Возвращаем 0, если элемент не найден
		}
	}

	private updatePriceBasedOnWheels() {
		const priceChange = this.getPriceAdjustmentBasedOnWheels();

		const updatedPrice = (this.price || 0) + priceChange;

		this.price = updatedPrice;

		if (this.basketElement) {
			this.basketElement.price = updatedPrice;
		}

		this.notifyBasketChanged();
	}

	BasedOnWheels() {
		// Добавляем обработчик события изменения состояния инпута
		this._inputWheels.addEventListener(
			'change',
			this.updatePriceBasedOnWheels.bind(this)
		);
	}

	public BasedOnWeapon() {
		const weaponsPrice = this.weapons?.reduce(
			(total, weapon) => total + weapon.price * weapon.quantity,
			0
		);

		this.price = this.priceValue + weaponsPrice;
		this.notifyBasketChanged(); // Уведомляем о изменении корзины
	}

	//Отключение кнопки
	disableButton(value: number | null) {
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	//Установка заголовка элемента
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set buttonTitle(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	//Проверка на 'Бесценно'
	set price(value: number) {
		this.setText(this._price, value ? `${value.toString()} очков` : 'Бесценно');
		this.disableButton(value);

		// Обновляем цену в корзине, если товар добавлен
		if (this.basketElement) {
			this.basketElement.price = value || 0;
		}
	}

	get price(): number {
		return Number(this._price.textContent?.replace(' очков', '') || 0);
	}

	//Отображение артефакта
	set description(value: string) {
		this.setImage(this._description, value, this.title);
	}

	//Описание категории товара
	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, category[value], true);
	}

	set isWheels(value: boolean) {
		this._inputWheels.checked = value;
	}

	renderWeapons(weapons: IItemWeapons) {
		if (weapons && this._weapons) {
			const weaponsElements = weapons.map((weapon, index) => {
				const container = cloneTemplate('#weapon');
				const weaponEl = new Weapon(container, {
					increase: () => {
						this.increaseWeaponCount(index);
					},
					decrease: () => {
						this.decreaseWeaponCount(index);
					},
				});
				return weaponEl.render({
					...weapon,
					isMax: this.totalWeaponCount() >= 2,
				});
			});
			this._weapons.replaceChildren(...weaponsElements);
		}
	}

	render(data: ICardItem): HTMLElement {
		const element = super.render(data);
		this.priceValue = data.price;
		if ('weapons' in data) {
			this.renderWeapons(data.weapons);
		}
		return element;
	}
}

export interface IBasketItem {
	price: number;
	image: string;
	description: string;
}

export class BasketElement extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	public _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLImageElement;
	protected _inputWheels?: HTMLInputElement;
	protected wheelsPrice?: number;

	constructor(
		container: HTMLElement,
		index: number,
		events: EventEmitter,
		protected action?: ICardActions
	) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this.setText(this._index, index + 1);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price_basket', container);
		this._button = container.querySelector('.card__button');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__description');
		this._inputWheels = container.querySelector(
			'.input_wheels'
		) as HTMLInputElement;

		this.events = events;

		if (this._inputWheels) {
			this._inputWheels.addEventListener('change', () => this.updatePrice());
		}

		if (action?.onClick) {
			const handleClick = () => {
				const isWheels = this._inputWheels
					? this._inputWheels.checked
					: undefined;
				action.onClick({
					isWheels,
					price: this.priceValue,
				});
			};
			this._button.addEventListener('click', handleClick);
		}
	}

	// Метод для обновления цены в зависимости от состояния input_wheels
	getPriceAdjustment(): number {
		return this._inputWheels && this._inputWheels.checked
			? this.wheelsPrice
			: -this.wheelsPrice;
	}

	// Метод для обновления цены
	updatePrice() {
		let currentPrice = parseInt(
			this._price.textContent?.replace(' очков', '') || '0',
			10
		);

		if (this._inputWheels) {
			if (this._inputWheels.checked) {
				currentPrice += this.wheelsPrice || 0;
			} else {
				currentPrice -= this.wheelsPrice || 0;
			}
		}

		this.priceValue = currentPrice;

		// Обновляем состояние в родительском компоненте, если есть обработчик onChange
		if (this.action?.onChange) {
			this.action.onChange({
				price: currentPrice,
				isWheels: this._inputWheels?.checked,
			});
		}
	}

	private _priceValue = 0;

	get priceValue() {
		return this._priceValue;
	}

	set priceValue(value: number) {
		this._priceValue = value;
		this.price = value;
	}
	//
	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	//отображает арм лист отряда
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	//отображает артефакт отряда
	set description(value: string) {
		this.setImage(this._description, value, this.title);
	}

	// Отображает цену товаров в корзине
	set price(value: number) {
		this.setText(this._price, `${value} очков`);
	}

	set isWheels(value: boolean) {
		this._inputWheels.checked = value;
	}
}
