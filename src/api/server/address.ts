import { AddressAPI as AddressAPIType, AddressInResponse } from 'src/api/address';
import { AxiosApi } from 'src/api/server/AxiosApi';
export class AddressAPI extends AxiosApi implements AddressAPIType {
  async getAddressByPostalCode(postalCode: string): Promise<AddressInResponse> {
    const resp = await this.axios.get(`/postal-codes/${postalCode}`);
    return resp.data;
  }
}
