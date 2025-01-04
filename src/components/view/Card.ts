import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { ICardItem } from '../../types';

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
	'Боевая машина': 'card__category_other',
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
	protected _button?: HTMLButtonElement;
	protected _buttonModal?: HTMLButtonElement;
	protected volumeLevel: HTMLElement;
	protected increaseButton: HTMLButtonElement;
	protected decreaseButton: HTMLButtonElement;
	public _inputWheels: HTMLInputElement;
	protected basketElement?: BasketElement;
	protected wheelsPrice?: number;
	protected weaponTittle1: HTMLElement;
	protected weaponTittle2: HTMLElement;
	protected weaponTittle3: HTMLElement;
	protected weaponTittle4: HTMLElement;
	protected weaponTittle5: HTMLElement;
	private weaponPrices: number[];
	public weaponCounts: number[];
	public volumeLevels: number[];
	protected weaponNumperElements: HTMLElement[] = [];

	constructor(
		protected blockName: string,
		container: HTMLElement,
		action?: ICardActions
	) {
		super(container, new EventEmitter()); // Инициализация EventEmitter
		this.weaponPrices = [];
		this.weaponCounts = [];
		this._category = container.querySelector('.card__category');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._description = container.querySelector('.card__description');
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');
		this.weaponTittle1 = container.querySelector(
			'.weapon_tittle1'
		) as HTMLElement;
		this.weaponTittle2 = container.querySelector(
			'.weapon_tittle2'
		) as HTMLElement;
		this.weaponTittle3 = container.querySelector(
			'.weapon_tittle3'
		) as HTMLElement;
		this.weaponTittle4 = container.querySelector(
			'.weapon_tittle4'
		) as HTMLElement;
		this.weaponTittle5 = container.querySelector(
			'.weapon_tittle5'
		) as HTMLElement;

		// Ссылка на чекбокс
		this._inputWheels = container.querySelector(
			'.input_wheels'
		) as HTMLInputElement;

		// Добавляем обработчик события клика
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
		for (let i = 1; i <= 5; i++) {
			this.weaponCounts[i - 1] = 0;
			this.weaponNumperElements[i - 1] = container.querySelector(
				`#volume-level${i} .weapon_numper`
			) as HTMLElement;

			const increaseButton = container.querySelector(
				`#increase${i}`
			) as HTMLButtonElement;
			const decreaseButton = container.querySelector(
				`#decrease${i}`
			) as HTMLButtonElement;

			if (increaseButton && decreaseButton) {
				increaseButton.addEventListener('click', () =>
					this.increaseWeaponCount(i - 1)
				);
				decreaseButton.addEventListener('click', () =>
					this.decreaseWeaponCount(i - 1)
				);
			}
		}
	}
	initializeWeaponPrices(res: any) {
		this.weaponPrices = [
			res.weapon1 || 0,
			res.weapon2 || 0,
			res.weapon2 || 0,
			res.weapon2 || 0,
			res.weapon3 || 0,
		];
		console.log('Initialized weapon prices:', this.weaponPrices);
	}

	private totalWeaponCount(): number {
		return this.weaponCounts.reduce((total, count) => total + count, 0);
	}

	private increaseWeaponCount(index: number) {
		if (this.totalWeaponCount() < 2) {
			// Проверка на общую сумму
			this.weaponCounts[index]++;
			this.updateWeaponNumper(index);
			this.BasedOnWeapon();
		} else {
			console.warn('Общая сумма weapon_numper не может превышать 2');
		}
	}

	private decreaseWeaponCount(index: number) {
		if (this.weaponCounts[index] > 0) {
			this.weaponCounts[index]--;
			this.updateWeaponNumper(index);
			this.BasedOnWeapon(); // Обновляем цену на основе оружия
		}
	}

	private updateWeaponNumper(index: number) {
		this.weaponNumperElements[index].textContent =
			this.weaponCounts[index].toString();
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
		this.price = 0; // Обнуляем цену

		for (let i = 0; i < this.weaponCounts.length; i++) {
			const weaponPrice = this.weaponPrices[i] || 0; // Получаем цену оружия, если она не определена, устанавливаем 0
			const weaponCount = this.weaponCounts[i] || 0; // Получаем количество оружия, если оно не определено, устанавливаем 0

			console.log(
				`Weapon ${i + 1}: Price = ${weaponPrice}, Count = ${weaponCount}`
			);

			// Убедитесь, что weaponPrice и weaponCount являются числами
			if (typeof weaponPrice === 'number' && typeof weaponCount === 'number') {
				this.price += weaponPrice * weaponCount; // Обновляем общую цену
			} else {
				console.error(
					`Invalid price or count for weapon ${
						i + 1
					}: Price = ${weaponPrice}, Count = ${weaponCount}`
				);
			}
		}

		console.log(`Total Price: ${this.price}`);
		this.notifyBasketChanged(); // Уведомляем о изменении корзины
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

	set weaponTitles(data: {
		title1: string;
		title2: string;
		title3: string;
		title4: string;
		title5: string;
	}) {
		this.weaponTittle1.textContent = data.title1;
		this.weaponTittle2.textContent = data.title2;
		this.weaponTittle3.textContent = data.title3;
		this.weaponTittle4.textContent = data.title4;
		this.weaponTittle5.textContent = data.title5;
	}

	render(data: ICardItem): HTMLElement {
		return super.render(data);
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
