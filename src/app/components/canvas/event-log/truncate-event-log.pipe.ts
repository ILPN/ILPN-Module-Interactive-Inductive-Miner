import {Pipe, PipeTransform} from "@angular/core";
import {PhysicsHelper} from "../../../helper/PhysicsHelper";

@Pipe({
    standalone: true,
    name: 'truncateEventLog'
})
export class TruncateEventLogPipe implements PipeTransform {
    transform(eventLog: string[], eventLogWidth: number): string {
        const text = eventLog.join(' ').trim()
        const maxChars = Math.floor(eventLogWidth / PhysicsHelper.characterWidth)
        if (text.length + 2 > maxChars) {
            return text.substring(0, maxChars - 5) + '...' // Truncate and add ellipsis
        }
        return text
    }
}
