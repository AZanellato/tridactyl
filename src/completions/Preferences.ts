import * as Completions from "@src/completions"
import * as Messaging from "@src/lib/messaging"

class PreferenceCompletionOption extends Completions.CompletionOptionHTML
    implements Completions.CompletionOptionFuse {
    public fuseKeys = []

    constructor(
        public value: string,
        public prefvalue: string
    ) {
        super()
        this.fuseKeys.push(value)
        this.html = html`<tr class="PreferenceCompletionOption option">
            <td class="name">${value}</td>
            <td class="value">${prefvalue}</td>
        </tr>`
    }
}

export class PreferenceCompletionSource extends Completions.CompletionSourceFuse {
    public options: PreferenceCompletionOption[]

    constructor(private _parent) {
        super(
            ["setpref"],
            "PreferenceCompletionSource",
            "Preference",
        )

        this._parent.appendChild(this.node)
    }

    public onInput(exstr: string) {
        return this.filter(exstr)
    }

    public async filter(exstr: string) {
        if (!exstr) {
            this.state = "hidden"
            return
        }
        let [cmd, pref] = this.splitOnPrefix(exstr)
        if (pref === undefined) {
            this.state = "hidden"
            return
        }
        this.lastExstr = exstr
        let preferences = await Messaging.message("native_background", "getPrefs", [])
        this.options = Object.keys(preferences)
            .filter(key => key.startsWith(pref))
            .map(key => new PreferenceCompletionOption(key, preferences[key]))
        if (this.options.length > 0)
            this.state = "normal"
        this.updateChain()
    }
}
