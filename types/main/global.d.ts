import { IEntry } from './entryjs/entry';

declare global {
    interface Window {
        entrylms?: any;
        Lang?: any;
        popupHelper?: any;
        EntryStatic?: any;
        ImageCapture?: any;
        sendSync?: any;
        Entry?: IEntry;
    }
}