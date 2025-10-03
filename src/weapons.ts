import { type Weapon, WeaponType } from './types.ts';

export const WEAPONS: Record<WeaponType, Weapon> = {
  [WeaponType.KNIFE]: {
    type: WeaponType.KNIFE,
    name: 'Messer',
    damage: 20,
    ammo: -1,
    maxAmmo: -1,
    fireRate: 2,
    range: 1.5,
    needsAmmo: false
  },
  [WeaponType.PISTOL]: {
    type: WeaponType.PISTOL,
    name: 'Pistole',
    damage: 30,
    ammo: 8,
    maxAmmo: 120,
    fireRate: 3,
    range: 20,
    needsAmmo: true
  },
  [WeaponType.MACHINE_PISTOL]: {
    type: WeaponType.MACHINE_PISTOL,
    name: 'Maschinenpistole',
    damage: 25,
    ammo: 30,
    maxAmmo: 300,
    fireRate: 10,
    range: 15,
    needsAmmo: true
  },
  [WeaponType.CHAINSAW]: {
    type: WeaponType.CHAINSAW,
    name: 'Kettensäge',
    damage: 50,
    ammo: -1,
    maxAmmo: -1,
    fireRate: 5,
    range: 2,
    needsAmmo: false
  },
  [WeaponType.ASSAULT_RIFLE]: {
    type: WeaponType.ASSAULT_RIFLE,
    name: 'Sturmgewehr',
    damage: 35,
    ammo: 30,
    maxAmmo: 300,
    fireRate: 8,
    range: 25,
    needsAmmo: true
  },
  [WeaponType.HEAVY_MG]: {
    type: WeaponType.HEAVY_MG,
    name: 'Schweres Maschinengewehr',
    damage: 45,
    ammo: 100,
    maxAmmo: 500,
    fireRate: 12,
    range: 30,
    needsAmmo: true
  }
};

