import * as THREE from 'three';
import App from '../App';
import ModalManager from '../UI/ModalManager';

export default class Portal {
  constructor(portalMesh, modalInfo) {
    this.app = new App();
    this.portalMesh = portalMesh;
    this.modalInfo = modalInfo;
    this.modalManager = new ModalManager();

    this.portalOpenMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });

    this.portalCloseMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00f2,
      transparent: true,
      opacity: 1,
    });

    this.portalMesh.material = this.portalCloseMaterial;

    this.prevIsNear = false;
    this.modalIsOpen = false; // Добавляем флаг
  }

  loop() {
    this.character = this.app.world.character.instance;
    if (this.character) {
      const portalPosition = new THREE.Vector3();
      this.portalMesh.getWorldPosition(portalPosition);

      const distance = this.character.position.distanceTo(portalPosition);
      const isNear = distance < 3.5;

      if (isNear) {
        if (!this.prevIsNear) {
          this.modalManager.openModal(this.modalInfo.title, this.modalInfo.description);
          this.portalMesh.material = this.portalOpenMaterial;
        }
        this.prevIsNear = true;
      } else {
        if (this.prevIsNear) {
          this.modalManager.closeModal();
          this.portalMesh.material = this.portalCloseMaterial;
        }
        this.prevIsNear = false;
      }
    }
  }
}
