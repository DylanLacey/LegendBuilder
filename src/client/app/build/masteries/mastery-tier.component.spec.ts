import {provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {RouteSegment} from '@angular/router';

import {it, inject, async, beforeEachProviders, beforeEach} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';

import {LolApiService} from '../../misc/lolapi.service';
import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';
import {MasteryTierComponent} from './mastery-tier.component';
import {MasteryComponent} from './mastery.component';

import {MockRouteSegment} from '../../testing';

const data = [
  {
    id: 0,
    description: ['test6121'],
    image: { full: '6121.png' },
    ranks: 5
  },
  null,
  {
    id: 1,
    description: ['test6122'],
    image: { full: '6122.png' },
    ranks: 5
  }
];

describe('MasteryTierComponent', () => {
  beforeEachProviders(() => [
    provide(RouteSegment, { useValue: new MockRouteSegment({ region: 'euw' }) }),

    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: (backend, defaultOptions) => {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    LolApiService,
    MasteriesComponent,
    MasteryCategoryComponent,
    MasteryTierComponent
  ]);


  let component: MasteryTierComponent;
  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.createAsync(MasteryTierComponent).then((fixture: ComponentFixture<MasteryTierComponent>) => {
      component = fixture.componentInstance;
      component.data = data;
      fixture.detectChanges();
    });
  })));

  it('should add mastery rank', () => {
    let mastery = component.children.toArray()[0];
    mastery.enable();
    mastery.setRank(1);
    component.rankAdd(mastery);
    expect(mastery.getRank()).toBe(2);
  });

  it('should set mastery rank to max when rank is zero', () => {
    let mastery = component.children.toArray()[0];
    mastery.enable();
    component.rankAdd(mastery);
    expect(mastery.getRank()).toBe(5);
  });


  it('should trigger category rankAdd event', () => {
    spyOn(component.rankAdded, 'emit');
    expect(component.rankAdded.emit).not.toHaveBeenCalled();
    let mastery = component.children.toArray()[0];
    component.rankAdd(mastery);
    expect(component.rankAdded.emit).toHaveBeenCalled();
  });

  it('should trigger category rankRemoved event', () => {
    spyOn(component.rankRemoved, 'emit');
    expect(component.rankRemoved.emit).not.toHaveBeenCalled();
    let mastery = component.children.toArray()[0];
    component.rankRemove(mastery);
    expect(component.rankRemoved.emit).toHaveBeenCalled();
  });
});