import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-topstrip',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule],
    templateUrl: './topstrip.component.html'

})
export class AppTopstripComponent {
    router=inject(Router)
    authService = inject(AuthenticationService)

    login(){
        this.authService.logout()
        this.router.navigate(['/auth/login'])
    }

    register(){
        this.authService.logout()
        this.router.navigate(['/auth/register'])
    }
}
