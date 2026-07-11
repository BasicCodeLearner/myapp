/// <reference types="vite/client" />

// TypeScriptに「.vueで終わるファイルはすべてVueのコンポーネントである」と認識させる魔法のコード
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
