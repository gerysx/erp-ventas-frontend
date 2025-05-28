import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService, Cliente } from './cliente.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  form!: FormGroup;
  editando = false;
  clienteEditandoId: number | null = null;
  esAdmin = true; // Añadido

  constructor(private clienteService: ClienteService, private fb: FormBuilder,  private auth: AuthService) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.esAdmin();
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.listar().subscribe((res) => (this.clientes = res));
  }

  guardar() {
    if (this.form.invalid) return;

    const cliente = this.form.value;
    if (this.editando && this.clienteEditandoId !== null) {
      this.clienteService.actualizar(this.clienteEditandoId, cliente).subscribe(() => {
        this.resetForm();
        this.cargarClientes();
      });
    } else {
      this.clienteService.crear(cliente).subscribe(() => {
        this.resetForm();
        this.cargarClientes();
      });
    }
  }

  editar(c: Cliente) {
    this.editando = true;
    this.clienteEditandoId = c.id || null;
    this.form.patchValue(c);
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar cliente?')) {
      this.clienteService.eliminar(id).subscribe(() => this.cargarClientes());
    }
  }

  resetForm() {
    this.editando = false;
    this.clienteEditandoId = null;
    this.form.reset();
  }
}
