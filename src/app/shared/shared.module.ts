import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [],
    imports: [ 
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    providers: [],
})
export class SharedModule {}