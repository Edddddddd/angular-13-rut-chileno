import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RutService } from 'projects/rut-chileno/src/public-api';

export class Customer{
  firstname!: string;
  rut!: string;
}

@Component({
  selector: 'rut-chileno-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  rut : string | any ;
  formValid !:string;
  form!: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder, 
    private rutService: RutService ) {}

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(),
      rut: new FormControl(),
    });

    // FormBuilder example
    this.form = this.fb.group({
      firstname: ["", [Validators.required, Validators.minLength(5)]],
      rut: ["", [Validators.required, this.rutService.validaRutForm]],
    });

  }

  inputEvent(event : Event) {
    let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
    console.log(rut)
    if (rut)
      this.form.controls['rut'].patchValue(rut, {emitEvent :false});
  }

  get f(){
    return this.form.controls;
  }

  save() {
    console.log(this.form)
    if (this.form.valid) {
      this.formValid = "Form valid ";
    } else {
      this.formValid = "";
    }
    console.log(this.form.valid);
  }
  
  getRut(event: Event): void {
    console.log(event) 
    if(event)
      this.rut = event;
  }
}
