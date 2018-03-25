import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
]

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes) ],
    exports: [RouterModule],
    providers: [],
})
export class AuthRoutinModule {}