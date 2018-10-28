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
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
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
    display: block;
  }
  .dash-card-inline{
    width: 100%;
    margin-right: 6px;
    margin-bottom: 0px;
    padding-top:12px;
    padding-bottom:0px;
    display: inline-flex;
  }
  .card-header{
      font-size:16;
      margin-top: -5px;
  }`],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  colNum: number = 4;
  rowHeight = '120px';
  chartColNum = 2;
  chartRowHeight = '450px';
  cardClass = 'dash-card';

  mediaQueryList: any = null;
  mediaQueryMin: any = null;
  isMobile = false;

  constructor(
    public appState: AppState,
    private router: Router,
    breakpointObserver: BreakpointObserver,
    mediaMatcher: MediaMatcher) {
    this.mediaQueryList = mediaMatcher.matchMedia('(min-width: 640px)');
    this.mediaQueryMin = mediaMatcher.matchMedia('(min-width: 1000px)');


    breakpointObserver.observe([
      // Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      if (result.matches) {
        this.isMobile = true;
        this.colNum = this.mediaQueryList.matches ? 2 : 1;
        this.chartColNum = 1

        this.chartRowHeight = this.mediaQueryList.matches ? '300px' : '240px';
        this.cardClass = 'dash-card-inline';
      }
    });


  }

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
    if (this.isMobile) {
      this.colNum = this.mediaQueryList.matches ? 2 : 1;
      this.chartRowHeight = this.mediaQueryList.matches ? '300px' : '240px';
      this.cardClass = 'dash-card-inline';
    }
    else {
      this.colNum = this.mediaQueryMin.matches ? 4 : 2;
      this.chartRowHeight = '450px'
      this.cardClass = 'dash-card'
    }
  }
}
