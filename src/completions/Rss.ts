import * as Messaging from "@src/lib/messaging"
import * as Completions from "@src/completions"

class RssCompletionOption extends Completions.CompletionOptionHTML
    implements Completions.CompletionOptionFuse {
    public fuseKeys = []

    constructor(public url, public title, public type) {
        super()
        this.value = `${url} ${type} ${title}`
        this.fuseKeys.push(url)
        this.fuseKeys.push(title)

        this.html = html`<tr class="RssCompletionOption option">
            <td class="title">${title}</td>
            <td class="content"><a class="url" target="_blank" href=${url}>${url}</a></td>
            <td class="type">${type}</td>
        </tr>`
    }
}

export class RssCompletionSource extends Completions.CompletionSourceFuse {
    public options: RssCompletionOption[] = []
    private shouldSetStateFromScore = true

    constructor(private _parent) {
        super(["rssexec"], "RssCompletionSource", "Feeds")

        this.updateOptions()
        this._parent.appendChild(this.node)
    }

    onInput(...whatever) {
        return this.updateOptions(...whatever)
    }

    private async updateOptions(exstr = "") {
        if (this.options.length < 1) {
            this.options = (await Messaging.messageOwnTab(
                "excmd_content",
                "getRssLinks",
                [],
            )).map(link => {
                let opt = new RssCompletionOption(
                    link.url,
                    link.title,
                    link.type,
                )
                opt.state = "normal"
                return opt
            })
        }
        this.updateChain()
    }
}
