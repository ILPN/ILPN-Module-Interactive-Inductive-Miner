import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";


@Component({
  selector: 'app-ilpn-file-display',
  standalone: true,
    imports: [
        NgClass
    ],
  templateUrl: './ilpn-file-display.component.html',
  styleUrl: './ilpn-file-display.component.css'
})
export class IlpnFileDisplayComponent  {

    constructor() {
    }

    @Input() bold: boolean | undefined = false;
    @Input() contentText: string | undefined;
    @Input() hover: boolean = false;

    resolveSquareContent(): string {
        return this.contentText ?? '?';
    }

}
