import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Staff } from '../../models/domain/staff';
import { StaffService } from '../../services/staff.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'staff-form',
  templateUrl: './staff-form.component.html',
  styles: [
    `
      .section-title { margin: 16px 0 8px 0; font-weight: 600; }
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
    MatSlideToggleModule,
    MatFormFieldModule,
  ],
})
export class StaffFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(StaffService);
  fb = inject(FormBuilder);

  AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/300?img=0';

  staffForm: FormGroup;
  imageWidth = 50;
  imageMargin = 5;

  pageTitle = signal('');
  member = signal<Staff | null>(null);

  roleOptions = [
    'Owner',
    'Sales Leader',
    'Sales',
    'Engineer',
    'Designer',
    'Operations',
    'Support',
    'Finance',
  ];

  statusOptions = ['active', 'locked', 'invited'];

  ValidatorMessages = {
    firstname: { required: 'First name is required.' },
    lastname: { required: 'Last name is required.' },
    email: { required: 'Email is required.', email: 'Email must be valid.' },
    mobile: { required: 'Mobile is required.' },
    company: { required: 'Company is required.' },
    role: { required: 'Role is required.' },
  } as const;

  ngOnInit(): void {
    this.staffForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      company: ['', Validators.required],
      role: ['Sales', Validators.required],
      status: ['active', Validators.required],
      city: [''],
      state: [''],
      isVerified: [false],
      avatarUrl: [''],
    });

    this.route.paramMap.subscribe(async (params) => {
      const idParam = params.get('id');
      if (idParam) {
        const id = Number(idParam);
        const member = await firstValueFrom(this.service.get(id));
        if (member) {
          this.staffForm.patchValue({
            firstname: member.firstname,
            lastname: member.lastname,
            email: member.email,
            mobile: member.mobile,
            company: member.company,
            role: member.role,
            status: member.status,
            city: member.city,
            state: member.state,
            isVerified: member.isVerified,
            avatarUrl: member.avatarUrl,
          });
          this.member.set(member);
          this.pageTitle.set('Edit Staff Member');
        } else {
          this.pageTitle.set('Staff Member Not Found');
        }
      } else {
        this.pageTitle.set('New Staff Member');
      }
    });
  }

  saveMember(): void {
    if (!this.staffForm.valid) return;
    const v = this.staffForm.value;
    const existing = this.member();
    const saved: Staff = {
      id: existing?.id ?? 0,
      firstname: v.firstname,
      lastname: v.lastname,
      company: v.company,
      role: v.role,
      email: v.email,
      mobile: v.mobile,
      city: v.city ?? '',
      state: v.state ?? '',
      status: v.status,
      isVerified: !!v.isVerified,
      avatarUrl: v.avatarUrl || this.AVATAR_PLACEHOLDER,
    };
    this.service.save(saved).subscribe(() => this.onSaveComplete());
  }

  onSaveComplete(): void {
    this.staffForm.reset();
    this.router.navigate(['/staff']);
  }
}