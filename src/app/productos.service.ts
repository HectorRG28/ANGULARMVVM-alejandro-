import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseApi = 'http://localhost/phpulse/index.php';

  

  // Mock local data para desarrollo sin backend (persistido en localStorage)
  private storageKey = 'productosData';
  private productosData: any[] = [
    { id: 1, nombre: 'Camiseta', descripcion: 'Camiseta algodón', precio: 19.99 },
    { id: 2, nombre: 'Pantalón', descripcion: 'Pantalón vaquero', precio: 39.99 },
    { id: 3, nombre: 'Zapatos', descripcion: 'Zapatos deportivos', precio: 59.99 }
  ];

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.productosData = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error leyendo productos desde localStorage', e);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.productosData));
    } catch (e) {
      console.error('Error guardando productos en localStorage', e);
    }
  }

  // ==========================
  //   GET - Obtener lista
  // ==========================
  getData(): Observable<any> {
    // Leer desde localStorage antes de devolver
    this.loadFromStorage();
    return of(this.productosData);
  }

  // ==========================
  //   GET BY ID
  // ==========================
  getDataById(id: number): Observable<any> {
    const prod = this.productosData.find(p => p.id === id);
    return of(prod ? prod : null);
  }

  // ==========================
  //   POST - Nuevo producto
  // ==========================
  postData(producto: any): Observable<any> {
    // Crear localmente en el mock
    const nextId = this.productosData.length ? Math.max(...this.productosData.map(p => p.id)) + 1 : 1;
    const nuevo = { id: nextId, ...producto };
    this.productosData.push(nuevo);
    this.saveToStorage();
    return of(this.productosData);
  }

  // ==========================
  //   PUT - Editar producto
  // ==========================
  putData(id: number, producto: any): Observable<any> {
    const idx = this.productosData.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.productosData[idx] = { ...this.productosData[idx], ...producto };
      this.saveToStorage();
    }
    return of(this.productosData);
  }

  // ==========================
  //   DELETE - Borrar producto
  // ==========================
  deleteData(id: number): Observable<any> {
    const idx = this.productosData.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.productosData.splice(idx, 1);
      this.saveToStorage();
    }
    return of(this.productosData);
  }

}
