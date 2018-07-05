import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {EnrichmentInfo} from 'model/EnrichmentInfo/EnrichmentInfo';
import {SynonymResult} from 'model/EnrichmentInfo/SynonymResult';
import {AppConfig} from 'app/app.config';
import {BaseService} from './base.service';

@Injectable()
export class EnrichmentService extends BaseService {
    constructor(private http: Http, private appConfig: AppConfig) {
        super();
    }

    getEnrichmentInfo(repository: string, acc: string): Observable<EnrichmentInfo> {
        return this.http.get(this.appConfig.getEnrichmentUrl(acc, repository))
            .map(x => this.extractData<EnrichmentInfo>(x));
    }

    getSynonyms(repository: string, acc: string): Observable<SynonymResult> {
        return this.http.get(this.appConfig.getSynonymsUrl(acc, repository))
            .map(x => this.extractData<SynonymResult>(x));
    }
}
