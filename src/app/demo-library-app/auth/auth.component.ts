import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { LibraryDBService } from '../db-service.service'

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  register = { id: 1, name: '', email: '', phone: '' }
  user: any = null
  error = ''

  // register
  rname = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  remail = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  rphone = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  // login
  lemail = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })
  lphone = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)]
  })

  constructor(private db: LibraryDBService) {}

  async onRegister() {
    this.register.name = this.rname.value
    this.register.email = this.remail.value
    this.register.phone = this.rphone.value
    
    try {
      await this.db.registerUser(this.register)
      alert('Register Success!')
    } catch (e: any) {
      this.error = e.message
    }
  }

  async onLogin() {
    try {
      this.user = await this.db.login(this.lemail.value, this.lphone.value)
    } catch (e: any) {
      this.error = e.message
    }
  }
}