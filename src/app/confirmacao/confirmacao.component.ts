import { Component, AfterViewInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { TfService } from '../services/model.service';
import { WikiavesService } from '../services/wikiaves.service';

declare const tf;
declare const require;

@Component({
  selector: 'app-confirmacao',
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})
export class ConfirmacaoComponent implements AfterViewInit {

  public loading = true;
  public suggestedSpecies: any[] = [];
  public birdIds = require('../../assets/tf/birdIdsMap.json');
  public birdNames = require('../../assets/tf/birdNamesMap.json');

  constructor(
    public shared: SharedService,
    private tfService: TfService,
    private wikiaves: WikiavesService
  ) { 
    setTimeout(() => {shared.appBarLabel = "Sugestōes"}, 0)
  }

  ngAfterViewInit(): void {
    const img = document.querySelector('img');
    setTimeout(() => {
      this.tfService.predict(img).then(res => {
        const {values, indices} = tf.topk(res, 10);
        const indicesArray = indices.arraySync()[0];
        const valuesArray = values.arraySync()[0];
        // iterate on each of top 10 suggestios
        indicesArray.forEach((index, i) => {
          const speciesId: string = this.birdIds[index];
          // model suggestion data
          const suggestionData = {
            index,
            confidence: Math.floor((valuesArray[i] * 100)),
            id: speciesId,
            name: this.birdNames[speciesId],
            images: this.wikiaves.getImagesOfSpecies(speciesId)
          };
          // push to suggestions array
          this.suggestedSpecies.push(suggestionData);
        });
        // stop loading
        this.loading = false;
      })
    }, 1000);
  }

  public openWiki(name): void {
    window.open(`https://www.wikiaves.com.br/wiki/${name}`)
  }

}
