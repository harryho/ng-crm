/**
 * Angular  decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  DoCheck
} from '@angular/core';
import { AppState } from '../app.service';
import { User } from '../_models'
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'dashboard',
  // encapsulation: ViewEncapsulation.None,
  styles: [`
  .dash-card{
    width: 100%;
    margin-right: 6px;    
    margin-bottom: 10px;
  }
  .card-header{
      font-size:16;
      margin-top: -5px;
  }`],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {


  constructor(
    public appState: AppState,
    private router: Router
  ) { }

  public lineChartData: Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType: string = 'line';
  public pieChartType: string = 'pie';

  public lineChartOptions: any = {};

  // Pie
  public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];

  public randomizeType(): void {
    this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public ngOnInit() {

  }
}
