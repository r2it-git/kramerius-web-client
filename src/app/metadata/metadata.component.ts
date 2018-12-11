import { ActivatedRouteSnapshot } from '@angular/router';
import { DialogAuthosComponent } from './../dialog/dialog-authors/dialog-authors.component';
import { AppSettings } from './../services/app-settings';
import { Metadata } from './../model/metadata.model';
import { Component, OnInit, Input } from '@angular/core';
import { DialogShareComponent } from '../dialog/dialog-share/dialog-share.component';
import { MzModalService } from 'ngx-materialize';
import { DialogMetadataComponent } from '../dialog/dialog-metadata/dialog-metadata.component';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html'
})
export class MetadataComponent implements OnInit {
  public controlsEnabled = true;

  @Input() set showControls(value: boolean) {
    this.controlsEnabled = value;
  }
  @Input() metadata: Metadata;
  showingTitle = false;

  constructor(private modalService: MzModalService, public appSettings: AppSettings) { }

  ngOnInit() {
  }

  showTitle() {
    this.showingTitle = !this.showingTitle;
  }

  showModsDialog() {
    this.modalService.open(DialogMetadataComponent, { map: this.metadata.modsMap} );
  }

  showAuthors() {
    this.modalService.open(DialogAuthosComponent, { authors: this.metadata.authors} );
  }

  onShare() {
    const link = this.getPagePersistentLink();
    if (link) {
      const options = {
        link: this.getPagePersistentLink()
      };
      this.modalService.open(DialogShareComponent, options);
    }
  }


  private getPagePersistentLink() {
    const path = location.pathname;
    const query = location.search;
    let uuid: string;
    if (path.indexOf('uuid:') > -1) {
      uuid = path.substr(path.indexOf('uuid:'), 41);
    }
    if (!uuid) {
      return;
    }
    if (query.indexOf('article=uuid:') > -1) {
      uuid = query.substr(query.indexOf('article=uuid:') + 8, 49);
    }
    if (query.indexOf('page=uuid:') > -1) {
      uuid = query.substr(query.indexOf('page=uuid:') + 5, 46);
    }

    let url: string;
    if (this.appSettings.share_url) {
      if (this.appSettings.multiKramerius) {
        url = this.appSettings.share_url.replace(/\$\{UUID\}/, uuid).replace(/\$\{KRAMERIUS\}/, this.appSettings.code);
      } else {
        url = this.appSettings.share_url.replace(/\$\{UUID\}/, uuid);
      }
    } else {
      if (this.appSettings.multiKramerius) {
        url = location.protocol + '//' + location.host + '/' + this.appSettings.code + '/uuid/' + uuid;
      } else {
        url = location.protocol + '//' + location.host + '/uuid/' + uuid;
      }
    }
    return url;
  }

}
