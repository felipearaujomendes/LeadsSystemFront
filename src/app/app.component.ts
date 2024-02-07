import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    CommonModule,
    HttpClientModule,
    MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  
})
export class AppComponent {
  title = 'system-leads';
  private destroy$ = new Subject<void>();
  constructor(private _formBuilder: FormBuilder,private http: HttpClient) {

    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.http.get<any[]>('https://localhost:44301/api/Leads/GetInvited')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.leads = data;
      });

    this.http.get<any[]>('https://localhost:44301/api/Leads/GetAccpted')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.leadsAccept = data;
      });
  }
  leads: any[] = [];
  leadsAccept: any[] = [];
  
  ngOnInit(): void {
    this.getLeads();
    this.getLeadsAccept();
  }
  
  getLeads() {
    this.http.get<any[]>('https://localhost:44301/api/Leads/GetInvited').subscribe(data => {
      this.leads = data;
    });
  }

  getLeadsAccept() {
    this.http.get<any[]>('https://localhost:44301/api/Leads/GetAccpted').subscribe(data => {
      this.leadsAccept = data;
    });
  }

  declinedLead(leadId: number): void {
    debugger;
    const apiUrl = `https://localhost:44301/api/Leads/Declined`;

    const requestBody = {
      leadId: leadId
    };

    this.http.post(apiUrl, requestBody).subscribe(
      () => {
        console.log('Lead Declined with success!');
        // Lógica adicional após o sucesso
      },
      (error) => {
        console.error('Error declining lead:', error);
        // Lógica adicional em caso de erro
      }
    );
    this.load();
  }

  
  acceptLead(record: any): void {
    debugger;
    const apiUrl = `https://localhost:44301/api/Leads/Accepted`;

    const requestBody = {
      leadId: record.leadId,
      price: record.price
    };

    this.http.post(apiUrl, requestBody).subscribe(
      () => {
        console.log('Lead Declined with success!');
        // Lógica adicional após o sucesso
      },
      (error) => {
        console.error('Error declining lead:', error);
        // Lógica adicional em caso de erro
      }
    );
   this.load();
  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  load() {
    // Gere um parâmetro de consulta exclusivo para evitar o cache
    const timestamp = new Date().getTime();
    // Adicione o parâmetro de consulta à URL
    const urlWithTimestamp = location.href + `?timestamp=${timestamp}`;
    
    // Atualize a página
    location.href = urlWithTimestamp;
  }
  
}
