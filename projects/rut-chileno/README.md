
# Rut Chileno

Validacion, implementacion en input, formater en Angular de la Cedula de intentidad Chilena.

Ahora compatible con @angular/forms

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

# Estos son los formatos de RUT compatibles!
 - 184215551
 - 18421555
 - 18.421.555-1
 - 18421555-1

### Instalacion

Dillinger requires [Node.js](https://nodejs.org/) v12+ to run.
Para la instalacion de esta liberia solo debes ejecutar el siguiente comando en tu proyecto.

```sh
$ npm i rut-chileno
```


### Para utilizarlo con forms.

1.- Importar el modulo en tu AppModule

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RutModule } from 'rut-chileno'; // <- aqui debes importarlo 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RutModule, // // <- aqui debes importarlo
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

2.- En el tu component ts puedes definir tu formulario con el campo e importar la validacion de este.

Para este caso utilice un formulario con un nombre y un rut


```ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RutService } from 'rut-chileno';

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
      rut: ["", [Validators.required, this.rutService.validaRutForm]], // <- Aqui es donde viene el validador la funcion validaRutForm la cual retorna un null o un objeto { [key: string]: boolean } 
    });
  }

  get f(){
    return this.form.controls;
  }

  save() {
    console.log(this.form)
    if (this.form.valid) {
      this.formValid = "Form valid ";
    }
    console.log(this.form.value);
  }
  
}
```

3.- En el html se debe utilizar como un formulario normal
pero en el caso de la validación se debe tener en cuenta que el key del objeto es 'rutnovalido' y debe ser implementado de la siguiente manera.

```html
<div>
  
    <form ngNativeValidate (ngSubmit)= 'save()' [formGroup]= "form">
      <div class= 'form-group'>
      <br>
      Nombre:<input id="name" class='form-control' type="text" formControlName= "firstname" required><br>
      Rut:<input id="rut" class='form-control' type="text" 
      formControlName= "rut" required><br>
          
    </div>
      <span *ngIf= "form.get('rut')?.errors?.['rutnovalido']">El rut no es valido</span><br>
      <button class="btn btn-primary">Submit</button>
    </form>
    <p>
      {{formValid}}
    </p>
</div>

```

4.- En el caso de que sea necesario completar con el formato a medida que se va escribiendo el rut en el input se puede implementar de la siguiente manera.

En el html se puede incorporar el InputEvent en una función 

```ts
(input)="inputEvent($event)" 
```

```html
Rut:<input id="rut" class='form-control' type="text" 
      (input)="inputEvent($event)" 
```

En el componente la funcion deberia responder de la siguiente manera

```ts
  inputEvent(event : Event) {
    let rut = this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
    if (rut)
      this.form.controls['rut'].patchValue(rut, {emitEvent :false});
  }
```
en donde la funcion 'getRutChileForm' tiene 3 modalidades:
caso 0: -> el rut limpio 184215551
caso 1: -> rut formateado 18.421.555-1
caso 2: -> rut cuerpo - digitov : 18421555-1 
Este valor se envia en el primer campo.

El segundo campo corresponde al InputEvent capturado desde el HTML

```ts
this.rutService.getRutChileForm(1, (event.target as HTMLInputElement).value)
```
Importante tener encuenta la siguiente validación para que el campo se auto complete correctamente.

```ts
    if (rut)
      this.form.controls['rut'].patchValue(rut, {emitEvent :false});
```

Con esto la implementación deberia funcionar correctamente 

Tambien puedes revisar el ejemplo completo en [StackBlitz](https://github.com/angular/angular-cli)




### Para utilizarlo sin forms.

Debes importarlo en tu app.module.ts de la siguiente forma:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RutModule } from 'rut-chileno' // <- aqui debes importarlo 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RutModule // // <- aqui debes importarlo
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
con esto ya podras utilizarlo la libreria en tu componente html.


### Como usarlo.

