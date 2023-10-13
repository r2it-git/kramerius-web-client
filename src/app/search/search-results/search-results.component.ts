import { SearchService } from './../../services/search.service';
import { DocumentItem } from './../../model/document_item.model';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { KrameriusApiService } from './../../services/kramerius-api.service';
import { AppSettings } from './../../services/app-settings';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FolderService } from '../../services/folder.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  
  displayRows: boolean = false;

  constructor(public searchService: SearchService,
              private krameriusApiService: KrameriusApiService,
              private settings: AppSettings,
              private _sanitizer: DomSanitizer,
              private snackBar: MatSnackBar,
              private localStorageService: LocalStorageService,
              private folderService: FolderService,
              private authService: AuthService,
              private translate: TranslateService) {
    
  }

  ngOnInit() {
    this.displayRows = this.localStorageService.getProperty(LocalStorageService.DEV_MODE) === '1';
    if (this.authService.user && this.authService.user.authenticated) {
      this.folderService.getFolders(null);
    }
  }
  
  getThumb(item: DocumentItem) {
    let url = '';
    if (item.library) {
      const krameriusUrl = this.settings.getUrlByCode(item.library);
      url = this.krameriusApiService.getThumbUrlForKramerius(item.uuid, krameriusUrl);
    } else {
       url = this.krameriusApiService.getThumbUrl(item.uuid);
    }
    return this._sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }
  onCopied(callback) {
    if (callback && callback['isSuccess']) {
      this.snackBar.open(<string> this.translate.instant('common.copied_to_clipboard'), '', { duration: 2000, verticalPosition: 'bottom' });
    }
  }
  ngOnDestroy(): void {
    this.folderService.folders = null;
  }

}
