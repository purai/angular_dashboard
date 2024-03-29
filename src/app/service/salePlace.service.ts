import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SalePlace } from '../model/salePlace.model';

@Injectable()
export class SalePlaceService {
  constructor(private http: HttpClient) { }

  baseUrl: string = environment.baseUrl + '/salePlaces';

  getSalePlaces(status: number = 1, limit: number = 10, page: number = 1) {
    return this.http.get<SalePlace[]>(this.baseUrl + '/?status=' + status + '&page=' + page + '&limit=' + limit);
  }

  getSalePlaceByUuid(uuid: string, status: number = 1) {
    return this.http.get<SalePlace>(this.baseUrl + '/?uuid=' + uuid + '&status=' + status);
  }

  createSalePlace(salePlace: SalePlace) {
    return this.http.post(this.baseUrl, salePlace);
  }

  updateSalePlace(salePlace: SalePlace) {
    return this.http.put(this.baseUrl + '/' + salePlace.uuid, salePlace);
  }

  deleteSalePlace(uuid: string) {
    return this.http.delete(this.baseUrl + '/' + uuid);
  }
}
