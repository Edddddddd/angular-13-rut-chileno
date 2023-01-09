import { NgModule } from '@angular/core';
import { RutComponent } from './rut.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RutComponent
  ],
  imports: [
    FormsModule
  ],
  exports: [
    RutComponent
  ]
})
export class RutModule { }
