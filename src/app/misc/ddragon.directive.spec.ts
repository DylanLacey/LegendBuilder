import {provide, ElementRef} from 'angular2/core';
import {Router, RouteRegistry, Location, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {BaseRequestOptions, Http} from 'angular2/http';

import {it, inject, beforeEachProviders} from 'angular2/testing';
import {MockBackend} from 'angular2/http/testing';

import {LolApiService} from '../misc/lolapi.service';
import {DDragonDirective} from './ddragon.directive';

class MockNativeElement {
  private attributes: Array<string> = new Array<string>();
  private attributesNS: Array<string> = new Array<string>();

  constructor(private tagName: string) {
  }

  setAttribute(attr: string, value: string): number {
    return this.attributes.push(attr);
  }
  getAttribute(attr: string): Object {
    return this.attributes.indexOf(attr) > -1 ? {} : null;
  }

  setAttributeNS(scope: string, attr: string, value: string): number {
    return this.attributesNS.push(attr);
  }
  getAttributeNS(attr: string): Object {
    return this.attributesNS.indexOf(attr) > -1 ? {} : null;
  }
}

class MockImageElementRef implements ElementRef {
  nativeElement: MockNativeElement = new MockNativeElement('IMG');
}
class MockSvgImageElementRef implements ElementRef {
  nativeElement: MockNativeElement = new MockNativeElement('IMAGE');
}


describe('DDragonDirective', () => {
  beforeEachProviders(() => [
    ElementRef,
    provide(RouteParams, { useValue: new RouteParams({ region: 'euw' }) }),
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function(backend, defaultOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),

    MockImageElementRef,
    MockSvgImageElementRef,
    LolApiService,
    DDragonDirective
  ]);

  let realm = null;

  beforeEach(() => {
    realm = {
      'v': '1.2.3',
      'cdn': 'http://ddragon.leagueoflegends.com/cdn',
      'n': {
        'champion': '3.2.1',
        'profileicon': '3.2.1',
        'item': '3.2.1',
        'map': '3.2.1',
        'mastery': '3.2.1',
        'language': '3.2.1',
        'summoner': '3.2.1',
        'rune': '3.2.1'
      }
    };
  });


  it('should update on contruct', inject([ElementRef, LolApiService], (elementRef, service) => {
    spyOn(DDragonDirective.prototype, 'updateElement');
    expect(DDragonDirective.prototype.updateElement).not.toHaveBeenCalled();
    let directive = new DDragonDirective(elementRef, service);
    setTimeout(function() {
      expect(DDragonDirective.prototype.updateElement).toHaveBeenCalled();
    }, 500);
  }));

  it('should update on change', inject([DDragonDirective], (directive) => {
    spyOn(directive, 'updateElement');
    expect(directive.updateElement).not.toHaveBeenCalled();
    directive.ngOnChanges();
    expect(directive.updateElement).toHaveBeenCalled();
  }));

  it('should add src attribute for <img [ddragon]="">', inject([MockImageElementRef, LolApiService], (elementRef, service) => {
    let directive = new DDragonDirective(elementRef, service);
    expect(directive.el.nativeElement.getAttribute('src')).toBeNull();
    directive.updateElement(realm);
    expect(directive.el.nativeElement.getAttribute('src')).not.toBeNull();
    expect(true).toBeTruthy();
  }));

  it('should add xlink:href attribute for <svg:image [ddragon]="">', inject([MockSvgImageElementRef, LolApiService], (elementRef, service) => {
    let directive = new DDragonDirective(elementRef, service);
    expect(directive.el.nativeElement.getAttributeNS('xlink:href')).toBeNull();
    directive.updateElement(realm);
    expect(directive.el.nativeElement.getAttributeNS('xlink:href')).not.toBeNull();
  }));

  it('should add style attribute for <img [ddragon]="" [x]="" [y]="">', inject([MockImageElementRef, LolApiService], (elementRef, service) => {
    let directive = new DDragonDirective(elementRef, service);
    directive.x = 0;
    directive.y = 0;
    expect(directive.el.nativeElement.getAttribute('style')).toBeNull();
    directive.updateElement(realm);
    expect(directive.el.nativeElement.getAttribute('style')).not.toBeNull();
  }));

  it('should create a correct style string', inject([DDragonDirective], (directive) => {
    let result = directive.buildStyle('test.png', realm, 0, 0);
    expect(result).toBe('background:url(http://ddragon.leagueoflegends.com/cdn/img/test.png) 0px 0px;');
  }));

  it('should have a default url', inject([DDragonDirective], (directive) => {
    expect(directive.default).toBeDefined();
  }));

  it('should use the default url when image or realm is unavailable', inject([DDragonDirective], (directive) => {
    let result = directive.buildUrl('test.png', null);
    expect(result).toBe(directive.default);
    result = directive.buildUrl('test.png', null);
    expect(result).toBe(directive.default);
  }));

  it('should create a correct url', inject([DDragonDirective], (directive) => {
    let result = directive.buildUrl('test.png', realm);
    expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/img/test.png');
  }));

  it('should create a correct \'ui\' url', inject([DDragonDirective], (directive) => {
    let result = directive.buildUrl('ui/test.png', realm);
    expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/test.png');
  }));

  it('should create a correct \'champion\' url', inject([DDragonDirective], (directive) => {
    let result = directive.buildUrl('champion/test.png', realm);
    expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/3.2.1/img/champion/test.png');
  }));

  it('should create a correct \'junk\' url', inject([DDragonDirective], (directive) => {
    let result = directive.buildUrl('junk/test.png', realm);
    expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/img/junk/test.png');
  }));

  it('should create a correct \'champion/loading\' url', inject([DDragonDirective], (directive) => {
    let result = directive.buildUrl('champion/loading/test.png', realm);
    expect(result).toBe('http://ddragon.leagueoflegends.com/cdn/img/champion/loading/test.png');
  }));
});
