import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { AppData } from '../data/AppData';
import {ICardItem} from "../../types";

interface ICardActions {
	onClick: (event: { isWheels?:  boolean, price?: number }) => void;
	onChange?: (data: { isWheels?:  boolean, price?: number }) => void;
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
	'Боевая машина': 'card__category_other',
	Техлист: 'card__category_other',
	Tехлист: 'card__category_other',
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
	protected _button?: HTMLButtonElement;
	protected _buttonModal?: HTMLButtonElement;
	protected volumeLevel: HTMLElement;
	protected increaseButton: HTMLButtonElement;
	protected decreaseButton: HTMLButtonElement;
	public _inputWheels: HTMLInputElement;
	protected basketElement?: BasketElement;
	protected wheelsPrice?: number


	constructor(
		protected blockName: string,
		container: HTMLElement,
		action?: ICardActions,
	) {
		super(container, new EventEmitter()); // Инициализация EventEmitter
		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._description = container.querySelector('.card__description');
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');
		this.volumeLevel = document.getElementById('volume-level') as HTMLElement;
		this.increaseButton = document.getElementById(
			'increase'
		) as HTMLButtonElement;
		this.decreaseButton = document.getElementById(
			'decrease'
		) as HTMLButtonElement;
		// Ссылка на чекбокс
		this._inputWheels = container.querySelector(
			'.input_wheels'
		) as HTMLInputElement;

		// Добавляем обработчик события клика
		if (action?.onClick) {
			
			const handleAction = () => {
				action.onClick({ isWheels: this._inputWheels?.checked, price: this.price })
			}
			
			if (this._button) {
				this._button.addEventListener('click', handleAction);
			} else {
				container.addEventListener('click', handleAction);
			}
		}
	}

	updateVolume() {
		const volume = 0;
		this.volumeLevel.textContent = volume.toString();
		this.volumeLevel.style.transform = `scale(${1 + volume / 10})`; // Увеличиваем размер в зависимости от громкости
	}

	switch() {
		let volume = 0;
		this.increaseButton.addEventListener('click', () => {
			if (volume < 2) {
				volume += 0.1;
				this.updateVolume();
			}
		});
		this.decreaseButton.addEventListener('click', () => {
			if (volume > 0) {
				volume -= 0.1;
				this.updateVolume();
			}
		});
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
		// Получаем текущее изменение цены, основанное на чекбоксе (например, +10 или -10)
		const priceChange = this.getPriceAdjustmentBasedOnWheels();

		// Обновляем цену товара
		const updatedPrice = (this.price || 0) + priceChange;

		// Обновляем цену модели карточки товара
		this.price = updatedPrice; // Используем сеттер, чтобы обновить цену и отобразить её

		// Если товар уже добавлен в корзину, обновляем его цену в корзине
		if (this.basketElement) {
			this.basketElement.price = updatedPrice; // Обновляем цену товара в корзине
		}

		// Уведомляем систему, что корзина была изменена (пересчитываем общую сумму корзины)
		this.notifyBasketChanged();
	}

	BasedOnWheels() {
		// Добавляем обработчик события изменения состояния инпута
		this._inputWheels.addEventListener(
			'change',
			this.updatePriceBasedOnWheels.bind(this)
		);
	}

	//Отключение кнопки
	disableButton(value: number | null) {
		if (!value && this._button) {
			this._button.disabled = true;
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

	//Описание карточки
	set description(value: string) {
		this.setImage(this._description, value, this.title);
	}

	//Описание категории товара
	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, category[value], true);
	}
	
	set isWheels(value: boolean) {
		this._inputWheels.checked = value
	}
	
	render(data: ICardItem): HTMLElement {
		
		return super.render(data)
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
	protected _inputWheels: HTMLInputElement;
	protected wheelsPrice?: number

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

		// Инициализируем цену на основе текущего состояния input_wheels
		// this.updatePrice();

		// Обработчик события изменения состояния input_wheels
		if (this._inputWheels) {
			this._inputWheels.addEventListener('change', () => this.updatePrice());
		}

		// Обработчик события клика для кнопки
		if (action?.onClick) {
			const handleClick = () => action.onClick
			if (this._button) {
				this._button.addEventListener('click', handleClick);
			}
		}
	}

	// Метод для обновления цены в зависимости от состояния input_wheels
	getPriceAdjustment(): number {
		return this._inputWheels && this._inputWheels.checked ? this.wheelsPrice : -this.wheelsPrice;
	}

	// Метод для обновления цены
	updatePrice() {
		let currentPrice = parseInt(
			this._price.textContent?.replace(' очков', '') || '0',
			10
		);

		currentPrice += this.getPriceAdjustment();

		this.priceValue = currentPrice;

		this.action.onChange({
			price: currentPrice,
			isWheels: this._inputWheels?.checked
		})
	}

	private _priceValue = 0;

	get priceValue() {
		return this._priceValue;
	}

	set priceValue(value: number) {
		this._priceValue = value;
		this.price = value; // Обновление отображаемой цены
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
		this._inputWheels.checked = value
	}
}
