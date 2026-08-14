import {DotLottie} from '@lottiefiles/dotlottie-web';
import wasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm';

// Prevent the player from fetching its WebAssembly module from a CDN.
// Frontend and editor run in separate bundles and thus each need to
// point the player at the module emitted by their own build.
DotLottie.setWasmUrl(wasmUrl);

export {DotLottie};
