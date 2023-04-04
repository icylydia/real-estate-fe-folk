import { AuthAPI } from 'src/api/auth';
import { BuildingAPI } from 'src/api/building';
import { AddressAPI } from 'src/api/address';

export interface ApiType {
  address: AddressAPI;
  auth: AuthAPI;
  building: BuildingAPI;
}
