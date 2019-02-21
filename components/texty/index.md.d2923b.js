(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{1132:function(t,e){t.exports={content:["section",["h2","怎么使用"],["h3","安装"],["pre",{lang:"bash",highlighted:'$ <span class="token function">npm</span> <span class="token function">install</span> rc-texty --save'},["code","$ npm install rc-texty --save"]],["h3","使用"],["pre",{lang:"jsx",highlighted:'<span class="token keyword">import</span> Texty <span class="token keyword">from</span> <span class="token string">\'rc-texty\'</span><span class="token punctuation">;</span>\nReactDOM<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Texty</span><span class="token punctuation">></span></span>text<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Texty</span><span class="token punctuation">></span></span><span class="token punctuation">,</span> mountNode<span class="token punctuation">)</span><span class="token punctuation">;</span>'},["code","import Texty from 'rc-texty';\nReactDOM.render(<Texty>text</Texty>, mountNode);"]]],meta:{order:3,title:{"zh-CN":"文字动画","en-US":"TextyAnim"},filename:"components/texty/index.md"},description:["section",["p","一个针对文字标题的进行进出场动画的组件，提供非富的动画效果，也可以随自已的需求来配置完成不同的效果，具体参数请参见 ",["a",{title:null,href:"/api/texty"},"API"],";"],["h2","何时使用"],["ul",["li",["p","在进出场的动画元素里，针对标题或正文文字进行间隔性动画时使用。"]],["li",["p","每个词语的不同时间进场的动画。"]]]],toc:["ul",["li",["a",{className:"bisheng-toc-h2",href:"#怎么使用",title:"怎么使用"},"怎么使用"]],["li",["a",{className:"bisheng-toc-h2",href:"#API",title:"API"},"API"]]],api:["section",["h2","API"],["table",["thead",["tr",["th","参数"],["th","类型"],["th","默认"],["th","说明"]]],["tbody",["tr",["td","className"],["td","string"],["td",["code","null"]],["td","组件自定义样式."]],["tr",["td","prefixCls"],["td","string"],["td",["code","texty"]],["td","组件默认自带样式."]],["tr",["td","type"],["td","string"],["td",["code","top"]],["td","动画的样式, 提供： 'left' ","|"," 'right' ","|"," 'top' ","|"," 'bottom' ","|","'alpha' ","|"," 'scale' ","|","  'scaleX' ","|"," 'scaleBig' ","|"," 'scaleY' ","|"," 'mask-bottom' ","|"," 'mask-top' ","|","  'flash' ","|"," 'bounce' ","|"," 'swing' ","|"," 'swing-y' ","|"," 'swing-rotate'."]],["tr",["td","mode"],["td","string"],["td",["code","smooth"]],["td","动画的类型，如倒放，随机出现等。提供： 'smooth' ","|"," 'reverse' ","|"," 'random' ","|"," 'sync'"]],["tr",["td","duration"],["td","number"],["td",["code","450"]],["td","除  'flash' ","|"," 'bounce' ","|"," 'swing' ","|"," 'swing-y' ","|"," 'swing-rotate' 外的动画时间"]],["tr",["td","delay"],["td","number"],["td",["code","0"]],["td","动画开始前的延时."]],["tr",["td","interval"],["td","number ","|"," func"],["td",["code","50"]],["td","每单个文字的间隔出现的时间, 如果是 ",["code","function: (e: { key: string }) => number."]," Key 是 ",["code","split"]," 后的单个文字的加当前文字的序列，如 text, key 是 ",["code","t-0"],"、",["code","e-1"],"、",["code","x-2"],"、",["code","t-3"],"."]],["tr",["td","split"],["td","func"],["td",["code","null"]],["td","自定义将文字拆分，需要返回个数组，默认将每个字符拆分。"]]]],["h3","Inherit TweenOneGroup API"],["p",["a",{title:null,href:"/api/tween-one#TweenOneGroup-API"},"TweenOneGroup API"]],["table",["thead",["tr",["th","参数"],["th","类型"],["th","默认"],["th","说明"]]],["tbody",["tr",["td","appear"],["td","boolean"],["td","true"],["td","元素是否有刚开始的进场动画"]],["tr",["td","enter"],["td","object / array / func"],["td",["code","null"]],["td","进场的 tween-one 数据，如果是数组是 tween-one 的 timeline。 func 参照 queue-anim, callbac({ key, index })"]],["tr",["td","leave"],["td","object / array / func"],["td",["code","null"]],["td","出场时的数据，同上"]],["tr",["td","onEnd"],["td","func"],["td","-"],["td","每个动画结束后回调"]],["tr",["td","animatingClassName"],["td","array"],["td",["code","['tween-one-entering', 'tween-one-leaving']"]],["td","进出场的样式，如果是组件形式，需把 className 带到你的组件里"]],["tr",["td","exclusive"],["td","boolean"],["td","false"],["td","是否允许在切换时立即执行新的动画。 ",["code","enter => leave"],"：立即执行离开动画"]],["tr",["td","component"],["td","React.Element/String"],["td","div"],["td","需要替换的标签"]]]]]}}}]);