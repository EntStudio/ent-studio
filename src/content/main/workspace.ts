import { sleep } from "@/utils/utils"
import { BlockExtensionManager } from "./project/blockExtension"

BlockExtensionManager.init()

async function findEntryJS(attempts: number = 3, timeout: number = 3) {
  for (let i = attempts; i > 0; i--) {
    for (const script of document.scripts) {
      if (!script.src)
        continue

      try {
        const url = new URL(script.src)
        const filename = url.pathname.split('/').pop() ?? ''

        if (!(['entry.min.js', 'entry.js'].includes(filename)))
          continue

        return {
          script,
          version: url.searchParams.get('v')
        }


      } catch (e) {
        continue
      }
    }

    if (i > 1) {
      console.warn("EntryJS를 찾지 못했습니다. 다시 시도하는 중...")
      await sleep(timeout)
    }
  }

  throw new Error("EntryJS를 찾지 못했습니다")
}

let entryInfo = await findEntryJS()

console.log(`entry.js 확인 완료 (버전 ${entryInfo.version ?? '알 수 없음'})`)

if (window.Entry) {
  onEntryLoad()
}
else {
  entryInfo.script.addEventListener('load', onEntryLoad)
}

function onEntryLoad() {
  // TODO: 여기에 이벤트 추가
}




