import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutService {
  private _subject = new Subject<any>();

  constructor() { }

  clearInputService(event: any) {
    this._subject.next(event);
  }

  get events$ () {
    return this._subject.asObservable();
  }

  rutFormat(value: string): string | undefined {
    const rut: string = this.rutClean(value);
    if (rut.length <= 1) {
      return;
    }
 
    let result = `${rut.slice(-4, -1)}-${rut.substr(rut.length - 1)}`;
    for (let i = 4; i < rut.length; i += 3) {
      result = `${rut.slice(-3 - i, -i)}.${result}`;
    }

    return result;
  }

  rutClean(value: string | undefined): string {
    return typeof value === 'string' ? value.replace(/[^0-9kK]+/g, '').toUpperCase() : '';
  }
  
  validaRUT(rut: string): boolean {
    let valor: string = rut;
    valor = this.rutClean(valor);
  
    // Aislar Cuerpo y Dígito Verificador
    const cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1).toUpperCase();
  
    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    if (cuerpo.length < 7 && cuerpo.length >= 0) {
      return true;
    }
  
    // Calcular Dígito Verificador
    let suma = 0;
    let multiplo = 2;
  
    // Para cada dígito del Cuerpo
    for (let i = 1; i <= cuerpo.length; i++) {
      // Obtener su Producto con el Múltiplo Correspondiente
      const index = multiplo * Number(valor.charAt(cuerpo.length - i));
  
      // Sumar al Contador General
      suma = suma + index;
  
      // Consolidar Múltiplo dentro del rango [2,7]
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }
    }
  
    // Calcular Dígito Verificador en base al Módulo 11
    const dvEsperado = 11 - (suma % 11);
  
    // Casos Especiales (0 y K)
    dv = dv === 'K' ? '10' : dv;
    dv = dv === '0' ? '11' : dv;
  
    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado.toString() !== dv && cuerpo.length >= 0) {
      return true;
    } else {
      return false;
    }

  }


  getRutChile(mode: number ,rut: string): string | boolean | undefined {

    if(!this.validaRUT(rut)) {
      switch (mode) {
        // el rut limpio 184215551
        case 0:
          return this.rutClean(rut);
        // solo el cuerpo del rut  18421555
        case 1:
          let valor: string = rut;
          valor = this.rutClean(valor);
          let cuerpo = valor.slice(0, -1);
          return cuerpo;
        // rut formateado 18.421.555-1
        case 2:
          return this.rutFormat(rut);          
        // rut cuerpo - digitov : 18421555-1  
        case 3:
            let r: string = rut;
            r = this.rutClean(r);
            const c = r.slice(0, -1);
            let dv = r.slice(-1).toUpperCase();
            return c + '-'+ dv;
        case 4:
          let ru: string = rut;
          ru = this.rutClean(ru);
          let div = ru.slice(-1).toUpperCase();
          return div; 
      }
    } else {
      return false;
    }
      
  }


  validaRutForm(control: AbstractControl): { [key: string]: boolean } | null {
    
    if (control.value == null || control.value === 'undefined' || control.value === "" ) {
      // TODO: RETORNA TRUE YA QUE LA IDEA ES USAR Validators.required
      return null;
    } else {

      let rut: string = control.value;
    
      let valor: string = (rut || '').replace(/[^0-9kK]+/g, '').toUpperCase();
     
      // Aislar Cuerpo y Dígito Verificador
      const cuerpo = valor.slice(0, -1);
      let dv = valor.slice(-1).toUpperCase();
    
      // Si no cumple con el mínimo ej. (n.nnn.nnn)
      if (cuerpo.length < 7 && cuerpo.length >= 0) {
        return {
          rutnovalido: true
        };
      }
    
      // Calcular Dígito Verificador
      let suma = 0;
      let multiplo = 2;
    
      // Para cada dígito del Cuerpo
      for (let i = 1; i <= cuerpo.length; i++) {
        // Obtener su Producto con el Múltiplo Correspondiente
        const index = multiplo * Number(valor.charAt(cuerpo.length - i));
    
        // Sumar al Contador General
        suma = suma + index;
    
        // Consolidar Múltiplo dentro del rango [2,7]
        if (multiplo < 7) {
          multiplo = multiplo + 1;
        } else {
          multiplo = 2;
        }
      }
    
      // Calcular Dígito Verificador en base al Módulo 11
      const dvEsperado = 11 - (suma % 11);
    
      // Casos Especiales (0 y K)
      dv = dv === 'K' ? '10' : dv;
      dv = dv === '0' ? '11' : dv;
    
      // Validar que el Cuerpo coincide con su Dígito Verificador
      if (dvEsperado.toString() !== dv && cuerpo.length >= 0) {
        return {
          rutnovalido: true
        };
      } else {
        return null;
      }
    }

  }


  getRutChileForm(mode: number ,rut: string): string | boolean | undefined {

      switch (mode) {
        case 0: // el rut limpio 184215551
          return this.rutClean(rut);
        case 1: // rut formateado 18.421.555-1
          return this.rutFormat(rut);          
        case 2: // rut cuerpo - digitov : 18421555-1 
            let r: string = rut;
            r = this.rutClean(r);
            const c = r.slice(0, -1);
            let dv = r.slice(-1).toUpperCase();
            return c + '-'+ dv;
      }
      
  }

  isRutEmpy(rut: string) : boolean {
    return rut ==='' || rut === null || rut === undefined;
  }

}
