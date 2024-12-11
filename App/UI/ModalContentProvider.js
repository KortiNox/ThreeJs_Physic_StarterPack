export default class ModalContentProvider {
  constructor() {
    this.modalContents = {
      contactMe: {
        title: 'Contact',
        description: 'Telegram: KortiNox',
      },
    };
  }

  getModalInfo(portalName) {
    return this.modalContents[portalName];
  }
}
