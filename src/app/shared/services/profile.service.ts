import {Injectable} from '@angular/core';
import {Headers, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Profile} from 'model/Profile';
import {AuthHttp} from 'angular2-jwt';
import {AppConfig} from 'app/app.config';
import {BaseService} from './base.service';
import {DataSetShort} from 'model/DataSetShort';
import {UserShort} from 'model/UserShort';
import {SavedSearch} from 'model/SavedSearch';
import {WatchedDataset} from 'model/WatchedDataset';
import {ConnectionData} from 'model/ConnectionData';
import {LogService} from '@shared/modules/logs/services/log.service';
import {CookieUtils} from '@shared/utils/cookie-utils';


@Injectable()
export class ProfileService extends BaseService {

    constructor(private http: AuthHttp,
                public appConfig: AppConfig,
                private logger: LogService) {
        super();
    }

    setProfile(profile: Profile): void {
        localStorage.removeItem('profile');
        localStorage.setItem('profile', JSON.stringify(profile));
    };
    removeProfile() {
        localStorage.removeItem('profile');
    };
    getProfileFromLocal(): Profile {
        return JSON.parse(localStorage.getItem('profile'));
    };

    getProfile(): Observable<Profile> {
        return this.http.get(this.appConfig.getProfileUrl(null)) // ,config // { withCredentials: true }
            .map(x => this.extractData<Profile>(x));
        // .catch(this.handleError);
    }

    getPublicProfile(username): Observable<Profile> {
        let _profile;
        return this.http.get(this.appConfig.getProfileUrl(username)) // ,config //{ withCredentials: true }
            .map(x => {
                _profile = this.extractData<Profile>(x);
                if (!_profile) {
                    this.logger.debug('public profile not received');
                } else {
                    this.logger.debug('public profile received: {}', _profile.userId);
                }
                return _profile;
            });
        // .catch(this.handleError);
    }

    getAllProfiles(): Observable<Profile[]> {
        let _profiles;
        return this.http.get(this.appConfig.getAllProfilesUrl()) // ,config //{ withCredentials: true }
            .map(x => {
                _profiles = this.extractData<Profile[]>(x);
                if (!_profiles) {
                    this.logger.debug('public profile not received');
                } else {
                    this.logger.debug('public profiles received: {}', _profiles.length);
                }
                return _profiles;
            })
            .catch(this.handleError);
    }

    getUserConnections(userId: string): Observable<string[]> {
        return this.http.get(this.appConfig.getUserConnectionsUrl(userId)) // { withCredentials: true }
            .map(x => this.extractData<string[]>(x));
        // .catch(this.handleError);
    }

    getUserConnection(userId: string, provider: string): Observable<ConnectionData> {
        return this.http.get(this.appConfig.getUserConnectionUrl(userId, provider)) // { withCredentials: true }
            .map(x => this.extractData<ConnectionData>(x))
            .catch(this.handleError);
    }

    deleteConnection(userId: string, provider: string): Observable<any> {
        const deleteConnectionUrl = this.appConfig.getDeleteConnectionUrl(userId, provider);
        return this.http.delete(deleteConnectionUrl)
            .map(res => res.json())
            .catch(this.handleError);
    }

    getCoAuthors(userId: string): Observable<UserShort[]> {
        return this.http.get(this.appConfig.getUserCoAuthorsUrl(userId))//
            .map(x => this.extractData<UserShort[]>(x));
        // .catch(this.handleError);
    }

    public updateUser(profile: Profile): Observable<string> {

        const headers = new Headers();
        /**
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let authToken = this.getParameterByName("auth");
        if(authToken) {
            headers.append('X-AUTH-TOKEN', authToken);
        }**/

        const config: RequestOptionsArgs = {headers: headers};
        // $http.post(url, config) .success ...

        return this.http.post(this.appConfig.getProfileUrl(null), JSON.stringify(profile), config)
            .map(res => {
                return 'OK';
            });
    }

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        this.logger.error(errMsg);
        return Observable.throw(errMsg);
    }

    public saveDataSets(userID: string, datasets: DataSetShort[]) {
        let r: string;
        this.http.put(this.appConfig.getProfileSaveDatasetsUrl(userID), JSON.stringify(datasets))
            .map(res => res.json()).subscribe(data => {
            r = data;
        });
    }

    public claimDataset(userID: string, dataset: DataSetShort) {
        this.http.post(this.appConfig.getProfileClaimDatasetUrl(userID), JSON.stringify(dataset))
            .subscribe(x => {});
    }

    public connect(provider: string) {

        const form = document.createElement('form');

        form.method = 'POST';
        form.action = this.appConfig.getConnectUrl(provider);


        // /element1.value = localStorage.getItem("id_token");
        // /element1.name = "X-AUTH-TOKEN";
        // /form.appendChild(element1);

        document.body.appendChild(form);
        const expire = new Date(new Date().getTime() + 30 * 24 * 3600 * 1000);
        CookieUtils.setCookie('X-AUTH-TOKEN',
            localStorage.getItem('id_token'), this.appConfig.getConnectCookiePath(provider), expire);

        form.submit();
    }

    getSavedSearches(userId: string): Observable<SavedSearch[]> {
        return this.http.get(this.appConfig.getUserSavedSearchesUrl(userId))//
            .map(x => this.extractData<SavedSearch[]>(x));
        // .catch(this.handleError);
    }

    saveSavedSearch(savedSearch: SavedSearch) {
        this.logger.debug('Saving saved search');
        this.http.post(this.appConfig.getUserSavedSearchesUrl(savedSearch.userId), JSON.stringify(savedSearch)).subscribe(
            x => {
                this.logger.debug('Search saved saved');
            }
        );
    }

    deleteSavedSearch(userId: string, id: string): Observable<String> {
        return this.http.delete(this.appConfig.getUserSavedSearchesDeleteUrl(userId, id)).map(
            x => 'ok'
        ).catch(this.handleError);
    }

    getWatchedDatasets(userId: string): Observable<WatchedDataset[]> {
        return this.http.get(this.appConfig.getWatchedDatasetsUrl(userId))//
            .map(x => this.extractData<WatchedDataset[]>(x));
        // .catch(this.handleError);
    }

    saveWatchedDataset(watchedDataset: WatchedDataset) {
        this.logger.debug('Saving saved search');
        this.http.post(this.appConfig.getWatchedDatasetsUrl(watchedDataset.userId), JSON.stringify(watchedDataset)).subscribe(
            x => {
                this.logger.debug('Watched dataset saved');
            }
        );
    }

    deleteWatchedDataset(userId: string, id: string): Observable<String> {
        return this.http.delete(this.appConfig.getWatchedDatasetsDeleteUrl(userId, id)).map(
            x => 'ok');
        // ).catch(this.handleError);
    }

    getUsersCount(): Observable<number> {
        return this.http.get(this.appConfig.getUserCountUrl()).map(x => this.extractData<number>(x));
    }

    setSelected(userId: string, datasets: DataSetShort[]): Observable<String> {
        return this.http.post(this.appConfig.getSelectedDatasetsUrl(userId), JSON.stringify(datasets)).map(
            x => 'ok');
        // ).catch(this.handleError);
    }

    getSelected(userId: string): Observable<DataSetShort[]> {
        return this.http.get(this.appConfig.getSelectedDatasetsUrl(userId))//
            .map(x => this.extractData<DataSetShort[]>(x));
        // .catch(this.handleError);
    }

    getAdminUsers() {
        return this.http.get('static/adminUser/adminUser.json');
    }
}






