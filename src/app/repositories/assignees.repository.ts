import {Observable} from "rxjs";
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {inject, Injectable} from '@angular/core';
import {Assignee} from '@app/models/assignee.model';

@Injectable({providedIn: 'root'})
export class AssigneesRepository {
  readonly #apiUrl = `${environment.apiUrl}/users`;
  readonly #httpClient = inject(HttpClient);

  getAll(): Observable<Assignee[]> {
    return this.#httpClient.get<Assignee[]>(this.#apiUrl);
  }
}
