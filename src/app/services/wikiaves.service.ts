import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WikiavesService {

  private baseUri = 'https://www.wikiaves.com.br';

  constructor(
    public http: HttpClient
  ) { }

  public getImagesOfSpecies(id: string): any {
    const images: any[] = [];
    this.http.get(`${this.baseUri}/getRegistrosJSON.php?tm=f&t=s&s=${id}&o=mp&p=1`)
      .subscribe((res: any) => {
        Object.values(res.registros.itens).forEach((item: any, i) => {
          if (i < 5) {
            images.push(item.link.replace('#', 'q'));
          }
        });
      });
    return images;
  }
}
