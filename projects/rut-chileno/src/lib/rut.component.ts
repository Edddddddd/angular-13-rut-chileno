import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'rut-chile',
  template: `
  <input type="text"
  [(ngModel)] = "rut_chileno"
  (focus)="rutFormat($event)"
  (keydown)="rutFormat($event)"
  (keyup)="rutFormat($event)"
  (keypress)="validaRUT($event)"
  (blur)="validaRUT($event)"
  class="input-rut rut" name="username" id="rut_chileno" placeholder="Rut">
  <small class="danger-rut" [hidden]="!validacionRut">
      {{msjE}}
  </small>
  `,
  styles: [
  ]
})
export class RutComponent implements OnInit {

  @Output() rut_emiter = new EventEmitter<string | number | undefined | null >();
  @Input() mode!: number;
  @Input() msjError!: string;
  @Input() obligatorio: boolean = false;

  validacionRut!: boolean;
  rut_chileno!: string;
  msjE!:string;

  constructor() { }

  ngOnInit(): void {
    if(!this.msjError)
      this.msjE = "El rut ingresado no es válido.    GJHGHG";
    else
      this.msjE = this.msjError;
  }

  isRutObligatorio() : void  {
    if (!this.obligatorio) {
      this.validacionRut = false;
      this.rut_emiter.emit(undefined);
    }   
  }

  isRutEmpy(rut: string) : boolean {
    return rut ==='' || rut === null || rut === undefined;
  }

  rutFormat(event: Event): void {
    const target = event.target as HTMLInputElement;

    const rut: string = this.rutClean(target.value);
    if (rut.length <= 1) {
      return;
    }

    let result = `${rut.slice(-4, -1)}-${rut.substr(rut.length - 1)}`;
    for (let i = 4; i < rut.length; i += 3) {
      result = `${rut.slice(-3 - i, -i)}.${result}`;
    }

    this.rut_chileno = result;    
    if (this.isRutEmpy(target.value)) this.isRutObligatorio();
  }

  rutClean(value: string): string {
    return typeof value === 'string' ? value.replace(/[^0-9kK]+/g, '').toUpperCase() : '';
  }
  
  validaRUT(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.validacionRut = this.validaRUT_(target.value);
    this.sendEmiterRut(this.rut_chileno);
    if (this.isRutEmpy(target.value)) this.isRutObligatorio();
  }

  validaRUT_(rut: string): boolean {
    let valor: string = rut;
    valor = this.rutClean(valor);
  
    const cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1).toUpperCase();
  
    if (cuerpo.length < 7 && cuerpo.length >= 0) {
      return true;
    }
  
    let suma = 0;
    let multiplo = 2;
  
    for (let i = 1; i <= cuerpo.length; i++) {
      const index = multiplo * Number(valor.charAt(cuerpo.length - i));
      suma = suma + index;
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }
    }
  
    const dvEsperado = 11 - (suma % 11);
    dv = dv === 'K' ? '10' : dv;
    dv = dv === '0' ? '11' : dv;
  
    if (dvEsperado.toString() !== dv && cuerpo.length >= 0)
      return true;
    else 
      return false;
  }

  sendEmiterRut(rut: string): void {
    if(!this.validacionRut) {
      switch (this.mode) {
        case 0:
          this.rut_emiter.emit(this.rutClean(rut));
          break;
        case 1:
          let valor: string = rut;
          this.rut_emiter.emit(this.rutClean(valor).slice(0, -1));
          break;
        case 2:
          this.rut_emiter.emit(rut);
          break;
        case 3:
            let r: string = rut;
            this.rut_emiter.emit(this.rutClean(r).slice(0, -1) + '-'+ r.slice(-1).toUpperCase());
            break;  
        case 4:
          let ru: string = rut;
          this.rut_emiter.emit(this.rutClean(ru).slice(-1).toUpperCase());
          break;    
      }
    } else {
      this.rut_emiter.emit(undefined);
    }
      
  }

}
