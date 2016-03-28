import {Component, Input, Inject, forwardRef, OnInit} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {MasteryComponent} from './mastery.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteriesComponent} from './masteries.component';

@Component({
  selector: 'mastery-category',
  directives: [NgFor, MasteryTierComponent],
  template: `
    <mastery-tier [data]="tier" [index]="i" *ngFor="#tier of data.tiers; #i = index"></mastery-tier>
    <p class="total">{{data.name + ': ' + totalRank}}</p>`
})

export class MasteryCategoryComponent implements OnInit {
  @Input() data: Object;

  private totalRank: number = 0;
  private tiers: Array<MasteryTierComponent> = new Array<MasteryTierComponent>();

  constructor( @Inject(forwardRef(() => MasteriesComponent)) private masteries: MasteriesComponent) {
  }

  public ngOnInit() {
    this.masteries.addCategory(this);
  }

  public addTier(tier: MasteryTierComponent) {
    this.tiers[tier.index] = tier;
  }

  public enable() {
    this.forEachTier((t) => {
      if (t.index === 0) {
        t.enable();
      } else if (this.tiers[t.index - 1].getRank() !== 0) {
        t.enable();
      }
    });
  }
  public disable() {
    this.forEachTier((t) => {
      if (t.getRank() === 0) {
        t.disable();
      }
    });
  }

  public rankAdded(tier: MasteryTierComponent, mastery: MasteryComponent) {
    if (!tier) {
      return;
    }
    if (tier.getRank() === mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.enable());
      this.forTier(tier.index - 1, (t) => t.lock());
    }
    if (tier.getRank() > mastery.getRank()) {
      tier.setOtherRank(mastery, mastery.getMaxRank() - mastery.getRank());
    }
    var deviation = this.getTotalRankDeviation();
    if (deviation) {
      if (tier.getRank() > mastery.getRank()) {
        tier.setOtherRank(mastery, tier.getRank() - deviation - mastery.getRank());
      } else {
        mastery.setRank(tier.getRank() - deviation);
      }
    }
    this.masteries.rankAdded();
    this.totalRank = this.getRank();
  }

  public rankRemoved(tier: MasteryTierComponent, mastery: MasteryComponent) {
    if (!tier) {
      return;
    }
    if (tier.getRank() < mastery.getMaxRank()) {
      this.forTier(tier.index + 1, (t) => t.disable());
      this.forTier(tier.index - 1, (t) => t.unlock());
    }
    this.masteries.rankRemoved();
    this.totalRank = this.getRank();
  }

  private forTier(index: number, callback: (MasteryTierComponent) => void) {
    if (!this.tiers[index]) {
      return;
    }
    callback(this.tiers[index]);
  }
  private forEachTier(callback: (MasteryTierComponent) => void) {
    this.tiers.forEach(function(tier: MasteryTierComponent) {
      callback(tier);
    });
  }

  private getRank(): number {
    var rank = 0;
    this.forEachTier((t) => rank += t.getRank());
    return rank;
  }

  private getTotalRankDeviation() {
    var deviation = this.masteries.getRank() - 30;
    return deviation > 0 ? deviation : 0;
  }
}
