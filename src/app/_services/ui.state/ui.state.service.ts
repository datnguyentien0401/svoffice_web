import {BehaviorSubject} from "rxjs";
import {UIState} from "./ui.state";
import {Injectable} from "@angular/core";

@Injectable()
export class UiStateService {
  private subject = new BehaviorSubject<UIState>(undefined);
  uiState$ = this.subject.asObservable();

  constructor() {
  }

  setUiState$(uiState: UIState) {
    this.subject.next(uiState);
  }
}
