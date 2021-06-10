import { AppSettings } from './../../services/app-settings';
import { DocumentItem } from './../../model/document_item.model';
import { KrameriusApiService } from './../../services/kramerius-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { Translator } from 'angular-translator';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html'
})
export class DocumentCardComponent implements OnInit {
  @Input() item: DocumentItem;
  @Input() in: String;

  public thumb;

  constructor(private krameriusApiService: KrameriusApiService,
              public settings: AppSettings,
              private translator: Translator,
              public auth: AuthService,
              public analytics: AnalyticsService,
              private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.thumb = this.init();
  }

  public getTitle() {
    return this.item.getTitle ? this.item.getTitle(this.translator.language) : this.item.title;
  }

  public getDescription() {
    return this.item.getDescription ? this.item.getDescription(this.translator.language) : this.item.description;
  }

  private init() {
    let url = '';
    if (this.item.library) {
      const krameriusUrl = this.settings.getUrlByCode(this.item.library);
      url = this.krameriusApiService.getThumbUrlForKramerius(this.item.uuid, krameriusUrl);
    } else {
       url = this.krameriusApiService.getThumbUrl(this.item.uuid);
    }
    return this._sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }


}
