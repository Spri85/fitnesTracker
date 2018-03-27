import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { TrainingComponent } from './training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { TrainingRoutingModule } from './training-routing.module';
import { AuthGuard } from '../auth/auth.guard';
import { StoreModule } from '@ngrx/store';
import { trainingReducer } from './training.reducer';

@NgModule({
    declarations: [
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent,
        TrainingComponent,
        StopTrainingComponent
    ],
    imports: [ 
        SharedModule,
        TrainingRoutingModule,
        StoreModule.forFeature('training', trainingReducer)
     ],
    exports: [],
    providers: [],
    entryComponents: [StopTrainingComponent]
})
export class TrainingModule {}