import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalsData: IModal[] = [];

  constructor() {}

  register(id: string) {
    this.modalsData.push({
      id,
      visible: false,
    });
    console.log(this.modalsData);
  }

  isModalOpen() {
    return true;
  }

  toggleModal() {
    // this.visible = !this.visible;
  }
}
