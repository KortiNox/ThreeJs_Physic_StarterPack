import { inputStore } from '../Utils/Store';

export default class InputController {
  constructor() {
    this.startListening();
    this.inputStore = inputStore;
    this.keyPressed = {};
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.joystick = document.getElementById('joystick');
    this.joystickKnob = document.getElementById('joystick-knob');
    this.joystickRadius = 50; // Радиус области, где может двигаться джойстик
    this.isJoystickActive = false;

    this.setupJoystick();
  }

  startListening() {
    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));

    // Удаляем обработчики для сенсорных событий, если они есть
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchend', this.onTouchEnd);
  }

  setupJoystick() {
    this.joystick.addEventListener('touchstart', (event) => this.onJoystickTouchStart(event));
    this.joystick.addEventListener('touchmove', (event) => this.onJoystickTouchMove(event));
    this.joystick.addEventListener('touchend', (event) => this.onJoystickTouchEnd(event));
  }

  onJoystickTouchStart(event) {
    event.preventDefault(); // Предотвращаем прокрутку страницы
    this.isJoystickActive = true;
    const touch = event.touches[0];
    this.updateJoystickPosition(touch.clientX, touch.clientY);
  }

  onJoystickTouchMove(event) {
    if (!this.isJoystickActive) return;
    const touch = event.touches[0];
    this.updateJoystickPosition(touch.clientX, touch.clientY);
  }

  onJoystickTouchEnd() {
    this.isJoystickActive = false;
    this.joystickKnob.style.transform = 'translate(0, 0)';
    inputStore.setState({ forward: false, backward: false, left: false, right: false });
  }

  updateJoystickPosition(clientX, clientY) {
    const rect = this.joystick.getBoundingClientRect();
    const centerX = rect.left + this.joystickRadius;
    const centerY = rect.top + this.joystickRadius;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), this.joystickRadius);

    this.joystickKnob.style.transform = `translate(${distance * Math.cos(angle)}px, ${
      distance * Math.sin(angle)
    }px)`;

    // Определяем направления движения
    if (distance > this.joystickRadius / 2) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        inputStore.setState({ left: deltaX < 0, right: deltaX > 0 });
      } else {
        inputStore.setState({ forward: deltaY < 0, backward: deltaY > 0 });
      }
    } else {
      inputStore.setState({ forward: false, backward: false, left: false, right: false });
    }
  }

  onKeyDown(event) {
    if (this.keyPressed[event.code]) return;
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        inputStore.setState({ forward: true });
        break;
      case 'KeyA':
      case 'ArrowLeft':
        inputStore.setState({ left: true });
        break;
      case 'KeyS':
      case 'ArrowDown':
        inputStore.setState({ backward: true });
        break;
      case 'KeyD':
      case 'ArrowRight':
        inputStore.setState({ right: true });
        break;
    }
    this.keyPressed[event.code] = true;
  }

  onKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        inputStore.setState({ forward: false });
        break;
      case 'KeyA':
      case 'ArrowLeft':
        inputStore.setState({ left: false });
        break;
      case 'KeyS':
      case 'ArrowDown':
        inputStore.setState({ backward: false });
        break;
      case 'KeyD':
      case 'ArrowRight':
        inputStore.setState({ right: false });
        break;
    }
    this.keyPressed[event.code] = false;
  }
}
