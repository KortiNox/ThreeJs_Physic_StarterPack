import { createStore } from 'zustand/vanilla';

const assetsToLoad = [
  {
    id: 'avatar',
    path: 'static/draco/models/newAvatar.glb',
    type: 'model',
  },
  {
    id: 'enviroment',
    path: 'static/draco/models/enviroment.glb',
    type: 'model',
  },
];

const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));

export default assetStore;
