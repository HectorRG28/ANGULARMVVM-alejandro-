import { Component } from '@angular/core';
import { ProductosService } from '../productos.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent {
  title = 'angularmvvm';

  productos: any[] = [];
  error: string | null = null;
  data: any;  // Variable para almacenar los datos
  loading: boolean = true;  // Indicador de carga
  myForm: FormGroup;
  editing: boolean = false;
  editingId: number | null = null;


  constructor(private productosService: ProductosService, private fb: FormBuilder) {
    this.myForm = this.fb.group({
      id: [null],
      nombre: [''],
      descripcion: [''],
      precio: [0]
    });
  }


ngOnInit() {
    this.getProductos(); 
    // Cargar los datos cuando el componente se inicializa
  }


  getProductos(): void {
    this.productosService.getData().subscribe({
      next: (data: any[]) => {
        this.productos = data;  // Asignar los datos de productos
        this.loading = false;   // Detener el indicador de carga
      },
      error: (err: any) => {
        this.error = 'Error al cargar productos';  // Manejar errores
        console.error(err);
      }
    });
}

  borrar(valor: number): void {
    console.log('El valor es: ', valor);

    this.productosService.deleteData(valor).subscribe({
      next: () => {
        this.getProductos(); // Refrescar la lista de productos después de borrar
      },
      error: (err) => {
        this.error = 'Error al borrar el producto'; // Manejar errores
        console.error(err);
      }
    });
  }

  editar(valor: number): void {
    console.log('Editar el producto con ID: ', valor);
    this.productosService.getDataById(valor).subscribe({
      next: (data: any) => {
        // Poblar el formulario para edición
        this.myForm.patchValue({
          id: data.id ?? valor,
          nombre: data.nombre ?? data.name,
          descripcion: data.descripcion ?? data.description,
          precio: data.precio ?? data.price
        });
        this.editing = true;
        this.editingId = valor;
      },
      error: (err: any) => {
        this.error = 'Error al obtener los datos del producto'; // Manejar errores
        console.error(err);
      }
    });
  }

  agregar() {
    this.myForm.reset({ id: null, nombre: '', descripcion: '', precio: 0 });
    this.editing = false;
    this.editingId = null;
  }

  saveProducto() {
    const payload = this.myForm.value;
    if (this.editing && this.editingId) {
      this.productosService.putData(this.editingId, payload).subscribe({
        next: () => {
          this.getProductos();
          this.myForm.reset({ id: null, nombre: '', descripcion: '', precio: 0 });
          this.editing = false;
          this.editingId = null;
        },
        error: (err) => {
          this.error = 'Error al actualizar producto';
          console.error(err);
        }
      });
    } else {
      this.productosService.postData(payload).subscribe({
        next: () => {
          this.getProductos();
          this.myForm.reset({ id: null, nombre: '', descripcion: '', precio: 0 });
        },
        error: (err) => {
          this.error = 'Error al crear producto';
          console.error(err);
        }
      });
    }
  }


}













