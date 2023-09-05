import { MessageDescriptor } from "@lingui/core"
import { msg } from "@lingui/macro"

interface Languages {
    locale: string
    msg: MessageDescriptor
    territory?: string
    rtl: boolean
}

export type LOCALES = "en-us" | "nl-nl" | "pseudo" | "zh"

const languages: Languages[] = [
    {
        locale: "en-us",
        msg: msg`English`,
        territory: "US",
        rtl: false,
    },
    {
        locale: "nl-nl",
        msg: msg`Dutch`,
        territory: "NL",
        rtl: false,
    },
    {
        locale: "zh",
        msg: msg`Chinese`,
        territory: "ZH",
        rtl: false,
    },
]

if (process.env.NODE_ENV !== "production") {
    languages.push({
        locale: "pseudo",
        msg: msg`Pseudo`,
        rtl: false,
    })
}

export default languages
