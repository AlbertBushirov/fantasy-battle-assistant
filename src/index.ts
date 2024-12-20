import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ICardItem, IOrder, ITehListEtem } from './types/index';
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
import { OrderAddress, OrderContacts } from './components/View/Order';
import { Success } from './components/View/Success';

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
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardBasketTemplateWheels = ensureElement<HTMLTemplateElement>(
	'#card-basket_wheels'
);
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация состояния приложения
const appData = new AppData({}, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAdress = new OrderAddress(cloneTemplate(orderTemplate), events);
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

// Обработчик изменения каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.items.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
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

		if (item.category === 'Tехлист') {
			cardTemplate = cardBasketTemplateWheels;
		} else {
			cardTemplate = cardBasketTemplate;
		}

		const card = new BasketElement(cloneTemplate(cardTemplate), index, events, {
			onClick: () => {
				appData.removeFromBasket(item.id);
			},
		});

		total += item.price;

		return card.render({
			price: item.price,
			image: item.image,
			description: item.description,
		});
	});

	basket.total = total;
});

// Обработчик изменения предпросмотра продукта и добавления в корзину

events.on('preview:changed', (item: ICardItem) => {
	if (item) {
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
					title: item.title,
					description: item.description,
					image: item.image,
					price: item.price,
					category: item.category,
					button: buttonTitle,
				}),
			});
		});
	}
});

events.on('preview:changed', (item: ITehListEtem) => {
	if (item) {
		api.getWeaponsItem(item.id).then((res) => {
			item.id = res.id;
			item.category = res.category;
			item.title = res.title;
			item.image = res.image;
			item.price = res.price;

			const card = new Card('card', cloneTemplate(cardTehlistTemplate), {
				onClick: () => {
					if (appData.tehListOrder(item)) {
						appData.removeFromBasket(item.id);
						modal.close();
					} else {
						events.emit('product:add', item);
					}
				},
			});
			const buttonTitle: string = appData.tehListOrder(item)
				? 'Убрать'
				: 'Добавить';
			card.buttonTitle = buttonTitle;
			modal.render({
				content: card.render({
					title: item.title,
					image: item.image,
					price: item.price,
					category: item.category,
					button: buttonTitle,
				}),
			});
		});
	}
});

events.on('preview:changed', (item: ITehListEtem) => {
	if (item) {
		api.getWeaponsWheelsItem(item.id).then((res) => {
			item.id = res.id;
			item.category = res.category;
			item.title = res.title;
			item.image = res.image;
			item.price = res.price;

			const card = new Card('card', cloneTemplate(cardTehlistWheelsTemplate), {
				onClick: () => {
					if (appData.tehListOrder(item)) {
						appData.removeFromBasket(item.id);
						modal.close();
					} else {
						events.emit('product:add', item);
					}
				},
			});
			const buttonTitle: string = appData.tehListOrder(item)
				? 'Убрать'
				: 'Добавить';
			card.buttonTitle = buttonTitle;
			card.BasedOnWheels();
			modal.render({
				content: card.render({
					title: item.title,
					image: item.image,
					price: item.price,
					category: item.category,
					button: buttonTitle,
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

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

events.on('order:ready', () => {
	orderAdress.valid = true;
});

events.on('contacts:ready', () => {
	contacts.valid = true;
});

events.on('basket:success', () => {
	events.emit('order:completed');
});

events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.setPaymentMethod(item.name);
});

events.on('counter:changed', () => {
	page.counter = appData.basket.length;
	console.log(page.counter);
});

//валидация полей доставки
events.on('form:errors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	orderAdress.valid = !payment && !address;
	orderAdress.errors = Object.values({ payment, address }).filter((i) => !!i);
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone }).filter((i) => !!i);
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// открытие модального окна заказа
events.on('order:open', () => {
	modal.render({
		content: orderAdress.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Обработчик открытия модального окна контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//Оформление заказа
events.on('contacts:submit', () => {
	const orderDone = {
		...appData.order,
		items: appData.basket.map((item) => item.id),
		total: (basket.total = appData.getTotalPrice()),
		id: appData.basket.map((item) => item.id),
	};
	api
		.orderCards(orderDone)
		.then((result) => {
			appData.clearBasket(); // Очистка корзины
			appData.clearOrder(); // Очистка данных заказа
			orderAdress.resetButtonState();
			success;
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});
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
])
	.then(([warriorsList, weaponsList, getFightMachineList]) => {
		// Объединяем оба списка в один массив и передаем в setCatalog
		const combinedList: (ICardItem | ITehListEtem)[] = [
			...warriorsList,
			...weaponsList,
			...getFightMachineList,
		];
		appData.setCatalog(combinedList); // Передаем комбинированный список
	})
	.catch((error) => {
		console.error('Ошибка при загрузке данных:', error);
	});
