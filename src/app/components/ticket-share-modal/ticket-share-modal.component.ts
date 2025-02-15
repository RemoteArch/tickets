import { Component, EventEmitter, Input, OnInit, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { TicketShare } from '../../shared/models/ticket-share.model';

@Component({
  selector: 'app-ticket-share-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if(isShow){
      <div class="fixed w-full top-0 left-0 bg-black/50 h-screen px-2 flex flex-col justify-center items-center">
      
      <div class="w-full max-w-md">
          <div class="bg-white rounded-2xl shadow-lg p-8">
              <p class="text-center pb-2 mb-4 border-b-2">partage du tickets {{ticket.name}}</p>
              <!-- Formulaire de saisie -->
              <div class="pt-2">
                  <!-- Input téléphone -->
                  <div [class.hidden]="page != 0">
                      <div class="flex items-center w-full space-x-3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.88 1.88 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.29 11.29 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.88 1.88 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75z" clip-rule="evenodd"/></svg>
                          <input 
                              placeholder="Entrez le Numéro de téléphone"
                              [(ngModel)]="phoneNumber"
                              type="tel" 
                              class="bg-transparent focus:outline-none w-full transition-colors"
                          />
                      </div>
                  </div>

                  <!-- Sélection contact -->
                  <div [class.hidden]="page != 1">
                      <div class="flex items-center w-full space-x-3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <select
                              [(ngModel)]="phoneNumber"
                              class="bg-transparent focus:outline-none w-full">
                              @for(addres of address; track $index){
                                <option [value]="addres.phone">{{addres.name}}</option>
                              }@empty {
                                <option selected value="">Sélectionner un contact</option>
                              }
                          </select>
                      </div>
                  </div>

                  <div [class.hidden]="page != 2">
                      <div class="space-y-2">
                        <p class="mt-2">Voulez vous l'enregistrer comme conctact ? </p>
                        <div class="flex gap-4 pt-4">
                          <button (click)="submitPhoneName(false)" class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                              <i class="icon-x"></i>
                              <span>Non</span>
                          </button>
                          <button (click)="page = 3" class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                              <i class="icon-check"></i>
                              <span>oui</span>
                          </button>
                        </div>
                      </div>
                  </div>

                  <div [class.hidden]="page != 3">
                      <div class="flex items-center w-full space-x-3 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.88 1.88 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.29 11.29 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.88 1.88 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75z" clip-rule="evenodd"/></svg>
                          <input 
                              placeholder="Entrez le nom du conctact"
                              [(ngModel)]="phoneName"
                              type="tel" 
                              class="bg-transparent focus:outline-none w-full transition-colors"
                          />
                      </div>
                      
                  </div>

                  <p class="text-red-500 text-sm text-center">{{errorText}}</p>

                  <div [class.hidden]="![0,1].includes(page)" class="flex justify-center text-primary py-2">
                    <button [class.hidden]="page != 0" (click)="page = 1" class="text-center">Selectionner parmis mes conctact</button>
                    <button [class.hidden]="page != 1" (click)="page = 0" class="text-center" >  Entrez un nouveau conctact</button>
                  </div>

                  <button [class.hidden]="page != 3" (click)="submitPhoneName(true)" class="w-full px-4 py-3 mt-4 rounded-lg bg-blue-600 text-white text-center">
                    Enregistrer
                  </button>

                  <div [class.hidden]="![0,1].includes(page)" class="flex gap-4 pt-4">
                      <button (click)="hide()" class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                          <i class="icon-x"></i>
                          <span>Annuler</span>
                      </button>
                      <button (click)="onConfirm()" class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <i class="icon-check"></i>
                          <span>Confirmer</span>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      </div>
    }
  `
})
export class TicketShareModalComponent implements OnInit {
  ticket!: any;
  userPhone!: string;
  _ticketSareds: TicketShare[] = []
  @Output() shared = new EventEmitter<void>();
  
  page = 1
  isShow = false
  errorText = ""
  lastTicketShare!: any
  address:any[] = []
  phoneNumber: string = '';
  phoneName: string = ''
  
  
  show(ticket:any , userPhone:string , address:any , ){
    this.isShow = true
    this.ticket = ticket
    this.userPhone =  userPhone
    this.address = address
  }

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.apiService.read("TicketShare").subscribe({
      next:(data:any[])=>{
        this._ticketSareds = data
        console.log(this._ticketSareds)
      }
    })
  }

  alert(text:string){
    this.errorText = text
  }


  createShare(){
    this.apiService.create('TicketShare',this.lastTicketShare ).subscribe({
      next: (data) => {
        this.shared.emit()
        this.hide()
        console.log(data)
      },
      error: (error) => {
        this.alert('Erreur lors du partage du billet');
        console.error('Share ticket error:', error);
      }
    })
  }

  submitPhoneName(name:boolean){
    try{
      if(name){
        if(!this.phoneName || this.phoneName == "") throw new Error("veulliez entrez le numero de telephone");
  
        if(!this.lastTicketShare) throw new Error("vous n'avez pas encore definie de partage");

        this.lastTicketShare.receiverName = this.phoneName;
      }

      this.createShare()

    }catch(error){
      this.alert(error+"")
    }
  }

  onConfirm() {
    try{

      if (!this.phoneNumber) {
        throw new Error('Veuillez entrer un numéro de téléphone')
      }
  
      if(this.phoneNumber.length != 9){
        throw new Error('le numero doi avoir 9 chiffre');
      }

      if(this.phoneNumber == this.userPhone){
        throw new Error(" vous ne pouvez pas partager a vous meme ")
      }

      this.lastTicketShare = {
        ticketId: this.ticket.id,
        senderPhone: this.userPhone,
        receiverPhone: '237'+this.phoneNumber
      }
      if(this.page == 1){
        let name = null
        for(let add of this.address){
          if(add.phone == this.phoneNumber){
            name = add.name
            break;
          }
        }
        this.lastTicketShare.receiverName = name
        this.createShare()
      }else{
        this.page = 2
      }
    }catch(error){
      this.alert(error+"")
    }
  }

  hide(){
    this.isShow = false
    this.page = 1
    this.errorText = ""
    this.lastTicketShare = null
    this.address = []
    this.phoneNumber =  '';
    this.phoneName = ''
  }
}
