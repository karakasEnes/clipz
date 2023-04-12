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
  }

  unregister(id: string) {
    this.modalsData = this.modalsData.filter((el) => el.id !== id);
  }

  isModalOpen(id: string): boolean {
    return Boolean(this.modalsData.find((e) => e.id === id)?.visible);
  }

  toggleModal(id: string) {
    const modal = this.modalsData.find((e) => e.id === id);

    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
