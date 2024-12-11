export default class ModalManager {
  constructor() {
    this.modal = document.getElementById('myModal');
    this.close = document.querySelector('.close');

    if (this.modal && this.close) {
      this.close.addEventListener('click', () => this.closeModal());
    } else {
      console.error('Modal or close button not found!');
    }
  }

  openModal(title, description) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    if (this.modal && modalTitle && modalDescription) {
      modalTitle.innerHTML = title;
      modalDescription.innerHTML = description;
      this.modal.style.display = 'block';
      this.modal.classList.remove('fadeOut');
      this.modal.classList.add('fadeIn');
    } else {
      console.error('Modal or title/description elements not found!');
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('fadeIn');
      this.modal.classList.add('fadeOut');

      setTimeout(() => {
        this.modal.style.display = 'none';
      }, 1);
    } else {
      console.error('Modal not found!');
    }
  }
}
