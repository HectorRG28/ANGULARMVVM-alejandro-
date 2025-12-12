import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

 
private apiUrl = 'http://localhost/phpulse/index.php';  // URL base de la API

// Datos
private clientesData = [
  { id: 1, nombre: 'Alvaro García', email: 'alvagar@example.com', telefono: '123456789' },
  { id: 2, nombre: 'Paula Gorgoño', email: 'paulagor@example.com', telefono: '987654321' },
  { id: 3, nombre: 'Pedro Perez', email: 'pperez@example.com', telefono: '555123456' }
];
    
    constructor(private http: HttpClient) {
      this.loadFromStorage();
    }

  private storageKey = 'clientesData';

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.clientesData = JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error leyendo clientes desde localStorage', e);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.clientesData));
    } catch (e) {
      console.error('Error guardando clientes en localStorage', e);
    }
  }

      // Método genérico para obtener datos (GET)
  getData(action: string): Observable<any> {
        // Si pedimos clientes, leer desde localStorage antes de devolver
        if (action === 'clientes') {
          this.loadFromStorage();
          return of(this.clientesData);
        }
    const url = `${this.apiUrl}?action=${action}`;  // URL dinámica basada en la acción
    return this.http.get<any>(url);  // Hacer la solicitud GET
  }

  // Método genérico para enviar datos (POST)
  postData(action: string, data: any): Observable<any> {
    // Si trabajamos con los datos mock en memoria, manejar la creación localmente
    if (action === 'crear_cliente') {
      this.loadFromStorage();
      const nextId = this.clientesData.length ? Math.max(...this.clientesData.map(c => c.id)) + 1 : 1;
      const nuevo = { id: nextId, ...data };
      this.clientesData.push(nuevo);
      this.saveToStorage();
      return of(this.clientesData);
    }
    const url = `${this.apiUrl}?action=${action}`;  // URL dinámica basada en la acción
    return this.http.post<any>(url, data);  // Hacer la solicitud POST
  }

  // Método genérico para actualizar datos (PUT)
  putData(action: string, data: any): Observable<any> {
    // Si trabajamos con los datos mock en memoria, manejar la edición localmente
    if (action === 'editar_cliente') {
      this.loadFromStorage();
      const id = data.id ?? data?.id;
      const idx = this.clientesData.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.clientesData[idx] = { ...this.clientesData[idx], ...data };
        this.saveToStorage();
      }
      return of(this.clientesData);
    }
    const url = `${this.apiUrl}?action=${action}`;  // URL dinámica basada en la acción
    return this.http.put<any>(url, data);  // Hacer la solicitud PUT
  }

  // Método genérico para eliminar datos (DELETE)
  deleteData(action: string, id: number): Observable<any> {
    const url = `${this.apiUrl}?action=${action}&id=${id}`;  // URL dinámica con el id
    return this.http.delete<any>(url);  // Hacer la solicitud DELETE
  }

  BorrarDatos(id: number): Observable<any> {
    // Método específico para borrar un cliente (manejo local para datos mock)
    this.loadFromStorage();
    const idx = this.clientesData.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.clientesData.splice(idx, 1);
      this.saveToStorage();
    }
    return of(this.clientesData);
  }
    }

