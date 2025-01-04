import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import {
	ICardItem,
	IOrder,
	ITehListEtem,
	ITehListWheelsEtem,
	IFightingMachineItem,
} from './types/index';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/data/ExtensionApi';
import {
	AppData,
	CatalogChangeEvent,
	IOrderForm,
} from './components/data/AppData';
import { Card, BasketElement } from './components/View/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';

//Управление событиями и API
const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

//Переменные
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardTehlistTemplate = ensureElement<HTMLTemplateElement>('#card-tehlist');
const cardTehlistWheelsTemplate = ensureElement<HTMLTemplateElement>(
	'#card-tehlist_wheels'
);
const cardFightMachineTemplate = ensureElement<HTMLTemplateElement>(
	'#card-fighting_machine'
);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardBasketTemplateWheels = ensureElement<HTMLTemplateElement>(
	'#card-basket_wheels'
);

// Инициализация состояния приложения
const appData = new AppData({}, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

// Обработчик изменения каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.items.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render(item);
	});
});

//Выбор товара
events.on('card:select', (item: ICardItem) => {
	appData.setPreview(item);
});

//Добавление продукта в корзину
events.on('product:add', (item: ICardItem) => {
	appData.addBasket(item);
	modal.close();
});

//Удаление продукта из корзины
events.on('product:delete', (item: ICardItem) => {
	appData.removeFromBasket(item.id);
});

// Обработчик изменения в корзине и обновления общей стоимости
events.on('basket:changed', () => {
	page.counter = appData.getOrderProducts().length;
	let total = 0;

	basket.items = appData.getOrderProducts().map((item, index) => {
		let cardTemplate;

		if (item.type === 'wheels') {
			cardTemplate = cardBasketTemplateWheels;
		} else {
			cardTemplate = cardBasketTemplate;
		}

		const card = new BasketElement(cloneTemplate(cardTemplate), index, events, {
			onClick: () => {
				appData.removeFromBasket(item.id);
			},
			onChange: ({ price, isWheels }) => {
				appData.basket[index].price = price;
				if (item.type === 'wheels') {
					(appData.basket[index] as ITehListWheelsEtem).isWheels = isWheels;
				}

				basket.total = appData.getTotalPrice();
			},
		});

		total += item.price;

		return card.render(item);
	});

	basket.total = total;
});

// Обработчик изменения предпросмотра продукта и добавления в корзину

events.on('preview:changed', (item: ICardItem) => {
	if (item && item.type === 'list') {
		api.getWarriorsItem(item.id).then((res) => {
			item.id = res.id;
			item.category = res.category;
			item.title = res.title;
			item.description = res.description;
			item.image = res.image;
			item.price = res.price;

			const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
				onClick: () => {
					if (appData.productOrder(item)) {
						appData.removeFromBasket(item.id);
						modal.close();
					} else {
						events.emit('product:add', item);
					}
				},
			});
			const buttonTitle: string = appData.productOrder(item)
				? 'Убрать'
				: 'Добавить';
			card.buttonTitle = buttonTitle;
			modal.render({
				content: card.render({
					...item,
					button: buttonTitle,
				}),
			});
		});
	}
});

events.on('preview:changed', (item: ICardItem) => {
	if (item && item.type === 'tech') {
		api.getWeaponsItem(item.id).then((res) => {
			item.id = res.id;
			item.category = res.category;
			item.title = res.title;
			item.image = res.image;
			item.price = res.price;

			const card = new Card('card', cloneTemplate(cardTehlistTemplate), {
				onClick: () => {
					events.emit('product:add', {
						...item,
					});
				},
			});

			modal.render({
				content: card.render({
					...item,
				}),
			});
		});
	}
});

events.on('preview:changed', (item: ICardItem) => {
	if (item && item.type === 'wheels') {
		api.getWeaponsWheelsItem(item.id).then((res) => {
			console.log(res);
			item.id = res.id;
			item.category = res.category;
			item.title = res.title;
			item.image = res.image;
			item.price = res.price;

			// Создание карточки товара
			const card = new Card('card', cloneTemplate(cardTehlistWheelsTemplate), {
				onClick: (formData: { isWheels?: boolean; price: number }) => {
					events.emit('product:add', {
						...item,
						isWheels: formData.isWheels,
						price: formData.price ?? item.price,
					});
				},
			});

			card.BasedOnWheels();
			console.log(card.price);
			modal.render({
				content: card.render({
					...item,
				}),
			});
		});
	}
});

events.on('preview:changed', (item: ICardItem) => {
	if (item && item.type === 'machine') {
		api.getFightingMachineItem(item.id).then((res) => {
			console.log(res);
			console.log(
				`Weapon Prices: ${res.weapon1}, ${res.weapon2}, ${res.weapon3}`
			);
			item.id = res.id;
			item.category = res.category;
			item.title = res.title;
			item.image = res.image;
			item.price = res.price;

			// Создание карточки товара
			const card = new Card('card', cloneTemplate(cardFightMachineTemplate), {
				onClick: () => {
					events.emit('product:add', {
						...item,
						price: card.price,
					});
				},
			});

			// Инициализация заголовков оружия
			card.weaponTitles = {
				title1: res.weaponTittle1,
				title2: res.weaponTittle2,
				title3: res.weaponTittle3,
				title4: res.weaponTittle4,
				title5: res.weaponTittle5,
			};

			card.initializeWeaponPrices(res);
			card.BasedOnWeapon();
			console.log(card.price);
			modal.render({
				content: card.render({
					...item,
				}),
			});
		});
	}
});

// Обработчик изменения цены в каталоге
events.on('catalog:updated', (data: { id: string; newPrice: number }) => {
	// Находим товар в каталоге и обновляем его цену
	const item = appData.items.find((item) => item.id === data.id);
	if (item) {
		item.price = data.newPrice;
	}

	// После обновления цены каталога обновляем корзину
	appData.updateBasket();
});

//Открытие корзицы товаров
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

events.on('basket:success', () => {
	events.emit('order:completed');
});

events.on('counter:changed', () => {
	page.counter = appData.basket.length;
	console.log(page.counter);
});

// Блокировка прокрутки страницы
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

//Получаем массив товаров с сервера
Promise.all([
	api.getWarriorsList(),
	api.getWeaponsList(),
	api.getWeaponsWheelsList(),
	api.getFightingMachineList(),
])
	.then(
		([
			warriorsList,
			weaponsList,
			getFightMachineList,
			getFightingMachineList,
		]) => {
			// Объединяем оба списка в один массив и передаем в setCatalog
			const combinedList: (ICardItem | ITehListEtem)[] = [
				...warriorsList,
				...weaponsList,
				...getFightMachineList,
				...getFightingMachineList,
			];
			appData.setCatalog(combinedList); // Передаем комбинированный список
		}
	)
	.catch((error) => {
		console.error('Ошибка при загрузке данных:', error);
	});
