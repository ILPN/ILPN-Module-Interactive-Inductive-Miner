import {Component, Input} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbstractFileUploadComponent} from "./abstract-file-upload.component";
import {FileReaderService} from "../../utility/file-reader.service";
import {IlpnFileDisplayComponent} from "../ilpn-file-display/ilpn-file-display.component";

@Component({
  selector: 'app-ilpn-file-drop',
  standalone: true,
    imports: [
        IlpnFileDisplayComponent
    ],
  templateUrl: './ilpn-file-drop.component.html',
  styleUrl: './ilpn-file-drop.component.css'
})
export class IlpnFileDropComponent extends AbstractFileUploadComponent {

    @Input() descriptionText: string = '';
    @Input() showText = true;
    @Input() contentText: string | undefined;
    @Input() bold: boolean | undefined;

    constructor(fileReader: FileReaderService, http: HttpClient) {
        super(fileReader, http);
    }

    fileSelected(e: Event) {
        this.processFiles((e.target as HTMLInputElement)?.files);
    }
}
