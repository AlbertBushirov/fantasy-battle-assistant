import {
	combatLaser,
	grenadeLauncher,
	heavyMachineGun,
	launcher,
	rocketLauncher,
	laserPistol,
	lightningGun,
	swordSaw,
	combatLaser2,
	grenadeLauncher2,
	heavyMachineGun2,
	rocketLauncher2,
	launcher2,
} from './weapons';

export const localfightMachine = [
	{
		id: 'FMUnl-3',
		title: 'UNL-3',
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
			launcher,
		],
		button: '',
	},
	{
		id: 'FMRaptor',
		title: 'Raptor',
		category: 'Боевая машина',
		image:
			'https://sun9-31.userapi.com/impg/i5VAkDBDF1k2PjCzbo2q7MVtKnlrEgKKQ5HV5g/qwNAsiIaDfE.jpg?size=709x1181&quality=95&sign=e0a0d7cdd591c547badbe9995a7e928d&type=album', // Прямой URL для удаленного изображения
		price: 90,
		inBasket: true,
		weapons: [
			combatLaser,
			grenadeLauncher,
			heavyMachineGun,
			rocketLauncher,
			launcher,
		],
		button: '',
	},
	{
		id: 'FMUNL-2',
		title: 'UNL-2',
		category: 'Боевая машина',
		image:
			'https://sun9-6.userapi.com/impg/Guy0wAUsRluqMtgXImstZjiiDaF4EkuPhlgczg/XyI3Nx2Vsh4.jpg?size=709x1181&quality=95&sign=4a0c46e285ca63c0c1e999f84aa5baf2&type=album', // Прямой URL для удаленного изображения
		price: 100,
		inBasket: true,
		weapons: [
			combatLaser2,
			grenadeLauncher2,
			heavyMachineGun2,
			rocketLauncher2,
			launcher2,
		],
		button: '',
	},
	{
		id: 'FMDinamo',
		title: 'Панцерон Динамо',
		category: 'Боевая машина',
		image:
			'https://sun9-2.userapi.com/impg/q3ptylo2iOKxSdRRMn2hwqblMmdf_S9zXT_O5w/fe649R1yV3E.jpg?size=709x1181&quality=95&sign=0af2a8aeeb45a463061bd9ff6e409c41&type=album', // Прямой URL для удаленного изображения
		price: 90,
		inBasket: true,
		weapons: [laserPistol, lightningGun, swordSaw],
		button: '',
	},
	{
		id: 'FMKibero',
		title: 'Панцерон Киберо',
		category: 'Боевая машина',
		image:
			'https://sun9-76.userapi.com/impg/3IGbcA1-Ukuvq0Imh_MvC39kwLAxbd0s5W5bAA/01SJlhfuO1A.jpg?size=709x1181&quality=95&sign=1d6df540e5325777573bc5a1a5b6d407&type=album', // Прямой URL для удаленного изображения
		price: 90,
		inBasket: true,
		weapons: [laserPistol, lightningGun, swordSaw],
		button: '',
	},
	{
		id: 'FMSamuro',
		title: 'Панцерон Самуро',
		category: 'Боевая машина',
		image:
			'https://sun9-27.userapi.com/impg/3OVuu14_91kUzVti5uGN8LRuiIGs-iedgbqshg/-HEPMNeKED0.jpg?size=709x1181&quality=95&sign=05900c3ef9dfc0338643ebfe48655a5e&type=album', // Прямой URL для удаленного изображения
		price: 90,
		inBasket: true,
		weapons: [laserPistol, lightningGun, swordSaw],
		button: '',
	},
	{
		id: 'FMCunamo',
		title: 'Панцерон Цунамо',
		category: 'Боевая машина',
		image:
			'https://sun9-56.userapi.com/impg/FLGT950qWmLHWEpvTWSraUYVGfPDJp9IkfiPBg/aMXl3grviak.jpg?size=709x1181&quality=95&sign=bff39e3d98cc76725946657d9ef9984a&type=album', // Прямой URL для удаленного изображения
		price: 90,
		inBasket: true,
		weapons: [laserPistol, lightningGun, swordSaw],
		button: '',
	},
];
