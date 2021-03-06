import {ComponentFixture, TestBed, TestComponentBuilder, async, inject} from '@angular/core/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {ActivatedRoute} from '@angular/router';

import {LolApiService} from '../../misc/lolapi.service';
import {MockActivatedRoute, MockMockBackend} from '../../testing';

import {MasteriesComponent} from './masteries.component';
import {MasteryCategoryComponent} from './mastery-category.component';

class MockMasteryCategoryComponent extends MasteryCategoryComponent {
  public rank: number = 0;
  public enabled: boolean = false;
  getRank(): number {
    return this.rank;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
}

const masteriesData = {
  tree: {
    Ferocity: [
      {masteryTreeItems: [{masteryId: 6121}, null, {masteryId: 6122}]},
      {masteryTreeItems: [{masteryId: 6121}, {masteryId: 6122}, {masteryId: 6122}]}
    ],
    Cunning: [{masteryTreeItems: [{masteryId: 6121}, null, {masteryId: 6122}]}],
    Resolve: [{masteryTreeItems: [{masteryId: 6121}, null, {masteryId: 6122}]}]
  },
  data: {
    6121: {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5},
    6122: {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
  }
};

const masteriesDataAltered = [
  {
    name: 'Ferocity',
    tiers: [
      [
        {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
        {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
      ],
      [
        {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5},
        {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5},
        {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
      ]
    ]
  },
  {
    name: 'Cunning',
    tiers: [[
      {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
    ]]
  },
  {
    name: 'Resolve',
    tiers: [[
      {id: 0, description: ['test6121'], image: {full: '6121.png'}, ranks: 5}, null,
      {id: 1, description: ['test6122'], image: {full: '6122.png'}, ranks: 5}
    ]]
  }
];

let providers = () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: ActivatedRoute, useValue: new MockActivatedRoute()},

        BaseRequestOptions, {provide: MockBackend, useValue: new MockMockBackend()}, {
          provide: Http,
          useFactory: (backend, defaultOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },

        LolApiService, MasteryCategoryComponent, MasteriesComponent
      ]
    });
  });
};

describe('MasteriesComponent', () => {
  providers();

  let component: MasteriesComponent;
  beforeEach(async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    tcb.createAsync(MasteriesComponent).then((fixture: ComponentFixture<MasteriesComponent>) => {
      fixture.detectChanges();
      component = fixture.componentInstance;
      component.data = masteriesDataAltered;
      fixture.detectChanges();
    });
  })));

  it('should be initialised', () => {
    expect(component.data).toBeDefined();
    expect(component.children).toBeDefined();
  });

  it('should enable', () => {
    let mastery = component.children.toArray()[0].children.toArray()[0].children.toArray()[0];
    mastery.enabled = false;
    component.enable();
    expect(mastery.enabled).toBeTruthy();
  });
  it('should disable', () => {
    let mastery = component.children.toArray()[0].children.toArray()[0].children.toArray()[0];
    mastery.enabled = true;
    component.disable();
    expect(mastery.enabled).toBeFalsy();
  });

  it('should get rank', () => {
    component.children.toArray()[0].children.toArray()[0].children.toArray()[0].setRank(2);
    component.children.toArray()[1].children.toArray()[0].children.toArray()[0].setRank(2);
    expect(component.getRank()).toBe(4);
  });

  it('should disable when rank is higher than 30', () => {
    spyOn(component, 'disable');
    expect(component.disable).not.toHaveBeenCalled();
    let tier = component.children.toArray()[0].children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(30);
    component.rankAdd({tier: tier, mastery: mastery});
    expect(component.disable).toHaveBeenCalled();
  });
  it('should enable when rank is 29', () => {
    spyOn(component, 'enable');
    expect(component.enable).not.toHaveBeenCalled();
    let tier = component.children.toArray()[0].children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(29);
    component.rankRemove({tier: tier, mastery: mastery});
    expect(component.enable).toHaveBeenCalled();
  });
  it('should not enable when rank is not 29', () => {
    spyOn(component, 'enable');
    expect(component.enable).not.toHaveBeenCalled();
    let tier = component.children.toArray()[0].children.toArray()[0];
    let mastery = tier.children.toArray()[0];
    mastery.setRank(30);
    component.rankRemove({tier: tier, mastery: mastery});
    expect(component.enable).not.toHaveBeenCalled();
  });

  it('should remove ranks when the total rank passes 30', () => {
    let tier1 = component.children.toArray()[0].children.toArray()[0];
    let tier2 = component.children.toArray()[1].children.toArray()[0];
    let mastery1 = tier1.children.toArray()[0];
    let mastery2 = tier1.children.toArray()[1];
    let mastery3 = tier2.children.toArray()[0];
    mastery1.setRank(2);
    mastery2.setRank(30);
    component.rankAdd({tier: tier1, mastery: mastery1});
    expect(mastery1.getRank()).toBe(2);
    expect(mastery2.getRank()).toBe(28);
    mastery1.setRank(2);
    mastery2.setRank(0);
    mastery3.enabled = true;
    mastery3.setRank(30);
    component.rankAdd({tier: tier1, mastery: mastery1});
    expect(mastery1.getRank()).toBe(0);
    expect(mastery3.getRank()).toBe(30);
  });
});

describe('MasteriesComponent', () => {
  providers();

  it('should get masteries',
     async(inject(
         [MockBackend, MasteriesComponent, LolApiService],
         (mockBackend, component: MasteriesComponent, service: LolApiService) => {
           mockBackend.subscribe(false, masteriesData);

           component.ngOnInit();
           return service.getMasteries().subscribe(
               () => {
                 expect(component.data).toHaveEqualContent(masteriesDataAltered);
               },
               () => {
                 fail('unexpected failure');
               });
         })));

  it('should not get masteries',
     async(inject(
         [MockBackend, MasteriesComponent, LolApiService], (mockBackend, component, service) => {
           mockBackend.subscribe();

           spyOn(component, 'transformData');
           expect(component.transformData).not.toHaveBeenCalled();
           component.ngOnInit();
           return service.getMasteries().subscribe(
               () => {
                 fail('unexpected success');
               },
               () => {
                 expect(component.transformData).not.toHaveBeenCalled();
                 expect(component.error).toBeTruthy();
               });
         })));
});
