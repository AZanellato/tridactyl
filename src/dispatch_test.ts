import Dispatcher from "./lib/runtime_dispatch"

const d = new Dispatcher("test")

export const exampleFunction = d.content(async function exampleFunction(
    arg1,
    arg2,
) {
    // Function body
    return arg1 + arg2
})

export const getAsync = d.background(async function getAsync(
    ...target: string[]
) {
    return 42 * sharedFunction()
})

function sharedFunction() {
    // Available in both content and background modes
    // Can be exported or whatever.
    return 42
}

export class Example {
    @d.bg
    async foo(arg1, arg2) {
        return arg1 * arg2
    }

    @d.cn
    async bar(arg1, arg2) {
        return arg1 + arg2
    }
}

export let e = new Example()
