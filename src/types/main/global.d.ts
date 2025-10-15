import { IEntry } from './entryjs/entry';

declare global {
    declare module globalThis {
        var entrylms: any;
        var Lang: any;
        var popupHelper: any;
        var EntryStatic: any;
        var ImageCapture: any;
        var sendSync: any;
        var Entry: IEntry;
    }
    interface Window {
        Entry: any;
    }
}

export {};