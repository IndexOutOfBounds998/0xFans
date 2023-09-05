import { MessageDescriptor } from "@lingui/core"
import { msg } from "@lingui/macro"

interface Languages {
    locale: string
    msg: MessageDescriptor
    territory?: string
    rtl: boolean
}

export type LOCALES = "en-US" | "pseudo" | "zh-CN"

const languages: Languages[] = [
    {
        locale: "en-US",
        msg: msg`English`,
        territory: "US",
        rtl: false,
    },
    {
        locale: "zh-CN",
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
