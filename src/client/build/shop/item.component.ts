import {Component, Input} from '@angular/core';

import {DDragonDirective} from '../../misc/ddragon.directive';

@Component({
  selector: 'item',
  directives: [DDragonDirective],
  template: `
    <img [ddragon]="'item/' + item.image.full">
    <div>
      <p class="name">{{item.name}}</p>
      <div class="gold">
        <img [ddragon]="'ui/gold.png'">
        <p>{{item.gold.total ? item.gold.total : 'Free'}}</p>
      </div>
    </div>`
})

export class ItemComponent {
  @Input() item;
}
