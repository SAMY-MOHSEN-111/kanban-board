import {inject, Injectable} from '@angular/core';
import {AssigneesRepository} from '@app/repositories/assignees.repository';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AssigneesService {
  readonly #assigneesRepository = inject(AssigneesRepository);
  assignees = toSignal(this.#assigneesRepository.getAll(), {initialValue: []});
}
