import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  usuarios: any[] = [];
  roles = ['EMPLEADO', 'ADMIN'];
  editando: boolean = false;
  usuarioEditandoId: number | null = null;

  displayedColumns = ['nombre', 'correo', 'rol', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      rol: ['EMPLEADO', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>('/api/usuarios').subscribe((data) => {
      this.usuarios = data;
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const data = this.form.value;
    if (!this.editando && !data.password) return;

    const request = this.editando
      ? this.http.put(`/api/usuarios/${this.usuarioEditandoId}`, data)
      : this.http.post('/api/usuarios', data);

    request.subscribe({
      next: () => {
        this.cancelar();
        this.cargarUsuarios();
      },
      error: (err) => alert(err.error?.mensaje || 'Error al guardar usuario'),
    });
  }

  editar(usuario: any) {
    this.editando = true;
    this.usuarioEditandoId = usuario.id;
    this.form.patchValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '',
      rol: usuario.rol,
    });
  }

  cancelar() {
    this.editando = false;
    this.usuarioEditandoId = null;
    this.form.reset({ rol: 'EMPLEADO' });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Eliminar usuario',
        mensaje: '¿Estás seguro de que quieres eliminar este usuario?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.http.delete(`/api/usuarios/${id}`).subscribe({
          next: () => this.cargarUsuarios(),
          error: (err) =>
            alert(err.error?.mensaje || 'Error al eliminar usuario'),
        });
      }
    });
  }
}
