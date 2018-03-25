import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {

    constructor(private db: AngularFirestore, private uiService: UIService){}
    
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    exerciseChanged = new Subject<Exercise>();
    
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private finishedExercises: Exercise[] = [];
    private fbSub: Subscription[] = [];

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
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
            this.uiService.loadingStateChanged.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        },
        (error) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000)
            this.exerciseChanged.next(null);
        }
    ));
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercise/' + selectedId).update({lastSelected: new Date()});
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({...this.runningExercise});
    }

    getRunningExercise(): Exercise {
        return { ...this.runningExercise };
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSub.push(this.db.collection('finishedExercises').valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
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