import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromTrainifng from './training.reducer';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private sore: Store<fromTrainifng.State>) { }

  ngOnInit() {
   this.ongoingTraining$ = this.sore.select(fromTrainifng.getIsTraining);
  }

}
