import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { User } from '../../models/domain/user';
import { UserService } from '../../services/user.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { NumberValidators } from '../../shared/number.validator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styles: [
    `
      .button-float-right {
        float: right;
      }
      .form-field {
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
      }
      .section-title {
        margin: 16px 0 8px 20px;
        font-weight: 600;
      }
    `,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormField,
    MatLabel,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
})
export class UserFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(UserService);
  fb = inject(FormBuilder);

  AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/300?img=0';

  userForm: FormGroup;
  imageWidth: number = 50;
  imageMargin: number = 5;

  pageTitle = signal('');
  user = signal<User | null>(null);

  ValidatorMessages = {
    firstname: {
      required: 'First name is required.',
      minlength: 'First name must be at least 2 characters.',
      maxlength: 'First name cannot exceed 100 characters.',
    },
    lastname: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least 2 characters.',
      maxlength: 'Last name cannot exceed 100 characters.',
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email address.',
    },
    mobile: { required: 'Mobile is required.' },
    street: { required: 'Street is required.' },
    city: { required: 'City is required.' },
    country: { required: 'Country is required.' },
    zipcode: { required: 'Zipcode is required.' },
  } as const;

  getAvatar(user: User | null) {
    return user && user.avatarUrl ? user.avatarUrl : this.AVATAR_PLACEHOLDER;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      rewards: [0, NumberValidators.range(0, 150)],
      phone: [''],
      mobile: ['', [Validators.required]],
      membership: ['standard', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: [''],
        zipcode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      avatarUrl: [''],
    });

    this.route.paramMap.subscribe(async (params) => {
      const idParam = params.get('id');
      if (idParam) {
        const id = Number(idParam);
        const user = await firstValueFrom(this.service.get(id));
        if (user) {
          this.userForm.patchValue({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            rewards: user.rewards,
            phone: user.phone,
            mobile: user.mobile,
            membership: user.membership,
            address: user.address,
            avatarUrl: user.avatarUrl,
          });
          this.user.set(user);
          this.pageTitle.set('Edit User');
        } else {
          this.pageTitle.set('User Not Found');
        }
      } else {
        this.pageTitle.set('New User');
      }
    });
  }

  saveUser(): void {
    if (this.userForm.dirty && this.userForm.valid) {
      const v = this.userForm.value;
      const existing = this.user();
      const saved: User = {
        id: existing?.id ?? 0,
        firstname: v.firstname,
        lastname: v.lastname,
        fullname: `${v.firstname} ${v.lastname}`,
        email: v.email,
        mobile: v.mobile,
        phone: v.phone ?? null,
        address: v.address,
        membership: v.membership,
        rewards: v.rewards,
        avatarUrl: v.avatarUrl || this.AVATAR_PLACEHOLDER,
      };
      this.service.save(saved).subscribe(() => this.onSaveComplete());
    } else if (!this.userForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.userForm.reset();
    this.router.navigate(['/user']);
  }
}