import {combatLaser, grenadeLauncher, heavyMachineGun, launcher, rocketLauncher} from "./weapons";

export const localfightMachine = [
	{
		id: 'FMUnl-3',
		title: 'Unl-3',
		category: 'Боевая машина',
		image:
			'https://sun9-62.userapi.com/impg/x2qaLUTdDXrf1JnKl9Ok7T2RsYlfNi2Cp8uvjA/xpVWoEOARSU.jpg?size=709x1181&quality=95&sign=a721578ee25c1d91c01ee5b3cb032131&type=album', // Прямой URL для удаленного изображения
		price: 80,
		inBasket: true,
		weapons: [
			combatLaser,
			grenadeLauncher,
			heavyMachineGun,
			rocketLauncher,
			launcher
		],
		button: '',
	},
];
