import {Component, Output, EventEmitter, Inject} from 'angular2/core';
import {NgFor, NgIf, NgClass} from 'angular2/common';

import {DDragonDirective} from '../../misc/ddragon.directive';
import {LoadingComponent} from '../../misc/loading.component';
import {ErrorComponent} from '../../misc/error.component';

import {ToIterablePipe} from '../../misc/to-iterable.pipe';
import {TranslatePipe} from './translate.pipe';
import {CapitalizePipe} from '../../misc/capitalize.pipe';
import {MapPipe} from './map.pipe';
import {ChampionPipe} from './champion.pipe';
import {HidePipe} from './hide.pipe';
import {SortPipe} from './sort.pipe';
import {TagsPipe} from './tags.pipe';

import {LolApiService} from '../../misc/lolapi.service';

@Component({
  selector: 'shop',
  providers: [LolApiService],
  directives: [NgFor, NgIf, NgClass, DDragonDirective, LoadingComponent, ErrorComponent],
  pipes: [TranslatePipe, CapitalizePipe, ToIterablePipe, MapPipe, ChampionPipe, HidePipe, SortPipe, TagsPipe],
  template: `
    <div class="left">
      <button type="button" name="all-items">All Items</button>
      <div class="category" *ngFor="#category of items?.tree | toIterable">
        <p class="noselect">{{category.header | translate | capitalize}}</p>
        <hr>
        <label *ngFor="#tag of category.tags">
          <input *ngIf="tag != '_SORTINDEX'" type="checkbox" value="{{tag}}" (change)="tagChanged($event)">
          <span *ngIf="tag != '_SORTINDEX'">{{tag | translate | capitalize}}</span>
        </label>
      </div>
    </div> 
    <div class="right">
      <div class="search">
        <input type="text" name="name" placeholder="Name">
        <button type="button" name="show-disabled" title="Display hidden items">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="icon eye" width="24" height="24" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 
            3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </button>
      </div>
      <div class="items">
        <div class="item" *ngFor="#item of items?.data | toIterable | map:11 | champion:123 | hide | tags:tags | sort" [ngClass]="{disabled: item.disabled}" title="{{item.description}}">
          <img [ddragon]="'item/' + item.image.full">
          <div>
            <p class="name">{{item.name}}</p>
            <div class="gold">
              <img [ddragon]="'ui/gold.png'">
              <p>{{item.gold.total}}</p>
            </div>
          </div>
        </div>
        <loading [loading]="loading"></loading>
        <error [error]="error" (retry)="getData()"></error>
      </div>
    </div>`
})

export class ShopComponent {
  @Output() itemPicked: EventEmitter<any> = new EventEmitter<any>();

  private items: Object;
  private loading: boolean = true;
  private error: boolean = false;

  private tags: Array<string> = [];

  constructor(private lolApi: LolApiService) {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.error = false;

    this.lolApi.getItems()
      .subscribe(
      res => { this.items = res; },
      error => { this.error = true; this.loading = false; },
      () => this.loading = false
      );
  }

  private tagChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    var input = event.target;
    if (input['checked']) {
      this.tags.push(input['value']);
    } else {
      var index: number = this.tags.indexOf(input['value']);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  }
}