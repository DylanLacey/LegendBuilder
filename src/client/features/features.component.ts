import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {LolApiService} from '../misc/lolapi.service';

@Component({
  directives: [],
  providers: [LolApiService],
  styles: [require('../../assets/css/summoner.css')],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div>
      <p>
        Enter your summoner name:
        <input type="text" name="name" #summoner>
        <button (click)="getSummonerId(summoner)">Go</button>
      </p>
      <p>
        Universal build
        <button>
          <a [routerLink]="['/Build', region.id, champion]"></a>
        </button>
      </p>
    </div>`
})

export class FeaturesComponent {
  private champion: string;
  private error: boolean = false;

  constructor(route: ActivatedRoute, private router: Router, private lolApi: LolApiService) {
    route.params.subscribe(params => { this.champion = params['champion']; });
  }

  getSummonerId(event: HTMLInputElement) {
    this.lolApi.getSummonerId(event.value, this.champion)
        .subscribe(
            res => {
              if (!isNaN(res)) {
                this.router.navigate(['summoner', event.value]);
              } else {
                this.error = true;
              }
            },
            error => { this.error = true; });
  }
}
