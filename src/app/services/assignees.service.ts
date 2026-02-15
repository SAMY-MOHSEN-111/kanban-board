import {inject, Injectable} from '@angular/core';
import {AssigneesRepository} from '@app/repositories/assignees.repository';
import {toSignal} from '@angular/core/rxjs-interop';
import {Assignee} from '@app/models/assignee.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssigneesService {
  readonly #assigneesRepository = inject(AssigneesRepository);
  assignees = toSignal(this.#assigneesRepository.getAll(), {initialValue: []});

  getAssigneeById(id: string): Observable<Assignee> {
    return this.#assigneesRepository.getAssigneeById(id);
  }
}
