import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutinModule } from './auth-routing.module';



@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent
    ],
    imports: [
        AngularFireAuthModule,
        ReactiveFormsModule,
        SharedModule,
        AuthRoutinModule
    ],
    exports: [],
    providers: [],
})
export class AuthModule {}