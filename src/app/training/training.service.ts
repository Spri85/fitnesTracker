import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import * as UI from '../shared/ui.actions';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class TrainingService {

    constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromTraining.State>) { }

    private fbSub: Subscription[] = [];

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSub.push(this.db
            .collection('availableExercise')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        ...doc.payload.doc.data()
                    } as Exercise;
                });
            })
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            },
                (error) => {
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000)
                }
            ));
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSub.push(
            this.db
                .collection('finishedExercises')
                .valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    this.store.dispatch(new Training.SetFinishedTrainings(exercises));
                }
                ));
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscription() {
        this.fbSub.forEach(sub => sub.unsubscribe());
    }
}