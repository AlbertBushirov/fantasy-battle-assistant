export interface Weapon {
    title: string;
    price: number;
}

export const combatLaser: Weapon = {
    title: 'Боевой лазер',
    price: 10,
}
export const grenadeLauncher: Weapon = {
    title: 'Гранатомёт',
    price: 25,
}

export const heavyMachineGun: Weapon = {
    title: 'Тяжелый пулемёт',
    price: 25,
}

export const rocketLauncher: Weapon = {
    title: 'Ракетомёт',
    price: 25
}

export const launcher: Weapon = {
    title: 'Пусковая установка',
    price: 30
}