En el html de tu componente puedes utilizar el siguiente tag "rut-chile":

```html
<rut-chile [msjError]="El rut ingresado no es válido." [mode]="0" (rut_emiter)="getRut($event)"></rut-chile>
```
Se añadio la variable para definir si este caso es obligatorio el uso del rut por defecto su valor es falso
ejemplo:

```html
<rut-chile [obligatorio]="true" [msjError]="El rut ingresado no es válido." [mode]="0" (rut_emiter)="getRut($event)"></rut-chile>
```

Esta funcion aun no es compatible con los formularios reactivos.


La variable "mode" corresponde al formato en que sera utilizado el rut para esto puede devolver los siguiente formatos segun el valor que corresponda.

 - mode = 0 -> 184215551
 - mode = 1 -> 18421555
 - mode = 2 -> 18.421.555-1
 - mode = 3 -> 18421555-1
 - mode = 4 -> devuelve solo el digito verificado

El tag "rut-chile" dispondra de un input con las siguientes caracteristicas:

 - class="input-rut rut" 
 - name="username"
 - id="rut_chileno" 
 - placeholder="Rut"

La variable "rut_emiter" corresponde al rut emitido como string segun lo ingresado, por lo cual puedes puedes definir una funcion "getRut" que pueda recibir este envento.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'use-rut';

  getRut(rut: string): void {
    console.log(rut);
  }
}

```

#### Tambien se dejaron a disposición una funciones para que lo puedas utilizar como gustes.
Para ello debes importar el "RutService" en tu componente de la siguiente forma:
```ts

import { Component } from '@angular/core';
import { RutService } from 'rut-chileno' // <- importar aqui

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'use-rut';

  constructor(
    private rutService: RutService // <- utilizar aqui
  ) {

  }

  getRut(rut: string): void {
    console.log(rut);

    // Recibe 2 variables el rut como string.
    // "mode" el cual corresponde a la misma definicion anterior
    // - mode = 0 -> 184215551
    // - mode = 1 -> 18421555
    // - mode = 2 -> 18.421.555-1
    // - mode = 3 -> 18421555-1
    // - mode = 4 -> devuelve solo el digito verificado.
    // Retorna lo siguiente : string | boolean
    // PERO actualmente solo retorna: string | boolean
    //
    // En fin: retornara string solo cuando el rut sea valido
    // y sera el rut en el formato indicado segun el mode
    // retornara un boolean cuando el rut no sea valido.

    let out1_rut = this.rutService.getRutChile(0, rut);
    console.log(out1_rut);
    
    // Solo recibe el rut como string 
    // y lo retorna sin los caracteres espciales
    let out2_rut = this.rutService.rutClean(rut);
    console.log(out2_rut);

    // Esta funcion recibe el rut en el formato que sea
    // lo retorna listo con todos los puntos y guiones
    let out3_rut = this.rutService.rutFormat(rut);
    console.log(out3_rut);

    // Esta funcion recibe el rut en el formato que sea
    // y retorna un boolean OJO.
    // true cuando el rut NO es valido
    // false cuando es el rut SI es valdo
    let out4_rut = this.rutService.validaRUT(rut);
    console.log(out4_rut);

    // Tambien hay una variable ahi. no la uso pero esta ahi.
    // vo dale
    let out5_rut = this.rutService.rut_chileno;
    console.log(out5_rut);

  }
}

```


 #### Se incluye una nuava funcion para hacer limpiar el campo
 Su implementacion es la siguiente 

 ```ts

  clearInputButton() : void {
    this.rutService.clearInputService(true);
  }

 ```
 La funcion "clearInputButton()" puede ser llamado desde el lugar que usted desee
 el service "rutService" emite un booleano en este caso "true para limpiar el input

 Se agradece la observación y la ayuda en la implementación al desarrollador

 [Fernando Riffo](https://github.com/FernandoRiffo)

 Muchas gracias compa!