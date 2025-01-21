import { Component } from '../base/Component';
import { IItemWeapons } from '../../types';
import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface WeaponActions {
	increase?: () => void;
	decrease?: () => void;
}

type WeaponProps = IItemWeapons[0] & { isMax?: boolean };
export class Weapon extends Component<WeaponProps> {
	protected _title: HTMLElement;
	protected _quantity: HTMLElement;
	protected quantityValue: number;
	protected _increase: HTMLButtonElement;
	protected _decrease: HTMLButtonElement;
	protected isMax?: boolean;

	constructor(container: HTMLElement, actions?: WeaponActions) {
		super(container, new EventEmitter());

		this._title = ensureElement<HTMLElement>('.weapon_title', container);
		this._increase = ensureElement<HTMLButtonElement>('.increase', container);
		this._decrease = ensureElement<HTMLButtonElement>('.decrease', container);
		this._quantity = ensureElement<HTMLElement>('.weapon_number', container);

		if (actions.increase) {
			this._increase.addEventListener('click', () => {
				if (!this.isMax) {
					actions.increase();
				}
			});
		}
		if (actions.decrease) {
			this._decrease.addEventListener('click', () => {
				if (this.quantityValue > 0) {
					actions.decrease();
				}
			});
		}
	}

	renderTitle(title: string, price: number) {
		this.setText(this._title, `${title} [${price}]`);
	}

	set quantity(value: number) {
		this.quantityValue = value;
		this.setText(this._quantity, String(value));
	}

	renderButtons() {
		this._increase.disabled = this.isMax;

		this._decrease.disabled = this.quantityValue < 1;
	}

	render(data: WeaponProps): HTMLElement {
		const element = super.render(data);
		this.renderTitle(data.title, data.price);
		this.renderButtons();
		return element;
	}
}
