import * as THREE from 'three';
import App from '../App';
import { inputStore } from '../Utils/Store';

export default class AnimationController {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.avatar = this.app.world.character.avatar;

    inputStore.subscribe((input) => {
      this.onInput(input);
    });

    this.instantiatedAnimations();
  }

  instantiatedAnimations() {
    if (!this.avatar || !this.avatar.animations || this.avatar.animations.length === 0) {
      console.error('Avatar or animations not found!');
      return; // Выход из функции, если аватара или анимаций нет
    }
    if (!this.avatar.scene) {
      console.error('Avatar.scene is undefined!');
      return;
    }

    const idle = this.avatar.animations[0];
    this.mixer = new THREE.AnimationMixer(this.avatar.scene);

    this.animations = new Map();
    this.avatar.animations.forEach((clip) => {
      this.animations.set(clip.name, this.mixer.clipAction(clip));
    });

    this.currentAction = this.animations.get('newIdle');
    this.currentAction.play();
  }

  playAnimation(name) {
    if (this.currentAction === this.animations.get(name)) return;
    const action = this.animations.get(name);
    action.reset();
    action.play();
    action.crossFadeFrom(this.currentAction, 0.2);

    this.currentAction = action;
  }

  onInput(input) {
    if (input.forward || input.backward || input.left || input.right) {
      this.playAnimation('newRun');
    } else {
      this.playAnimation('newIdle');
    }
  }

  loop(deltaTime) {
    this.mixer?.update(deltaTime); //Добавлен оператор ?. для защиты от undefined
  }
}
