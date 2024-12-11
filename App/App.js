import * as THREE from 'three';
import Camera from './Camera';
import Renderer from './Renderer';
import Loop from './Utils/Loop';
import World from './World/World';
import Resize from './Utils/Resize';
import AssetLoader from './Utils/AssetLoader';
import Preloader from './UI/Preloader';
import InputController from './UI/InputController';
//import GUI from './Utils/GUI';
import ModalManager from './UI/ModalManager';

let instance = null;

export default class App {
  constructor() {
    if (instance) return instance;
    instance = this;
    window.ModalManager = new ModalManager();
    //threejs elements
    this.canvas = document.querySelector('canvas.threejs');
    this.scene = new THREE.Scene();
    //GUI
    //this.gui = new GUI();
    //ui
    this.preloader = new Preloader();
    this.inputController = new InputController();
    //Asset loader
    this.assetLoader = new AssetLoader();
    //world
    this.world = new World();
    //camera and renderer
    this.camera = new Camera();
    this.renderer = new Renderer();
    //extra utils
    this.loop = new Loop();
    this.resize = new Resize();
  }
}
