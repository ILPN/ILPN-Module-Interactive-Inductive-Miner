import {Component} from "@angular/core";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {ProcessGraphService} from '../../services/process-graph.service';
import {FormControl, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {IlpnFileDropComponent} from "../../ilpn-code/components/ilpn-file-drop/ilpn-file-drop.component";
import {DropFile} from "../../ilpn-code/utility/drop-file";

@Component({
    standalone: true,
    selector: 'data-input',
    templateUrl: './data-input.component.html',
    styleUrls: ['./data-input.component.scss'],
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        ReactiveFormsModule,
        MatError,
        IlpnFileDropComponent
    ]
})
export class DataInputComponent {

    constructor(private processGraphService: ProcessGraphService) {
    }

    /***************************************************************** File *****************************************************************/
    protected handleFiles(files: Array<DropFile>) {
        if(files.length > 0) {
            this.handleFile(files[0].content)
        }
    }

    protected handleFile(fileContent: string) {
        const eventLog: string[][] = []
        const dom = new DOMParser().parseFromString(fileContent, 'text/xml')
        const traceNodes = dom.getElementsByTagName("trace")
        for (let i = 0; i < traceNodes.length; i++) {
            const events: string[] = []
            const traceEventNodes = traceNodes[i].getElementsByTagName("event")
            const forbiddenNodes = ['start', 'play', 'stop', 'end']
            for (let j = 0; j < traceEventNodes.length; j++) {
                const eventValue = traceEventNodes[j].firstElementChild!.getAttribute("value") as string
                if (forbiddenNodes.includes(eventValue.toLowerCase())) {
                    continue
                }
                events.push(traceEventNodes[j].firstElementChild!.getAttribute("value") as string)
            }
            eventLog.push(events)
        }

        this.processGraphService.createGraph(eventLog)
    }

    /***************************************************************** Manual Input *****************************************************************/
    protected eventLogValidator: ValidatorFn = control => {
        const val = (control?.value as string)?.trim()
        if (!val ||
            val.match(/\+\s*\+/) || // Prevent empty traces
            !val.match(/^[a-zA-Z0-9\s\n+]+$/) ||
            val.startsWith("+") || val.endsWith("+")) {
            return {invalid: true}
        }
        return null
    }

    protected manualInputControl = new FormControl(
`SetPc SetCfp +
SuggestPc SetUpCfp SendInvites ReceiveAnswers FinalizePc FinalizeCfp +
SuggestPc SendInvites SetUpCfp ReceiveAnswers FinalizePc FinalizeCfp +
SuggestPc SendInvites ReceiveAnswers SetUpCfp FinalizePc FinalizeCfp +
SuggestPc SendInvites ReceiveAnswers UpdateInvites SendInvites ReceiveAnswers FinalizePc SetUpCfp FinalizeCfp`,
        [this.eventLogValidator]
    )

    protected parseEventLog() {
        let input = this.manualInputControl.value!
        input = input.replaceAll("\n", " ")
        const result: string[][] = input.split("+").map(rawTrace => {
            rawTrace = rawTrace.trim()
            return rawTrace.split(" ").filter(event => event !== "")
        })
        this.processGraphService.createGraph(result)
    }

}
